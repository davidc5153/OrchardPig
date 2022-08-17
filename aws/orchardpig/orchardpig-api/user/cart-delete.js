/**
 * DELETE /user/cart
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const LAYER = require('/opt/nodejs/layer'); // The lambda layer for DB operations

/**
 * DELETE /user/cart
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
    console.log("DELETE-/USER/CART");
    console.dir(event);
    let response = {};
    let error = null;

    try {

        let userId;
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

        if (event && event.body) {
            event = JSON.parse(event.body);
            if (!userId && event && event.email) {
                // Get guest users id using email
                let result = await LAYER.getUser(userId, event.email, true, false, false);
                if (result && result.id) {
                    userId = result.id;
                }
            }
        }

        if (userId) {
            await LAYER.deleteCart(userId);
            response.cart = await LAYER.getUsersCart(userId);
        } else {
            throw "Unable to delete the user's cart. No user Id or email received.";
        }

    } catch (err) {
        error = err.toString();
        console.error("Error deleting the user's cart from the database.", error);
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
    let productId = parseInt(event.id);
    let quantity = parseInt(event.quantity);
    if (isNaN(productId) || productId < 1 || isNaN(quantity) || quantity < 0) {
        throw "Invalid data values supplied."; 
    }
    return {
        id: productId,
        quantity: quantity
    };
}
