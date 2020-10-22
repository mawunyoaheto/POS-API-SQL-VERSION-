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

var townRes = {};
//GET TOWNS

async function getTowns(req, res, error) {
    var resp = new Response.Response(res);

    const queryString = 'SELECT * FROM towns'
    const pool = await poolPromise;

    try {

        await pool.query(queryString, function (err, recordset) {
            if (err) {
                townRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, townRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    // send records as a response
                    townRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected+ ' record(s) found');
                    resp.json(200, townRes);

                } else {
                    townRes = respBody.ResponseBody('success', '', 'No record(s) found');
                    resp.json(404, townRes);
                }
            }
        });

    } catch (error) {

        townRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, townRes);
    }

}


//GET TOWN BY ID

async function getTownByID(req, res, error) {
    var resp = new Response.Response(res);
    var id = req.query.id;
    var queryString = `select * FROM towns WHERE id='${id}'`
    const pool = await poolPromise;

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {

                townRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, townRes);

            } else {
                if (recordset.rowsAffected > 0) {
                    // send records as a response
                    townRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, townRes);
                } else {
                    townRes = respBody.ResponseBody('success', '', 'No record found');
                    resp.json(404, townRes);
                }

            }
        });

    } catch (error) {
        townRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, townRes);
    }

}

//GET TOWNS BY DISTRICT ID
async function getTownByDistrictID(req, res, error) {
    var resp = new Response.Response(res);
    var id = req.query.id;
    var queryString = `select * FROM towns WHERE districtid='${id}'`
    const pool = await poolPromise;

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {

                townRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, townRes);

            } else {
                if (recordset.rowsAffected > 0) {
                    // send records as a response
                    townRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, townRes);
                } else {
                    townRes = respBody.ResponseBody('success', '', 'No record found');
                    resp.json(404, townRes);
                }

            }
        });

    } catch (error) {
        townRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, townRes);
    }

}

async function ggetTownByDistrictIDTownDescription(req, res, error) {
    var resp = new Response.Response(res);
    var id = req.query.id;
    var id = req.query.description;

    var queryString = `select * FROM towns WHERE districtid='${id}' AND description LIKE '%${req.body.description}%'`
    const pool = await poolPromise;

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {

                townRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, townRes);

            } else {
                if (recordset.rowsAffected > 0) {
                    // send records as a response
                    townRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, townRes);
                } else {
                    townRes = respBody.ResponseBody('success', '', 'No record found');
                    resp.json(404, townRes);
                }

            }
        });

    } catch (error) {
        townRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, townRes);
    }

}


//ADD DISTRICT

async function createTown(req, res) {
    var resp = new Response.Response(res);

    const pool = await poolPromise;

    const createQuery = `INSERT INTO towns(description, districtid,code,userid,isactive, usermachinename, usermachineip) VALUES ('${req.body.description}',
      '${req.body.districtid}', '${req.body.code}','${req.body.isactive}', '${userid}', '${userMachineName}', '${userMachineIP}')`;


    try {

        await pool.query(createQuery, function (err, recordset) {
            if (err) {
                townRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, townRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    townRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) inserted');
                    resp.json(200, townRes);
                } else {

                    townRes = respBody.ResponseBody('success', '', 'record(s) insert failed');
                    resp.json(404, townRes);

                }
            }
        });

    } catch (error) {

        townRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, townRes);
    }
}

//UPDATE DISTRICT
async function updateTown(req, res) {

    var resp = new Response.Response(res);
    const id = req.query.id;

    const pool = await poolPromise;

        normalizedDate = new Date(Date.now()).toISOString();

    const updateonequery = `UPDATE towns SET description='${req.body.description}',code='${req.body.code}', 
    districtid='${req.body.districtid}', iasactive='${req.body.isactive}', modified_date='${normalizedDate}',
    modifier_userid='${userid}',usermachinename ='${userMachineName}', usermachineip='${userMachineIP}' WHERE id = '${id}'`;

    try {

        pool.query(updateonequery, function (err, recordset) {

            if (err) {

                townRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, townRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    townRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record updated');
                    resp.json(200, townRes);
                } else {

                    townRes = respBody.ResponseBody('failed', '', 'update failed');
                    resp.json(404, townRes);
                }

            }
        });

    } catch (error) {
        townRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, townRes);
    }
};

module.exports = {
    getTowns,
    getTownByID,
    getTownByDistrictID,
    ggetTownByDistrictIDTownDescription,
    createTown,
    updateTown
}