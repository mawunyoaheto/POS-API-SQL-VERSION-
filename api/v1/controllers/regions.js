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

var regionRes = {};
//GET REGIONS

async function getRegions(req, res, error) {
    var resp = new Response.Response(res);

    const queryString = 'SELECT * FROM Regions'
    const pool = await poolPromise;

    try {

        await pool.query(queryString, function (err, recordset) {
            if (err) {
                regionRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, regionRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    // send records as a response
                    regionRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected+ ' record(s) found');
                    resp.json(200, regionRes);

                } else {
                    regionRes = respBody.ResponseBody('success', '', 'No record(s) found');
                    resp.json(404, regionRes);
                }
            }
        });

    } catch (error) {

        regionRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, regionRes);
    }

}


//GET REGION BY ID

async function getRegionByID(req, res, error) {
    var resp = new Response.Response(res);
    var id = req.params.id;
    var queryString = `select * FROM Regions WHERE id='${id}'`
    const pool = await poolPromise;

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {

                regionRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, regionRes);

            } else {
                if (recordset.rowsAffected > 0) {
                    // send records as a response
                    regionRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, regionRes);
                } else {
                    regionRes = respBody.ResponseBody('success', '', 'No record found');
                    resp.json(404, regionRes);
                }

            }
        });

    } catch (error) {
        regionRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, regionRes);
    }

}



//ADD OUTLET

async function createRegion(req, res) {
    var resp = new Response.Response(res);
    const values = [
        req.body.description,
        req.body.zoneid,
        req.body.isactive,
        userid,
        userMachineName,
        userMachineIP
    ];
    const pool = await poolPromise;

    const createQuery = `INSERT INTO Regions(description, zoneid,userid,isactive, usermachinename, usermachineip) VALUES ('${req.body.description}',
      '${req.body.zoneid}', '${req.body.isactive}', '${userid}', '${userMachineName}', '${userMachineIP}')`;


    try {

        await pool.query(createQuery, function (err, recordset) {
            if (err) {
                regionRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, regionRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    regionRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) inserted');
                    resp.json(200, regionRes);
                } else {

                    regionRes = respBody.ResponseBody('success', '', 'record(s) insert failed');
                    resp.json(404, regionRes);

                }
            }
        });

    } catch (error) {

        regionRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, regionRes);
    }
}

//UPDATE REGION
async function updateRegion(req, res) {

    var resp = new Response.Response(res);
    const id = req.params.id;

    const pool = await poolPromise;

        normalizedDate = new Date(Date.now()).toISOString();

    const updateonequery = `UPDATE Regions SET description='${req.body.description}',code='${req.body.code}', 
    zoneid='${req.body.zoneid}', iasactive='${req.body.isactive}', modified_date='${normalizedDate}',
    modifier_userid='${userid}',usermachinename ='${userMachineName}', usermachineip='${userMachineIP}' WHERE id = '${id}'`;

    try {

        pool.query(updateonequery, function (err, recordset) {

            if (err) {

                regionRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, regionRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    regionRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record updated');
                    resp.json(200, regionRes);
                } else {

                    regionRes = respBody.ResponseBody('failed', '', 'update failed');
                    resp.json(404, regionRes);
                }

            }
        });

    } catch (error) {
        regionRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, regionRes);
    }
};

module.exports = {
    getRegions,
    getRegionByID,
    createRegion,
    updateRegion
}