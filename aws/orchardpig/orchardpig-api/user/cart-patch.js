/**
 * PATCH /user/cart
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const LAYER = require('/opt/nodejs/layer'); // The lambda layer for DB operations

/**
 * PATCH /user/cart
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
    console.log("PATCH-USER/CART");
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

        event = checkRequiredFields(JSON.parse(event.body));

        if (event) {

            let result;

            await LAYER.beginTransaction().catch( (err) => {
                response.statusCode = 500;
                throw err;
            });

            // Check if the product to be modified does exists in the user's cart
            let cartCheck = await LAYER.processDbQuery("SELECT `quantity` FROM `t_cart` WHERE (`product_id`=? AND `user_id`=?);", [event.id, userId]);
            if (cartCheck.length) {
                // Modify cart element
                if (event.quantity === 0) {
                    result = await LAYER.processDbQuery(
                        'DELETE FROM `t_cart` WHERE (`product_id` = ? AND `user_id` = ?);', 
                        [event.id, userId]
                    );
                } else {
                    result = await LAYER.processDbQuery(
                        'UPDATE `t_cart` SET `quantity` = ? WHERE (`product_id` = ? AND `user_id` = ?);', 
                        [event.quantity, event.id, userId]
                    );
                }
            } else {
                throw "Product does not exists in the user's cart."
            }             

            warning = LAYER.checkDatabaseResult(result);
            
            // Success. Read/Return cart confirmation.
            result = await LAYER.processDbQuery(
                'SELECT * FROM `t_cart` WHERE (`product_id` = ? AND `user_id` = ?);', 
                [event.id, userId]
            );
            if (result && Array.isArray(result) && result[0]) {
                response = result[0];
            }
            if (warning) { response.message = warning; }

        } else {
            throw "Unable to modify the product in the user's cart. No data fields received.";
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
