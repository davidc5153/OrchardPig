/**
 * PUT /user/cart
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const LAYER = require('/opt/nodejs/layer'); // The lambda layer for DB operations

/**
 * PUT /user/cart
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
    console.log("PUT-/USER/CART");
    console.dir(event);
    let response = {};
    let error = null;
    let warning = null;

    try {

        let userId;
        try {
            userId = LAYER.getAuthToken(event);
        } catch (err) {
            response.statusCode = 401;
            throw err;
        }

        cartArray = checkRequiredFields(JSON.parse(event.body));

        if (cartArray) {

            await LAYER.beginTransaction().catch( (err) => {
                response.statusCode = 500;
                throw err;
            });

            // Delete current cart
            await LAYER.deleteCart(userId);

            // Add new cart
            await addNewCart(userId, cartArray);

            // Success. Read/Return cart confirmation.
            response.user_id = userId;
            response.cart = await LAYER.getUsersCart(userId);

        } else {
            throw "Unable to update the user's cart. No data fields received.";
        }
    } catch (err) {
        error = err.toString();
        console.error("Error modifying the user's cart in the database.", error);
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

/**
 * Check all required fields are present and correct
 * 
 * @param {JSON} event
 * 
 * @returns {JSON} Parsed data event
 */
 function checkRequiredFields(event) {
    let cart = event.cart;
    let returnCart = [];
    if (!cart || !Array.isArray(cart)) {
        throw "No valid cart data supplied."
    }
    cart.forEach(item => {
        if (Array.isArray(item) && item.length === 2) {
            let productId = parseInt(item[0]);
            let quantity = parseInt(item[1]);
            if (isNaN(productId) || productId < 1 || isNaN(quantity) || quantity < 0) {
                throw "Invalid data values supplied.";
            }
            returnCart.push([productId, quantity]);
        } else {
            throw "Invalid cart structure passed. Should be in the form [ [id,qty], ... ].";
        }
    });
    return returnCart;
}

async function addNewCart(userId, cartArray) {
    for (let i=0; i < cartArray.length; i++) {
        cartItem = cartArray[i];
        let query = "INSERT INTO `t_cart` (`user_id`, `product_id`, `quantity`) VALUES (?,?,?);";
        let values = [userId, cartItem[0], cartItem[1]];
        await LAYER.processDbQuery(query, values);        
    }
}