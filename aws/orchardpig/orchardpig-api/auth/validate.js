/**
 * GET /auth/validate
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const LAYER = require('/opt/nodejs/layer'); // The lambda layer for DB operations

/**
 * POST auth/signin
 *  
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * @param {Object} context
 *
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.handler = async (event, context) => {
    console.log("GET-AUTH/VALIDATE");
    console.dir(event);

    let response = {};
    let error = null;
    try {

        let userId;
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

        // Get the user from the DB using the passed userId
        let user = await LAYER.getUser(userId, null);
        if (!user) {
            // Default 400
            throw "Invalid access token."
        } 
        response.user = user;

        // Get user's saved cart
        response.cart = await LAYER.getUsersCart(userId);
        delete response.user.cart;

    } catch (err) {
        error = err.toString();
        console.error('Error signing in the user with the supplied details.', error);
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

/*
async function getUser(id) {
    let query = "SELECT `firstName`, `lastName`,`email`,'cart' from `t_user` WHERE (`active` = 1 AND `id` = ?);";
    // Process DB query.
    return await LAYER.processDbQuery(query, [id]);
} 
*/