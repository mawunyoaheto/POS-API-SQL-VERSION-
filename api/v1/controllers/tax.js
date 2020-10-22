var moment = require('moment');
const helper = require('../util/helper');
var dbConfig = require('../../../config');
const Response = require('../util/response');
const respBody = require('../util/response');
const { poolPromise } = require('../util/db');
const { Console } = require('winston/lib/winston/transports');
const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;


var taxResp = {};

//TAXES

//GET TAX
async function getTax(req, res, error) {
    var resp = new Response.Response(res);

    const queryString = 'SELECT * FROM taxes'
    const pool = await poolPromise;

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {
                taxResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, taxResp);
            } else {

                if (recordset.rowsAffected > 0) {
                    // send records as a response
                    taxResp = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(201, taxResp);

                } else {
                    taxResp = respBody.ResponseBody('failed', '', recordset.rowsAffected + ' record(s) found');
                    resp.json(404, taxResp);
                }
            }

        });

    } catch (error) {
        taxResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, taxResp);
    }
}


//GET TAX BY ID
async function getTaxByID(req, res, error) {

    var resp = new Response.Response(res);
    const id = req.query.id;
    const queryString = `SELECT * FROM taxes WHERE id ='${id}'`
    const pool = await poolPromise;

    try {

        await pool.query(queryString, function (err, recordset) {
            if (err) {
                taxResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
                resp.json(404, taxResp);
            } else {
                if (recordset.rowsAffected > 0) {

                    taxResp = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, taxResp);

                } else {
                    taxResp = respBody.ResponseBody('failed', '', recordset.rowsAffected + ' record(s) found');
                    resp.json(404, taxResp);
                };
            }

        });

    }

    catch (error) {
        taxResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, taxResp);
    }

}


///ADD TAX
async function createTax(req, res, error) {
    var resp = new Response.Response(res);
    const values = [
        req.body.taxdescription,
        req.body.percentage,
        normalizedDate = new Date(Date.now()).toISOString(),
        userid,
        userMachineName,
        userMachineIP,
        req.body.isactive,
    ];

    const pool = await poolPromise;

    const createQuery = `INSERT INTO taxes(description, percentage, create_date, isactive, create_userid, 
      usermachinename, usermachineip) VALUES ('${req.body.taxdescription}', '${req.body.percentage}', '${normalizedDate}',
      '${req.body.isactive}', '${userid}', '${userMachineName}', '${userMachineIP}')`;


    try {

        await pool.query(createQuery, values, function (err, recordset) {

            if (err) {
                taxResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, taxResp);
            } else {
                if (recordset.rowsAffected > 0) {

                    taxResp = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) added');
                    resp.json(201, taxResp);
                } else {
                    taxResp = respBody.ResponseBody('failed', '', recordset.rowsAffected + ' record(s) added');
                    resp.json(404, taxResp);
                }
            }
        });

    } catch (error) {
        taxResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, taxResp);
    }
}

//Update Tax

async function updateTax(req, res, error) {
    var resp = new Response.Response(res);
    const id = req.query.id;
    const pool = await poolPromise;

    const values = [
        req.body.taxdescription,
        req.body.percentage,
        normalizedDate = new Date(Date.now()).toISOString(),
        req.body.userid,
        req.body.isactive,
        userMachineName,
        userMachineIP
    ];

    const updateonequery = `UPDATE taxes SET description='${req.body.taxdescription}', percentage='${req.body.percentage}', 
      modified_date='${normalizedDate}', modifier_userid='${req.body.userid}', isactive='${req.body.isactive}',
      usermachinename='${userMachineName}', usermachineip='${userMachineIP}'  WHERE taxid = '${id}'`;

    try {

        await pool.query(updateonequery, function (err, recordset) {

            if (err) {

                taxResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(402, taxResp);
            } else {
                if (recordset.recordset > 0) {
                    // send records as a response
                    taxResp = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record updated');
                    resp.json(201, taxResp);
                } else {
                    taxResp = respBody.ResponseBody('failed', '', recordset.rowsAffected + ' record(s) added');
                    resp.json(404, taxResp);
                }
            }

        });


    } catch (error) {
        taxResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
        resp.json(402, taxResp);
    }

}
module.exports = {
    getTax,
    getTaxByID,
    createTax,
    updateTax
}  