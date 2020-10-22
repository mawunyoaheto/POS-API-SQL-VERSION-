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

var districtRes = {};
//GET DISTRICTS

async function getDistricts(req, res, error) {
    var resp = new Response.Response(res);

    const queryString = 'SELECT * FROM Districts'
    const pool = await poolPromise;

    try {

        await pool.query(queryString, function (err, recordset) {
            if (err) {
                districtRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, districtRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    // send records as a response
                    districtRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected+ ' record(s) found');
                    resp.json(200, districtRes);

                } else {
                    districtRes = respBody.ResponseBody('success', '', 'No record(s) found');
                    resp.json(404, districtRes);
                }
            }
        });

    } catch (error) {

        districtRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, districtRes);
    }

}


//GET DISTRICT BY ID

async function getDistrictByID(req, res, error) {
    var resp = new Response.Response(res);
    var id = req.query.id;
    var queryString = `select * FROM Districts WHERE id='${id}'`
    const pool = await poolPromise;

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {

                districtRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, districtRes);

            } else {
                if (recordset.rowsAffected > 0) {
                    // send records as a response
                    districtRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, districtRes);
                } else {
                    districtRes = respBody.ResponseBody('success', '', 'No record found');
                    resp.json(404, districtRes);
                }

            }
        });

    } catch (error) {
        districtRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, districtRes);
    }

}



//ADD DISTRICT

async function createDistrict(req, res) {
    var resp = new Response.Response(res);

    const pool = await poolPromise;

    const createQuery = `INSERT INTO Districts(description, regionid,code,userid,isactive, usermachinename, usermachineip) VALUES ('${req.body.description}',
      '${req.body.regionid}', '${req.body.code}','${req.body.isactive}', '${userid}', '${userMachineName}', '${userMachineIP}')`;


    try {

        await pool.query(createQuery, function (err, recordset) {
            if (err) {
                districtRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, districtRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    districtRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) inserted');
                    resp.json(200, districtRes);
                } else {

                    districtRes = respBody.ResponseBody('success', '', 'record(s) insert failed');
                    resp.json(404, districtRes);

                }
            }
        });

    } catch (error) {

        districtRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, districtRes);
    }
}

//UPDATE DISTRICT
async function updateDistrict(req, res) {

    var resp = new Response.Response(res);
    const id = req.query.id;

    const pool = await poolPromise;

        normalizedDate = new Date(Date.now()).toISOString();

    const updateonequery = `UPDATE districts SET description='${req.body.description}',code='${req.body.code}', 
    regionid='${req.body.regionid}', iasactive='${req.body.isactive}', modified_date='${normalizedDate}',
    modifier_userid='${userid}',usermachinename ='${userMachineName}', usermachineip='${userMachineIP}' WHERE id = '${id}'`;

    try {

        pool.query(updateonequery, function (err, recordset) {

            if (err) {

                districtRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, districtRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    districtRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record updated');
                    resp.json(200, districtRes);
                } else {

                    districtRes = respBody.ResponseBody('failed', '', 'update failed');
                    resp.json(404, districtRes);
                }

            }
        });

    } catch (error) {
        districtRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, districtRes);
    }
};

module.exports = {
    getDistricts,
    getDistrictByID,
    createDistrict,
    updateDistrict
}