/**
 * GET /product/{id}
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const LAYER = require('/opt/nodejs/layer'); // The lambda layer for DB operations

/**
 * GET /product/{id} 
 *  
 * @param {Object} event
 * @param {Object} context
 *
 * @returns {Object}
 *  
 */
exports.handler = async (event, context) => {
    console.log("GET-PRODUCT");
    console.dir(event);
    let response = {};
    let error = null;

    try {

        let id = null;
        let type = null;
        if (event.pathParameters && event.pathParameters.id) {
            id = parseInt(event.pathParameters.id, 10);
            if (isNaN(id) || id < 1) {
                throw "Invalid product ID."
            }
        } else if (event.queryStringParameters) {
            if (event.queryStringParameters.products) {
                let products = JSON.parse(event.queryStringParameters.products);
                if (Array.isArray(products) && products.length>0) {
                    id = products;
                }
            }
            if (event.queryStringParameters.type) {
                type = event.queryStringParameters.type;
                if (type !== 'CIDER' && type !== 'MERCH' && type !== 'BUNDLE') {
                    throw "Invalid product type requested.";
                }
            }
        }
        
        // Begin the DB Transaction
        await LAYER.beginTransaction().catch( (err) => {
            response.statusCode = 500;
            throw err;
        });

        // Get product(s) from DB 
        let products = await getProducts(id, type);

        // For each product get all the variants
        /*
        for (let i=0; i<products.length; i++) {
            products[i].variants = await getVariants(products[i].id);
        }
        */
        if (products.length > 1) {
            response = {
                products: products
            }
        } else if (products.length === 1) {
            response = products[0];
        } else {
            throw "No products found.";
        }
    } catch (err) {
        error = err.toString();
        console.error('Error reading products from the database.', error);
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

async function getProducts(id, type) {
    let data = [];
    let query = "SELECT * FROM `t_product`";
    let idUsed = false;
    if (id || type) {
        query += " WHERE (";
        if (id) {
            if (Array.isArray(id) && id.length > 0) {
                query += "( " + (Array(id.length).fill('`id`=?')).join(' OR ') + ')';
                data = id;
                idUsed = true;
            } else {
                query += "(`id` = ?)";
                data.push(id);
                idUsed = true;
            }
        }
        if (type) {
            if (idUsed) { 
                query += " AND "; 
            }
            query += "(`type`=?)";
            data.push(type);
        }
        query += " );";
    }
    return await LAYER.processDbQuery(query, data);
}

/*
async function getVariants(id) {
    let query = "SELECT * FROM `t_variant` WHERE (`product_id` = ?);";
    return await LAYER.processDbQuery(query, [id]);
}
*/