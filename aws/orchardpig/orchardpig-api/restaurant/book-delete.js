/**
 * DELETE /restaurant/book
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const LAYER = require('/opt/nodejs/layer'); // The lambda layer for DB operations
const EMAIL_REGEX = LAYER.EMAIL_REGEX;

/**
 * DELETE /restaurant/book
 *  
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * @param {Object} context
 *
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.handler = async (event, context) => {
    console.log("DELETE-RESTAURANT/BOOK");
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
        if (event && event.id) {

            let id = parseInt(event.id);
            if (isNaN(id) || id <= 0) { throw "Invalid booking id supplied."; }

            await LAYER.beginTransaction().catch( (err) => {
                response.statusCode = 500;
                throw err;
            });
    
            // Update the booking to status = DELETED
            await LAYER.processDbQuery("UPDATE `t_booking` SET `status` = 'DELETED' WHERE `id` = ?;", [id]);

            // Return all remaining booking data
            response.bookings = await LAYER.getAllConfirmedBookings(userId);
        } else {
            throw "No booking id received.";
        }
    } catch (err) {
        error = err.toString();
        console.error('Error deleting the booking with the supplied details.', error);
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

