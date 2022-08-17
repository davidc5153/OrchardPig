/**
 * POST /order
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const JWT = require('jsonwebtoken');
const LAYER = require('/opt/nodejs/layer'); // The lambda layer for DB operations
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

/**
 * POST /order
 *  
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.handler = async (event, context) => {
    console.log("POST-ORDER");
    console.dir(event);
    let response = {};
    let error = null;
    let cartFromDb = false;

    try {

        let userId = null;
        try {
            userId = LAYER.getAuthToken(event);
        } catch (err) {
            console.warn('Error retrieving token. Assuming GUEST user.');
            console.dir(err);
        }

        await LAYER.beginTransaction().catch( (err) => {
            response.statusCode = 500;
            throw err;
        });

        // Incoming format: { user: { firstName: <name>, etc... }, cart: { [ [<id>, <qty>], [<id>, <qty>], ... ] } }
        // Or ... No body - Retrieve cart from the database
        if (event.body) {

            event = JSON.parse(event.body);

            // We have a payload - Possibly a guest user
            // Add or update the user in the DB
            if (event.user || !userId) {
                // Returns: {id: <userId>, accessToken: <token>}
                let userIdentification = await LAYER.createOrModifyUser(event.user, userId);
                userId = userIdentification.id;
            }
        }

        // Read all the user data from the DB (inc addresses)
        let user = await LAYER.getUser(userId, null, true, false, false); // User data, active users only, no password

        // Read products for order creation and calculate order totals 
        let cart = event.cart;
        if (!cart || !Array.isArray(cart) || cart.length < 1) {
            // If there are no products in the cart sent, attempt to read the user's cart from the DB
            cart = await getCart(userId);
            if (cart.length < 1) { throw "No cart items found to generate an order."; }
            cartFromDb = true;
        } else {
            // If no body, MUST have userId in token
            if (!userId) {
                throw "Unable to save order. A valid user token OR user and cart data must be sent to create an order.";
            }
        }

        let products = [];
        let price = 0;
        let weight = 0;
        let tax = 0;
        for (let i=0; i<cart.length; i++) {
            let product = null;
            let quantity = null;
            let currentCartItem = cart[i];
            if (currentCartItem && Array.isArray(currentCartItem) && currentCartItem.length===2) {
                // Cart item is from the front-end in the form [ [<product_id>, <quantity> ], ... ]
                product = currentCartItem[0];
                quantity =  currentCartItem[1];
            } else if (currentCartItem && typeof currentCartItem === "object" && currentCartItem.product_id && currentCartItem.quantity) {
                // Cart item is from the database in the form [ { 'product_id': <id>, 'quantity': <qty> }, ....]
                product = currentCartItem.product_id;
                quantity =  currentCartItem.quantity;
            } else {
                throw "Invalid cart line-item.";
            }

            if (quantity > 0) {
                let currentProduct = await LAYER.getProductById(product);
                if (!currentProduct) {
                    throw "Invalid product in cart. Product ID# " + product + " does not exist or is no longer active.";
                }
                products.push({
                    product: currentProduct,
                    quantity: quantity
                });
                // Calcualte order totals
                if (currentProduct.price) { price = price + (currentProduct.price * quantity); }
                if (currentProduct.weight) { weight = weight + (currentProduct.weight * quantity); }
                if (currentProduct.tax) { tax = tax + calculateTax(currentProduct.price, quantity, currentProduct.tax); }
            } else { 
                console.warn("Cart product item with 0 quantity ignored.");
            }
        }

        // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
        let shipping = Math.round(((LAYER.calculateShipping(weight, price)) + Number.EPSILON) * 100) / 100;
        tax = Math.round(((tax + calculateTax(shipping, 1, LAYER.SHIPPING_TAX_PERCENTAGE)) + Number.EPSILON) * 100) / 100;
        price = Math.round(((price + shipping) + Number.EPSILON) * 100) / 100;

        let result = await addOrderToDB(userId, user, products, shipping, price, tax, weight, 'PAID');
        if (!result || !result.insertId) {
            throw "Error inserting order into the database.";
        }

        if (cartFromDb) {
            // Order created from cart in DB. Now delete the cart from the DB.
            await LAYER.deleteCart(userId);
        }
        response = (await LAYER.processDbQuery("SELECT * FROM `t_order` WHERE (`id`=?);", [result.insertId]))[0];
    
    } catch (err) {
        error = err.toString();
        console.error('Error adding order to the database.', error);
    } finally {
        try {
            await LAYER.endTransaction(error);
        } catch (err) {
            console.error(err);
            if (!error) {
                // If no existing error add one
                error = 'Error finalising database transaction:' + err.toString();
            }
        }
    }
    // Return the HTTP response
    return LAYER.getHttpResponse(response, error);
}


/***************************************************************
 ********************** Helper Functions ***********************
 ***************************************************************/

function calculateTax(productPrice, quantity, taxPercentage) {
    return (quantity * productPrice * (1 - (100 / (100 + taxPercentage))));
}

async function addOrderToDB(UserId, user, products, shipping, price, tax, weight, status) {
    let query = "INSERT INTO `t_order` (`user_id`,`user`,`products`,`shipping`,`price`,`tax`,`weight`, `status`) VALUES (?,?,?,?,?,?,?,?);"
    let data = [UserId, user, products, shipping, price, tax, weight, status];
    return await LAYER.processDbQuery(query, data);
}

async function getCart(userId) {
    let query = "SELECT `product_id`, `quantity` FROM `t_cart` WHERE `user_id` = ?;"
    return await LAYER.processDbQuery(query, [userId]);
}