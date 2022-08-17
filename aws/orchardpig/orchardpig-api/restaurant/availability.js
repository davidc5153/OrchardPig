/**
 * GET /restaurant/availability
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const LAYER = require('/opt/nodejs/layer'); // The lambda layer for DB operations

/**
 * GET /restaurant/availability 
 *  
 * @param {Object} event
 * @param {Object} context
 *
 * @returns {Object}
 *  
 */
exports.handler = async (event, context) => {
    console.log("GET-RESTAURANT/AVAILABILITY");
    console.dir(event);
    let response = {};
    let error = null;

    try {

        let guests = null;
        let date = null;
        let timeslots = null;
        
        if (event.queryStringParameters) {
            if (event.queryStringParameters.date) {
                date = event.queryStringParameters.date;
            } else {
                throw "A date is required to check availability.";
            }
            if (event.queryStringParameters.guests) {
                guests = parseInt(event.queryStringParameters.guests, 10);
                if (isNaN(guests)) { guests = null; }
            }
            if (event.queryStringParameters.timeslots) {
                let timeslotArray = JSON.parse(event.queryStringParameters.timeslots);
                if (Array.isArray(timeslotArray) && timeslotArray.length>0) {
                    timeslots = timeslotArray;
                }
            }
        }
        
        // Begin the DB Transaction
        await LAYER.beginTransaction().catch( (err) => {
            response.statusCode = 500;
            throw err;
        });

        // Get product(s) from DB 
        let availability = await LAYER.getAvailability(date, guests, timeslots);

        response[date] = availability;

    } catch (err) {
        error = err.toString();
        console.error('Error reading availability from the database.', error);
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

