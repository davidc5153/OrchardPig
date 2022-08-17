/**
 * GET /order
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const LAYER = require('/opt/nodejs/layer'); // The lambda layer for DB operations

/**
 * GET /order
 *  
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * @param {Object} context
 *
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.handler = async (event, context) => {
    console.log("GET-ORDER");
    console.dir(event);

    let response = {};
    let error = null;

    try {
        let userId = null;

        await LAYER.beginTransaction().catch( (err) => {
            response.statusCode = 500;
            throw err;
        });    

        try {
            userId = LAYER.getAuthToken(event);
        } catch (err) {
            console.warn('Error retrieving token. Assuming GUEST user.');
            console.dir(err);
            if (event && event.queryStringParameters && event.queryStringParameters.email) {
                let email = event.queryStringParameters.email;
                // Get user ID using email
                let user = await LAYER.getUser(userId, email, true, false, false);
                if (user && user.id) {
                    userId = user.id;
                } else {
                    throw "User not found In the database.";
                }
            } else {
                throw "No user ID or email provider for order search.";
            }
        }

        // Return all non-Pending orders in the Last year
        let orders = await LAYER.getAllNonPendingOrders(userId);

        // Parse orders.cart data to only return [ [productId, quantity], ....]
        // Updated to return all order details
        /*
        let newCart = [];
        orders.forEach(order => {
            let cart = order.cart;
            cart.forEach(item => {
                newCart.push([item.product.id, item.quantity])
            });
            order.cart = newCart;
        });
        */
        response.orders = orders;
        
    } catch (err) {
        error = err.toString();
        console.error('Error reading the orders from the database.', error);
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
