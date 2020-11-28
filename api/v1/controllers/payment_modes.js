var moment = require('moment');
const helper = require('../util/helper');
const Response = require('../util/response');
const respBody = require('../util/response');
var dbConfig = require('../../../config');

const { poolPromise } = require('../util/db');
const { Console } = require('winston/lib/winston/transports');
const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;

var paymodeRes = {};

//GET PAYMENT MODE
async function getPaymentModes(req, res) {
    var resp = new Response.Response(res);
    const queryString = 'select * from payment_modes'
    const pool = await poolPromise;

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {
                paymodeRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, paymodeRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    // send records as a response
                    paymodeRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, paymodeRes);

                } else {
                    paymodeRes = respBody.ResponseBody('success', '', 'No record(s) found');
                    resp.json(404, paymodeRes);
                }
            }
        });

    } catch (error) {
        paymodeRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, paymodeRes);
    }
}
    //GET PAYMENT MODE BY ID
    async function getPaymentModeByID(req, res) {
        var resp = new Response.Response(res);
        const id = req.params.id
        const queryString = `select * FROM payment_modes WHERE id='${id}'`
        const pool = await poolPromise;

        try {

            pool.query(queryString, function (err, recordset) {

                if (err) {

                    paymodeRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                    resp.json(404, paymodeRes);

                } else {
                    if (recordset.rowsAffected > 0) {
                        paymodeRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                        resp.json(200, paymodeRes);
                    } else {
                        paymodeRes = respBody.ResponseBody('failed', '', 'record(s) not found');
                        resp.json(404, paymodeRes);
                    }
                }
            });

        } catch (error) {
            paymodeRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
            resp.json(404, paymodeRes);

        }

    }



    //ADD PAYMENT MODE
    async function createPaymentMode(req, res) {
        var resp = new Response.Response(res);
        const values = [
            req.body.description,
            req.body.isactive,
            normalizedDate = new Date(Date.now()).toISOString(),
            userid,
            userMachineName,
            userMachineIP
        ];
        const pool = await poolPromise;

        const createQuery = `INSERT INTO payment_modes(description, isactive, create_date, create_user_id, usermachinename, usermachineip)
          VALUES ('${req.body.description}', '${req.body.isactive}', '${normalizedDate}', '${userid}', '${userMachineName}', '${userMachineIP}')`;

        // const createQuery = `INSERT INTO payment_modes SET description =?, isactive=?, create_date=?, create_user_id=?, 
        // usermachinename=?, usermachineip=?,${values}`;

        try {

            await pool.query(createQuery, function (err, recordset) {
                if (err) {

                    paymodeRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                    resp.json(404, paymodeRes);

                } else {
                    if (recordset.rowsAffected > 0) {
                        // send records as a response
                        paymodeRes = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) inserted');
                        resp.json(200, paymodeRes);
                    } else {
                        paymodeRes = respBody.ResponseBody('failed', '', 'record(s) insert failed');
                        resp.json(404, paymodeRes);
                    }

                }
            });

        } catch (error) {
            paymodeRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
            resp.json(404, paymodeRes);

        }

    }


    //UPDATE PAYMENT MODE
    async function updatePaymentMode(req, res) {
        var resp = new Response.Response(res);
        const id = req.params.id;
        const pool = await poolPromise;

        const values = [
            req.body.description,
            req.body.isactive,
            normalizedDate = new Date(Date.now()).toISOString(),
            req.body.userid,
            userMachineName,
            userMachineIP
        ];

        const updateonequery = `UPDATE payment_modes SET description='${req.body.description}', isactive='${req.body.isactive}', 
    modified_date='${normalizedDate}', modifier_id='${req.body.userid}', usermachinename='${userMachineName}', usermachineip='${userMachineIP}'
      WHERE id = '${id}'`;

        try {

            await pool.query(updateonequery, function (err, recordset) {

                if (err) {

                    paymodeRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                    resp.json(404, paymodeRes);

                } else {
                    if (recordset.rowsAffected > 0) {
                        paymodeRes = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) updated');
                        resp.json(200, paymodeRes);
                    } else {
                        paymodeRes = respBody.ResponseBody('failed', '', 'record(s) update failed');
                        resp.json(404, paymodeRes);
                    }

                }
            });


        } catch (error) {
            paymodeRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
            resp.json(404, paymodeRes);
        }

    };

    module.exports = {
        getPaymentModes,
        getPaymentModeByID,
        createPaymentMode,
        updatePaymentMode
    }