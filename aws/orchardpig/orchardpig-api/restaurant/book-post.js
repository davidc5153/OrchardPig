/**
 * POST /restaurant/book
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const LAYER = require('/opt/nodejs/layer'); // The lambda layer for DB operations
const EMAIL_REGEX = LAYER.EMAIL_REGEX;

/**
 * POST /restaurant/book
 *  
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * @param {Object} context
 *
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.handler = async (event, context) => {
    console.log("POST-RESTAURANT/BOOK");
    console.dir(event);

    let response = {};
    let error = null;

    try {
        let userId = null;

        try {
            userId = LAYER.getAuthToken(event);
        } catch (err) {
            response.statusCode = 401;
            throw err;
        }
        event = JSON.parse(event.body);
        if (event) {
            // Check for valid required fields
            LAYER.checkRequiredBookingFields(event);

            await LAYER.beginTransaction().catch( (err) => {
                response.statusCode = 500;
                throw err;
            });
    
            // Update or create the user if required
            // let user = await LAYER.createOrModifyUser(event, userId);
            // * User MUST login and No user data sent with booking request 
            response = await LAYER.addBooking(event, userId);

        } else {
            throw "No booking data received.";
        }
    } catch (err) {
        error = err.toString();
        console.error('Error creating the booking with the supplied details.', error);
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
