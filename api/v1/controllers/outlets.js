var moment = require('moment');
//import uuidv4 from 'uuid/v4';
//var uuidv4 = require('uuidv4');
//const db = require('../util/db_worm');
const helper = require('../util/helper');
const Response = require('../util/response');
const respBody = require('../util/response');
var dbConfig = require('../../../config');

const { poolPromise } = require('../util/db');
const { Console } = require('winston/lib/winston/transports');
const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;

var outletsRes = {};
//GET OUTLETS

async function getOutlets(req, res, error) {
    var resp = new Response.Response(res);

    const queryString = 'SELECT * FROM outlets'
    const pool = await poolPromise;

    try {

        await pool.query(queryString, function (err, recordset) {
            if (err) {
                outletsRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, outletsRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    // send records as a response
                    outletsRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected+ ' record(s) found');
                    resp.json(200, outletsRes);

                } else {
                    outletsRes = respBody.ResponseBody('success', '', 'No record(s) found');
                    resp.json(404, outletsRes);
                }
            }
        });

    } catch (error) {

        outletsRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, outletsRes);
    }

}


//GET OUTLET BY ID

async function getOutletsByID(req, res, error) {
    var resp = new Response.Response(res);
    var id = req.params.id;;
    var queryString = `select * FROM outlets WHERE id='${id}'`
    const pool = await poolPromise;

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {

                outletsRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, outletsRes);

            } else {
                if (recordset.rowsAffected > 0) {
                    // send records as a response
                    outletsRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, outletsRes);
                } else {
                    outletsRes = respBody.ResponseBody('success', '', 'No record found');
                    resp.json(404, outletsRes);
                }

            }
        });

    } catch (error) {
        outletsRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, outletsRes);
    }

}



//ADD OUTLET

async function createOutlet(req, res) {
    var resp = new Response.Response(res);
    const values = [
        req.body.outletname,
        req.body.countryID,
        req.body.regionID,
        req.body.cityID,
        req.body.email,
        req.body.contactNumber,
        req.body.taxID,
        normalizedDate = new Date(Date.now()).toISOString(),
        req.body.isactive,
        userMachineName,
        userMachineIP
    ];
    const pool = await poolPromise;

    const createQuery = `INSERT INTO outlets(outlet_name, country_id, region_id, city_id, email, contactnumbers, tax_id, create_userid, 
      create_date, isactive, usermachinename, usermachineip) VALUES ('${req.body.outletname}','${req.body.countryID}',
      '${req.body.regionID}', '${req.body.cityID}', '${req.body.email}', '${req.body.contactNumber}', '${req.body.taxID}', 
      '${userid}', '${normalizedDate}', '${req.body.isactive}', '${userMachineName}', '${userMachineIP}')`;


    try {

        await pool.query(createQuery, function (err, recordset) {
            if (err) {
                outletsRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, outletsRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    outletsRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) inserted');
                    resp.json(200, outletsRes);
                } else {

                    outletsRes = respBody.ResponseBody('success', '', 'record(s) insert failed');
                    resp.json(404, outletsRes);

                }
            }
        });

    } catch (error) {

        outletsRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, outletsRes);
    }
}

//UPDATE OUTLET
async function updateOutlet(req, res) {

    var resp = new Response.Response(res);
    const id = req.params.id;

    const pool = await poolPromise;

    const values = [
        req.body.outletname,
        req.body.taxID,
        req.body.countryID,
        req.body.regionID,
        req.body.cityID,
        req.body.email,
        req.body.contactnumber,
        normalizedDate = new Date(Date.now()).toISOString(),
        req.body.userid,
        req.body.isactive
    ];

    const updateonequery = `UPDATE outlets SET outlet_name='${req.body.outletname}', tax_id='${req.body.taxID}', 
    country_id='${req.body.countryID}', region_id='${req.body.regionID}', city_id='${req.body.cityID}', 
    email='${req.body.email}', contactnumbers='${req.body.contactnumber}', modified_date='${normalizedDate}', 
    modifier_userid='${userid}',isactive='${req.body.isactive}', usermachinename ='${userMachineName}', 
    usermachineip='${userMachineIP}' WHERE id = '${id}'`;

    try {

        pool.query(updateonequery, function (err, recordset) {

            if (err) {

                outletsRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, outletsRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    outletsRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record updated');
                    resp.json(200, outletsRes);
                } else {

                    outletsRes = respBody.ResponseBody('failed', '', 'update failed');
                    resp.json(404, outletsRes);
                }

            }
        });

    } catch (error) {
        outletsRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, outletsRes);
    }
};

// var transaction = new sql.Transaction(pool);
//     transaction.begin(function(err) {
//         // ... error checks 
//          console.log("[Info]","Begin Transaction.");
//         if(err) {
//             console.log(err);
//             process.exit(-1)
//         }
//         var request = new sql.Request(transaction);
//         var transactionFailed = false;

//         var request = new sql.Request(transaction);
//         //request.multiple = true;
//         request.verbose = true;
//         request.query(upsertQuery);
//         console.log("[Info]",request)
//         request.on('error', function(err) {
//             transactionFailed = true;
//             console.log(['Error'],err.toString())

//         });
//         request.on('done', function(errs) {
//             if(transactionFailed) {
//                 transaction.rollback(function(err) {
//                     if(err) {
//                         console.log(err);
//                         process.exit(-1)
//                     }
//                     else {
//                         process.exit(-1)
//                     }

//                 }); 
//             }
//             else {
//                 transaction.commit(function(err) {
//                     if(err) {
//                         console.log(err);
//                         process.exit(-1)

//                     }
//                     else {
//                         console.log("Transaction Committed!")
//                     } 
//                 });
//             }

//         });
//     });
module.exports = {
    getOutlets,
    getOutletsByID,
    createOutlet,
    updateOutlet
}