/**
 * Shared layer for access by all lambda functions 
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const MYSQL = require('mysql2/promise');
const JWT = require('jsonwebtoken');
const CRYPTO = require('crypto');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;
const { DBCONNECTION } = process.env;
const CONNECTION = {
    dbJson: null,
    connection: null
};

/***************************************************************
 ************************* Constants ***************************
 ***************************************************************/

// https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// https://stackoverflow.com/questions/22061723/regex-date-validation-for-yyyy-mm-dd
const DATE_REGEX = /\d{4}-\d{2}-\d{2}/;

const MINIMUM_AGE = 18;
MINIMUM_PASSWORD_LENGTH = 6;

const VALID_FIELDNAMES = {
    t_user: ["id", "active", "email", "password", "openId", "firstName", "lastName", "phone", "address", "city", "state", "postcode", "dob"],
    t_booking: ["userId", "tableId", "status", "date", "timeslot", "guests", "notes"]
};

const VALID_VALUES = {
    addressStates: ['NSW', 'QLD', 'VIC', 'ACT', 'WA', 'NT', 'SA'],
    bookingStatus: ['TENTATIVE', 'CONFIRMED', 'DELETED']
}

const MAXIMUM_AVAILABILITY_RESULTS = 500;
const MAXIMUM_TENTATIVE_BOOKING_MINUTES = 15;

const SHIPPING_FREE_THRESHOLD = 70; // Free shipping if over $70
const SHIPPING_BASE_CHARGE = 9;     // Base shipping charge is $6
const SHIPPING_EXCESS_PER_KG = 1;   // $1 extra shipping for every 1kg
const SHIPPING_TAX_PERCENTAGE = 10; // Tax on shipping.

/***************************************************************
 ************************** Functions **************************
 ***************************************************************/ 

/*********************************
 ************** Cart *************
 *********************************/

/**
 * Returns the cart found with the passed userId
 *   
 * @param {integer} userId 
 * @returns {JSON} Cart 
 */
async function getUsersCart(userId) {
    let cartObj = { 
        cart: [], 
        cartData: await processDbQuery("SELECT * from `t_cart` WHERE (`user_id` = ?);", [userId])
    };
    for (let i=0; i<cartObj.cartData.length; i++) {
        let currentCartItem = cartObj.cartData[i];
        let product = (await getProductById(currentCartItem.product_id));
        cartObj.cart.push({ 
            product: product,
            quantity: currentCartItem.quantity
        });
    }
    return cartObj.cart;
}

function calculateShipping(weight, price) {
    if (price >= SHIPPING_FREE_THRESHOLD) {
        return 0;
    }
    return (SHIPPING_BASE_CHARGE + (SHIPPING_EXCESS_PER_KG * weight/1000 ) )
}

async function deleteCart(userId) {
    await processDbQuery("DELETE FROM `t_cart` WHERE `user_id` = ?;", [userId]);
}

/*********************************
 ************* Poduct ************
 *********************************/

async function getProductById(id, activeOnly=true) {
    let query = "SELECT * from `t_product` WHERE (`id` = ?";
    if (activeOnly) {
        query += " AND active = 1";
    }
    query += ");";
    let result = await processDbQuery(query, [id]);
    if (!result || !Array.isArray(result) || result.length > 1) {
        throw "Fatal database error. Invalid result from product query.";
    }
    return result[0];
} 

/*********************************
 ************** User *************
 *********************************/

/**
 * Finds the user in the DB with the id and/or email passed,
 * 
 * @param {*} id 
 * @param {*} email 
 * @param {*} activeOnly 
 * @param {*} addressOnly 
 * @param {*} includePassword
 * 
 * @returns {JSON} User information from the DB (or only address if requested). Returns null if user is not found. 
 */
async function getUser(id, email, activeOnly=true, addressOnly = false, includePassword = false) {
    if (!id && !email) { throw "User ID and/or email address required to find a user in the database!"; }   
    let data = []; 
    let query = "SELECT ";
    if (!addressOnly) {
        query += "* ";
    } else {
        query += "address, city, state, postcode "
    }
    query += "from `t_user` WHERE (";
    if (id) {
        query += "`id`=?";
        data.push(id);
    }
    if (email) {
        if (id) {
            query += " AND ";
        }
        query += "`email`=?";
        data.push(email);
    }
    if (activeOnly) {
        query += " AND `active` = 1";
    }
    query += ");";
    let user = await processDbQuery(query, data);
    if (!user || !Array.isArray(user) || user.length > 1) {
        throw "Fatal database error. Invalid result from user query.";
    }
    if (user.length === 1) { 
        user = user[0];
        if (!includePassword) { delete user.password; }    
    } else {
        user = null;
    }
    return user;
} 

/**
 * 
 * @param {JSON} userData - User data received from the front-end
 * @param {Int} userId - User's ID number if known
 *
 * @returns  {id: <userId>, accessToken: <token>}
 */
async function createOrModifyUser(userFrontendData, userId=null) {
    let userDbData;
    if (!userFrontendData) { throw "No user data received."; }
    if (!userId) {
        // NO TOKEN received - Search for user in the DB (Might be guest)
        userDbData = await getUser(null, userFrontendData.email, true, false, true);
        if (userDbData) {
            // User exists in the DB
            if (userDbData.password && userDbData.password.length > 0) {
                // User has a password set - Registered - Must login
                throw "The email supplied already exists. Please login for this user account.";
            }
            // Modify existing GUEST user
            return (await modifyUser(userDbData.id, userFrontendData));
        }
        // Add new user
        return (await addUser(userFrontendData));
    } else {
        // Registered user (where they have a password set) 
        userDbData = await getUser(userId, null, true, false, true);
        if (!userDbData || ( !userDbData.password && !openId) ) {
            throw "Invalid user data. The user ID and/or email provided can not be used.";
        }
    }
    // Modify existing REGISTERED user
    return (await modifyUser(userId, userFrontendData));
}

/**
 * *** DO NOT CALL this function directly ***
 * Call createOrModifyUser 
 * 
 * Inserts a new user into the DB.
 * 
 * @param {JSON} userData - Incoming user data from the front-end
 * 
 * @returns {JSON} { id: <userId>, accessToken: <token> } 
 */
 async function addUser(userData) {

    checkRequiredUserFields(userData);

    let query;
    let fields = [];
    let data = [];

    query = "INSERT INTO `t_user` (";

    // Encrypt the passed string password.
    if (userData.password) {
        userData.password = encryptPassword(userData.password);
    }

    for (const key of Object.keys(userData)) {
        if (VALID_FIELDNAMES.t_user.includes(key)) {
            // Valid key - process
            let value = userData[key];
            if (value === undefined) { value = null; }
            value = validateUserData(key, value);
            fields.push("`"+key+"`");
            data.push(value);
        }
    }
    // Final assembly of user SQL
    query += fields.join(",") + ") VALUES (" + (Array(fields.length).fill('?')).join(',') + ");";

    // Process DB query.
    let result = await processDbQuery(query, data);
    let returnData = {};
    if (result && result.insertId) {
        returnData.id = result.insertId;
        returnData.accessToken = JWT.sign({ id: returnData.id }, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRY });
    } else {
        throw "Error adding user to database."; 
    }

    return returnData;
} 

/**
 * *** DO NOT CALL this function directly ***
 * Call createOrModifyUser 
 * 
 * Updates an existing user in the DB as required.
 * 
 * @param {int} userId - User ID of the user in the DB
 * @param {JSON} userData - Data to be used to update the user.
 * 
 * @returns {JSON} { id: <userId>, accessToken: <token> } 
 */
 async function modifyUser(userId, userData) {

    let query;
    let data = [];

    delete userData.id; // Don't want to update id
    query = "UPDATE `t_user` SET ";

    if (userData.password) {
        userData.password = encryptPassword(userData.password);
    }

    let first = true;
    for (const key of Object.keys(userData)) {
        if (VALID_FIELDNAMES.t_user.includes(key)) {
            // Valid key - process
            let value = userData[key];
            if (value === undefined) { value = null; }
            value = validateUserData(key, value);
            if (!first) { query += ","; }
            query += "`"+key+"`=?"; // Add to array for insertion into the USER SQL command
            data.push(value);
            first = false;
        }
    }
    // Final assembly of user SQL
    query += " WHERE `id`=?;";
    data.push(userId);

    // Process DB query.
    let result = await processDbQuery(query, data);
    let returnData = {};
    if (result) {
        checkDatabaseResult(result);
        returnData.id = userId;
        returnData.accessToken = JWT.sign({ id: returnData.id }, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRY });
    } else {
        throw "Error modifying user in the database."; 
    }
    return returnData;
} 

async function addBooking(bookingDetails, userId) {

    // Get availability and choose smallest table that will fullfill the booking.
    let availability = await getAvailability(bookingDetails.date, bookingDetails.guests, [bookingDetails.timeslot]);
    let smallestCapacity = 999;
    let selectedAVailability = null;
    availability.forEach(vacancy => {
        if (vacancy.capacity < smallestCapacity) {
            smallestCapacity = vacancy.capacity;
            selectedAVailability = vacancy; 
        }
    });

    if (!selectedAVailability) {
        throw "No vacancies found for the selected requirements."
    }

    bookingDetails.userId = userId;
    bookingDetails.timeslot = selectedAVailability.timeId;
    bookingDetails.tableId = selectedAVailability.tableId;
    bookingDetails.status = "CONFIRMED";

    // Create the booking
    let query = "INSERT INTO `t_booking` (`";
    let fields = [];
    let values = [];

    for (let field of Object.keys(bookingDetails)) {
        if (VALID_FIELDNAMES.t_booking.includes(field)) {
            fields.push(field);
            values.push(bookingDetails[field]);
        }
    }

    query += fields.join("`,`");
    query += "`) VALUES (";
    query += (Array(fields.length).fill('?')).join(',') + ");";

    result = await processDbQuery(query, values);
    if (result && result.insertId) {
        return await getBooking(result.insertId);
    } else {
        throw "Error adding user to database."; 
    }
}

async function getAvailability(date, guests=null, timeslots=null) {
    // Clear expired TENTATIVE bookings for the slected date
    await processDbQuery(
        "UPDATE `t_booking` SET `status`='DELETED' WHERE `date`=? AND `status`='TENTATIVE' AND `statusTime` < current_timestamp() - INTERVAL ? MINUTE AND `id` > 0;", 
        [date, MAXIMUM_TENTATIVE_BOOKING_MINUTES]
    );

    let extended = isDayExtendedHours(date);
    let data = [];
    let query = 'SELECT `S`.`id` AS "timeId", `S`.`session` AS "session", `S`.`name` AS "time", `T`.`id` AS "tableId", `T`.`name` AS "table", `T`.`capacity` AS "capacity" ';
    query += 'FROM `t_table` T INNER JOIN `t_timeslot` S ';
    let whereClause1 = ["`T`.`active` = 1", "`S`.`extended` = "+extended];
    
    if (guests) {
        whereClause1.push('`T`.`capacity`>=?');
        data.push(guests);
    }
    if (timeslots && Array.isArray(timeslots) && timeslots.length>0) {
        let timeWhere = "`S`.`name` IN (";
        for (let i=0; i<timeslots.length; i++) {
            if (i!==0) { timeWhere += ","; }
            timeWhere += '?';
            data.push(timeslots[i]);
        }
        whereClause1.push(timeWhere+") ");
    }

    // Assemble query
    query += "WHERE "+whereClause1.join(" AND ");
    query += ' AND NOT EXISTS ( SELECT * FROM `t_booking` B WHERE `B`.`tableId`=`T`.`id` AND `B`.`timeslot`=`S`.`id` AND `B`.`status`!="DELETED" ';
    query += "AND `B`.`date`=? "
    data.push(date)
    query += ") ORDER BY `timeId` ASC;"; // LIMIT " + LAYER.MAXIMUM_AVAILABILITY_RESULTS + ";";
    return await processDbQuery(query, data);
}

async function getBooking(id) {
    let query = "SELECT `B`.`id`, `B`.`userId`, `B`.`status`, `B`.`date`, `B`.`guests`, `B`.`notes`, `T`.`name` AS 'timeslot', `U`.`firstName`, `U`.`lastName`, `U`.`email`, `U`.`phone`, `D`.`name` AS 'table' ";
    query += "FROM `t_booking` B ";
    query += "INNER JOIN `t_user` U ON `U`.`id` = `B`.`userId` ";
    query += "INNER JOIN `t_timeslot` T ON `T`.`id` = `B`.`timeslot` ";
    query += "INNER JOIN `t_table` D ON `D`.`id` = `B`.`tableId` ";
    query += "WHERE `B`.`id` = ?;";

    return await processDbQuery(query, [id]);
}

async function getAllConfirmedBookings(userId) {
    let query = "SELECT `B`.`id`, `B`.`userId`, `B`.`status`, `B`.`date`, `B`.`guests`, `B`.`notes`, `T`.`name` AS 'timeslot', `D`.`name` AS 'table' ";
    query += "FROM `t_booking` B ";
    query += "INNER JOIN `t_timeslot` T ON `T`.`id` = `B`.`timeslot` ";
    query += "INNER JOIN `t_table` D ON `D`.`id` = `B`.`tableId` ";
    query += "WHERE `B`.`userId` = ? AND `B`.`status` = 'CONFIRMED' AND `B`.`date` >= current_date();";
    // query += "WHERE `B`.`userId` = ? AND `B`.`status` = 'CONFIRMED' AND `B`.`date` > current_date() - INTERVAL 1 YEAR;";

    return await processDbQuery(query, [userId]);
}

/**
 * Return all orders for the passed user ID within the Last year that are NOT pending.
 * 
 * @param {*} userId 
 * @returns 
 */
async function getAllNonPendingOrders(userId) {
    let query = "SELECT `id` AS 'orderId', `date`, `status`, `shipping`, `price`, `tax`, `products` AS 'cart' FROM `t_order` ";
    query += "WHERE (`user_id` = ? AND `status` != 'PENDING' AND `date` > current_date() - INTERVAL 1 YEAR) ORDER BY `orderId` DESC;";
    return await processDbQuery(query, [userId]);
}

function isDayExtendedHours(date) {
    let extended = 0;
    let dateObject = new Date(date);
    if (isNaN(dateObject)) {
        throw "Invalid date string passed.";
    }
    let now = new Date();
    now.setHours(0,0,0,0);
    if (dateObject < now) {
        throw "Invalid date. Dates must be greater than or equal to today.";
    }
    let day = dateObject.getDay();
    if (day===0 || day>4) {
        // 0 = Sunday, 5 = Friday, 6 = Saturday
        extended = 1;
    }
    return extended;
}


/**
 * Extracts JWT Bearer token from event header.
 * Expects token length of at least 140 characters.
 * Throws on error.
 * 
 * @param {JSON} event 
 * 
 * @returns {int} UserID 
 */
function getAuthToken(event) {

    if (!event.headers) {
        throw "Invalid Authorization header"
    }
    let authHeader = event.headers.Authorization;
    if (!authHeader) {
        throw "Token not found in Authorization header"
    }
    let authArray = authHeader.split(' ');
    if (authArray.length !== 2 || authArray[0] !== 'Bearer' || authArray[1].length < 140) {
        throw "Malformed token found in Authorization header"
    }

    // https://github.com/auth0/node-jsonwebtoken
    // Do not want to run async
    let userId;
    try {
        let tokenData = JWT.verify(authArray[1], ACCESS_TOKEN_SECRET);
        userId = parseInt(tokenData.id);
    } catch (err) {
        throw "Valid Access Token Not Found."
    }
    if ( isNaN(userId) || userId < 1) { 
        throw "Invalid access token."
    }
    return userId;
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function checkRequiredUserFields(event) {
    if (!event.email || !event.firstName || !event.lastName) {
        throw "Missing fields in passed parameters. Email, first and last names are required to create a user."
    }
}

function checkRequiredAddressFields(address) {
    if (!address.address || !address.city || !address.state || !address.postcode) {
        throw "Missing fields in passed address parameters. Addresses require at least the first line, city/suburb, state and postcode."
    }
}

function validateUserData(key, value) {
    if (value) {
        if (typeof value === "string") { value = value.trim(); }
        switch (key) {
            case 'active': {
                if (value !== 0 && value !== 1) {
                    throw 'Invalid active status received. The active status must be either 1 or 0.';
                }                
                break;
            }
            case 'email': {
                if (!EMAIL_REGEX.test(value)) {
                    throw 'Invalid email format received.';
                }                
                break;
            }
            case 'firstName': {
                if (value.length < 2 || /\d/.test(value)) {
                    throw 'Invalid first name supplied. The first name supplied must be at least 2 characters long and not contain numbers..';
                }
                break;
            }
            case 'lastName': {
                if (value.length < 2 || /\d/.test(value)) {
                    throw 'Invalid last name supplied. The last name supplied must be at least 2 characters long and not contain numbers.';
                }
                break;
            }
            case 'password': {
                if (value.length < MINIMUM_PASSWORD_LENGTH) {
                    throw 'Invalid password supplied. The password supplied must be at least 6 characters long.';
                }
                break;
            }
            case 'phone': {
                if (value.length < 8) {
                    throw 'Invalid phone number supplied. The phone number supplied must be at least 8 characters long.';
                }
                break;
            }
            case 'dob': {
                if (!DATE_REGEX.test(value)) {
                    throw 'Invalid date of birth supplied. The date of birth supplied must be in the format YYYY-MM-DD.';
                }
                if (getAge(value) < MINIMUM_AGE) {
                    throw 'Invalid date of birth supplied. You must be at least ' + MINIMUM_AGE + ' years of age to register.';                
                }
                break;
            }
            case 'address': {
                if (value.length < 5) {
                    throw 'Invalid address supplied. The address supplied must be at least 5 characters long.';
                }
                break;
            }
            case 'city': {
                if (value.length < 2) {
                    throw 'Invalid city/suburb supplied. The city/suburb supplied must be at least 2 characters long.';
                }
                break;
            }
            case 'state': {
                if (!VALID_VALUES.addressStates.includes(value)) {
                    throw 'Invalid state supplied. The state supplied must be a valid state of Australia.';
                }
                break;
            }
            case 'postcode': {
                if (value.length < 4) {
                    throw 'Invalid postcode supplied. The postcode supplied must be at least 4 characters long.';
                }
                break;
            }
            default: {
                break;
            }
        }
    }
    return value;
}

function checkRequiredBookingFields(booking) {
    if (!booking.guests || !booking.date || !booking.timeslot) {
        throw "Booking must contain guests, date and timeslot";
    }
}

function validateBookingData(key, value) {
    if (value) {
        if (typeof value === "string") { value = value.trim(); }
        switch (key) {
            case 'status': {
                if (!VALID_VALUES.bookingStatus.includes(value)) {
                    throw "Invalid booking status."
                }
            }
            case 'firstName': {
                if (value.length < 2 || /\d/.test(value)) {
                    throw 'Invalid first name supplied. The first name supplied must be at least 2 characters long and not contain numbers.';
                }
                break;
            }
            case 'lastName': {
                if (value.length < 2 || /\d/.test(value)) {
                    throw 'Invalid last name supplied. The last name supplied must be at least 2 characters long and not contain numbers.';
                }
                break;
            }
            case 'email': {
                if (!EMAIL_REGEX.test(value)) {
                    throw 'Invalid email format received.';
                }                
                break;
            }
            case 'phone': {
                if (value.length < 8) {
                    throw 'Invalid phone number supplied. The phone number supplied must be at least 8 characters long.';
                }
                break;
            }
            case 'guests': {
                let guests = parseInt(value);
                if (isNaN(guests) || guests <= 0) {
                    throw 'Invalid number of guests received. Guests should be greater than 0.';
                }
                break;
            }
            case 'date': {
                if (!DATE_REGEX.test(value)) {
                    throw 'Invalid booking date supplied. The date must be in the format YYYY-MM-DD.';
                }
                break;
            }
            case 'timeslot': {
                let timeslot = parseInt(value);
                if (isNaN(timeslot) || timeslot <= 0 || timeslot > 24) {
                    throw 'Invalid timeslot ID.';
                }
                break;
            }
            default: {
                break;
            }
        }
    }
    return value;
}

/**
 * Encrypts string password with salt.
 * 
 * @param {string} password
 *  
 * @returns {string} Encrypted password encoded as a hex string in the form <SALT>$<PASSWORD>. Returns NULL if no password passed.
 */
function encryptPassword(password) {
    // Salt and encode password
    let returnPassword = null;
    if (password) {
        const SALT = CRYPTO.randomBytes(16).toString('hex');
        const PW = CRYPTO.pbkdf2Sync(password, SALT, 2048, 32, 'sha512').toString('hex');
        returnPassword = SALT + '$' + PW;
    }
    return returnPassword 
}

/*********************************
 ************ Database ***********
 *********************************/

 async function getDbConnection() {
    if (!CONNECTION.dbJson) {
        try {
            CONNECTION.dbJson = JSON.parse(DBCONNECTION);
        } catch (e) {
            // DBCONNECTION is only resolved in YAML when deployed - Try and retrieve DB Connection values from local file 
            console.log('Getting secret for LOCAL invoke');
            const RDS = require("./rds-config");
            CONNECTION.dbJson = RDS.getCredentials();
        }
    }
    console.log('Creating DB connection');
    await MYSQL.createConnection({
        host:       CONNECTION.dbJson.host,
        user:       CONNECTION.dbJson.username,
        password:   CONNECTION.dbJson.password,
        database:   CONNECTION.dbJson.dbname,
        port:       CONNECTION.dbJson.port 
    }).then( (connection) => {
        CONNECTION.connection = connection;
    });
}

async function beginTransaction() {
    // Connect to DB if required
    if (!CONNECTION.connection) {
        await getDbConnection();
    }
    console.log("Connected to database.");
    // DB Connection established - Begin DB Transaction
    await CONNECTION.connection.beginTransaction();
}


async function processDbQuery(query, data) {
    console.log('Processing DB Query', query);
    console.dir(data);
    let result, buffer;
    [result, buffer] = await CONNECTION.connection.execute(query,data);
    console.dir(result);
    // if (result.insertId) { return result.insertId; }
    return result;
}

/**
 * End db transaction
 * 
 * @param {String} error - Any error that has occured
 */
async function endTransaction(error) {
    if (error && error.length>0) {
        console.log("DB ROLLBACK");
        await CONNECTION.connection.rollback();
    } else {
        console.log("DB COMMIT");
        await CONNECTION.connection.commit();
    }
}


function checkDatabaseResult(result) {
    if (!result) {
        throw "Error processing database request.";
    }
    if (result.affectedRows === undefined) {
        // DB Error
        throw "Database error: Affected rows undefined.";
    }
    if (result.affectedRows > 1) {
        throw "Database error: A record already exists with the same id."
    }
    if (result.affectedRows === 0) {
        throw "Record can not be inserted or modified in the database.";
    } 

    if (result.changedRows === 0) {
        if (result.affectedRows === 0) {
            throw "Modification could not be applied to the database. Record does not exist."
        } else if (result.affectedRows === 1) {
            return "WARNING: No change required. Update data sent is the same as the data in the database.";
        }
    }
    return null;
}
/*********************************
 ************** HTTP *************
 *********************************/

/**
 * Construct Standard HTTP JSON response for returned to the client 
 * 
 * @param {JSON} response 
 * @param {String} error 
 * 
 * @returns HTTP response
 */
 function getHttpResponse(response, error) {
    let code = 400; // Assume error
    let body = {};
    if (!error || error.length===0) {
        if (response.statusCode) {
            code = response.statusCode;
        } else {
            code = 200;     
        }
        body = response;
    } else {
        if (response.statusCode) {
            code = response.statusCode;
        }
        try {
            if (error.indexOf("Duplicate entry")>=0) {
                // Error caused by duplicate key - Reformat response
                let fieldArray = error.split("'");
                if (fieldArray.length > 1) {
                    error = "'" + fieldArray[1] + "' already exists.";
                }
            }
        } finally {
            body['message'] = error;
        }
    }
    return {
        statusCode: code,
        isBase64Encoded: false,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(body)
    };
}


/***************************************************************
 ********************** Exported Elements **********************
 ***************************************************************/

module.exports.EMAIL_REGEX = EMAIL_REGEX;
module.exports.SHIPPING_TAX_PERCENTAGE = SHIPPING_TAX_PERCENTAGE;
module.exports.MAXIMUM_AVAILABILITY_RESULTS = MAXIMUM_AVAILABILITY_RESULTS;
module.exports.MAXIMUM_TENTATIVE_BOOKING_MINUTES = MAXIMUM_TENTATIVE_BOOKING_MINUTES;

module.exports.beginTransaction = beginTransaction;
module.exports.processDbQuery = processDbQuery;
module.exports.endTransaction = endTransaction;
module.exports.getHttpResponse = getHttpResponse;
module.exports.checkDatabaseResult = checkDatabaseResult;
module.exports.createOrModifyUser = createOrModifyUser;
module.exports.getAuthToken = getAuthToken;
module.exports.getProductById = getProductById;
module.exports.getUser = getUser;
module.exports.calculateShipping = calculateShipping;
module.exports.getUsersCart = getUsersCart;
module.exports.deleteCart = deleteCart;
module.exports.checkRequiredAddressFields = checkRequiredAddressFields;
module.exports.validateUserData = validateUserData;
module.exports.checkRequiredBookingFields = checkRequiredBookingFields;
module.exports.validateBookingData = validateBookingData;
module.exports.addBooking = addBooking;
module.exports.getAvailability = getAvailability;
module.exports.getAllConfirmedBookings = getAllConfirmedBookings;
module.exports.getAllNonPendingOrders = getAllNonPendingOrders;