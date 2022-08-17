/**
 * POST /auth/signin
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const CRYPTO = require('crypto');
const JWT = require('jsonwebtoken')

const LAYER = require('/opt/nodejs/layer'); // The lambda layer for DB operations
const EMAIL_REGEX = LAYER.EMAIL_REGEX;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;

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
    console.log("POST-AUTH/SIGNIN");
    console.dir(event);

    let response = {};
    let error = null;
    try {
        event = JSON.parse(event.body);
        if (event) {

            // Extract passed email and password
            let email = event.email;
            if (!email || !EMAIL_REGEX.test(email)) {
                throw "Invalid email received for signin."
            }

            let password = event.password;
            let openId = event.openId;
            if (!password && !openId) {
                throw "Invalid password received for signin."
            }

            await LAYER.beginTransaction().catch( (err) => {
                response.statusCode = 500;
                throw err;
            });
    
            // Get the user from the DB that matches the passed email
            let user = await LAYER.getUser(null, email, true, false, true);
            let accessToken = null;
            if (!password && openId) {
                // User is logging in with Google OAuth2 - Create or update with openId
                if (!user || user.length ===0 || !user.id || user.openId !== openId.openId) {
                    openId['email'] = email;
                    let updatedUser = await LAYER.createOrModifyUser(event.openId);    
                    if (updatedUser && updatedUser.id && updatedUser.accessToken) {
                        user = await LAYER.getUser(updatedUser.id, email, true, false, false);
                        accessToken = updatedUser.accessToken;
                    }
                }
            } else {
                if (user.length === 0) {
                    throw "Invalid email address or password."
                } 
                if (!user.id) {
                    throw 'Error retrieving user from the database.'
                }
                if (!user.password) {
                    throw "Email refers to an unregistered user."
                }
                            // See if the passwords match
                let passwordArray = user.password.split('$'); // salt$hash
                let hashedPassword = CRYPTO.pbkdf2Sync(password, passwordArray[0], 2048, 32, 'sha512').toString('hex');
                if (passwordArray[1] !== hashedPassword) {
                    throw "Invalid email address or password."
                }    
            }
            delete user.openId;
            delete user.password;

            // Calculate the access token if required
            if (!accessToken) {
                accessToken = JWT.sign({ id: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRY });
            }

            // Get users saved cart
            let cart = await LAYER.getUsersCart(user.id);
            delete user.cart;


            // Assemble returned response
            response.user = user;
            response.accessToken = accessToken;
            response.cart = cart;

        } else {
            throw "No signin data received.";
        }
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
