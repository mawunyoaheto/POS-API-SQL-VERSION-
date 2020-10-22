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

var epayRes = {};

async function getEpaymentPayloadTypes(req, res) {
    var resp = new Response.Response(res);
    const queryString = 'SELECT * FROM epaymentloadtypes'
    const pool = await poolPromise;

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {

                epayRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, epayRes);

            } else {
                if (recordset.rowsAffected > 0) {
                    // send records as a response
                    epayRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, epayRes);
                } else {
                    epayRes = respBody.ResponseBody('failed', '', 'No record(s) found');
                    resp.json(404, epayRes);
                }

            }
        });

    } catch (error) {
        epayRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, epayRes);

    }

}



async function createEpaymentAPI(req, res) {
    var resp = new Response.Response(res);
    const pool = await poolPromise;

    const createQuery = `INSERT INTO epaymentapisetup (description, reaquesturl, statusurl, payloadtypeid, apikey, secretkey, 
      userid, code, requestbody, statusbody, active, usermachinename, usermachineip)VALUES ('${req.body.description}', 
      '${req.body.requesturl}', '${req.body.statusurl}', '${req.body.payloadtypeid}', '${req.body.apikey}', '${req.body.secretkey}', 
      '${userid}', '${req.body.code}', '${req.body.requestbody}', '${req.body.statusbody}', '${req.body.isactive}', '${userMachineName}', 
      '${userMachineIP}')`;
    // const createQuery = `INSERT INTO epaymentapisetup set description =?, reaquesturl=?, statusurl=?, payloadtypeid=?, apikey=?, secretkey=?, 
    //   userid=?, code=?, requestbody=?, statusbody=?, active=?, usermachinename=?, usermachineip=?,${values}`;

    const values = [
        req.body.description,
        req.body.requesturl,
        req.body.statusurl,
        req.body.payloadtypeid,
        req.body.apikey,
        req.body.secretkey,
        userid,
        req.body.code,
        req.body.requestbody,
        req.body.statusbody,
        req.body.isactive,
        userMachineName,
        userMachineIP,
    ];

    try {

        pool.query(createQuery, function (err, recordset) {

            if (err) {

                epayRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, epayRes);

            } else {
                if (recordset.rowsAffected > 0) {
                    // send records as a response
                    epayRes = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) inserted');
                    resp.json(200, epayRes);
                } else {
                    epayRes = respBody.ResponseBody('failed', '', 'record(s) insert failed');
                    resp.json(404, epayRes);
                }

            }
        });

    } catch (error) {
        epayRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, epayRes);

    }

}


async function getEpaymentAPI(req, res) {
    const queryString = 'select * from epaymentapisetup'
    var resp = new Response.Response(res);
    const pool = await poolPromise;

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {

                epayRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, epayRes);

            } else {
                if (recordset.rowsAffected > 0) {
                    epayRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, epayRes);
                } else {
                    epayRes = respBody.ResponseBody('failed', '', 'No record(s) found');
                    resp.json(404, epayRes);
                }

            }
        });

    } catch (error) {
        epayRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, epayRes);

    }

}


async function getEpaymentAPIByID(req, res) {
    const id = req.params.id;
    var resp = new Response.Response(res);
    const pool = await poolPromise;

    const queryString = `select * FROM epaymentapisetup WHERE id=${id}`

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {

                epayRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, epayRes);

            } else {
                if (recordset.rowsAffected > 0) {
                    epayRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, epayRes);
                } else {
                    epayRes = respBody.ResponseBody('failed', '', 'record(s) not found');
                    resp.json(404, epayRes);
                }

            }
        });

    } catch (error) {
        epayRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, epayRes);

    }

}

// async function getEPaymentAPIID(req, res) {
//   const id = req.params.id;
//   const pool = await db.dbConnection()
//   const queryString = `select * FROM public.epaymentapisetup WHERE id=${id}`

//   try {

//     pool.query(queryString, function (err, recordset) {

//       if (err) {

//         return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

//       } else {
//         if (recordset.rows.length > 0) {
//           // send records as a response
//           return res.status(200).json(recordset.rows)
//         } else {
//           return res.status(402).json('record not found')
//         }

//       }
//     });

//   } catch (error) {
//     console.log(error);
//     res.end()

//   }

// }


async function updateEpaymentAPI(req, res) {

    const id = req.params.id;
    var resp = new Response.Response(res);
    const pool = await poolPromise;

    const values = [
        req.body.description,
        req.body.requesturl,
        req.body.statusurl,
        req.body.payloadtypeid,
        req.body.apikey,
        req.body.secretkey,
        req.body.apiuserid,
        req.body.code,
        req.body.requestbody,
        req.body.statusbody,
        req.body.isactive,
        usermachinename = 'DESKTOP',
        usermachineip = '127.0.0.1',
        req.body.createuserid
    ];
    console.log(values)
    const findonequery = `SELECT * FROM epaymentapisetup WHERE id = '${id}'`;
    //console.log(values)
    const updateonequery = `UPDATE epaymentapisetup SET description ='${req.body.description}', requesturl='${req.body.requesturl}',
     statusurl='${req.body.statusurl}', payloadtypeid='${req.body.payloadtypeid}', apikey='${req.body.apikey}', secretkey='${req.body.secretkey}', 
     userid='${req.body.apiuserid}', code='${req.body.code}', requestbody='${req.body.requestbody}', statusbody='${req.body.statusbody}', 
     active='${req.body.isactive}', usermachinename='${usermachinename}', usermachineip='${usermachineip}', updatetime='${moment(new Date())}', 
     updateuserid='${userid}' WHERE id = '${id}'`;

    //const confirmed = await helper.confirmRecord(findonequery, id);

    //if (confirmed) {

    try {
        //update is done here
        await pool.query(updateonequery, (err, recordset, next) => {

            if (err) {

                epayRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, epayRes);

            } else {
                if (recordset.rowsAffected > 0) {
                    epayRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) updated');
                    resp.json(200, epayRes);
                } else {
                    epayRes = respBody.ResponseBody('failed', '', 'record(s) update failed');
                    resp.json(404, epayRes);
                }

            }
        });


    } catch (error) {
        epayRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, epayRes);
    }


    // } else {

    //   res.status(404).json({ 'message': 'Update failed: record does not exist' });

    // }

};

module.exports = {
    getEpaymentPayloadTypes,
    createEpaymentAPI,
    getEpaymentAPI,
    getEpaymentAPIByID,
    updateEpaymentAPI
}