/**
 * GET /restaurant/book
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const LAYER = require('/opt/nodejs/layer'); // The lambda layer for DB operations

/**
 * GET /restaurant/book
 *  
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * @param {Object} context
 *
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.handler = async (event, context) => {
    console.log("GET-RESTAURANT/BOOK");
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

        await LAYER.beginTransaction().catch( (err) => {
            response.statusCode = 500;
            throw err;
        });
    
        // Return all remaining booking data
        response.bookings = await LAYER.getAllConfirmedBookings(userId);

    } catch (err) {
        error = err.toString();
        console.error('Error reading the bookings from the database.', error);
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
