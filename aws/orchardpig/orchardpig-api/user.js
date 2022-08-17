/**
 * POST /user
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const LAYER = require('/opt/nodejs/layer'); // The lambda layer for DB operations

/**
 * POST /user
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
    console.log("POST-USER");
    console.dir(event);
    let response = {};
    let error = null;

    try {
        event = JSON.parse(event.body);         
        if (event && event.user) {

            let userData = event.user; // Incoming format: { user: { ... }}

            await LAYER.beginTransaction().catch( (err) => {
                response.statusCode = 500;
                throw err;
            });

            response = await LAYER.createOrModifyUser(userData);

        } else {
            throw "Unable to create user. Invalid data fields received.";
        }
    } catch (err) {
        error = err.toString();
        console.error('Error adding user to the database.', error);
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
