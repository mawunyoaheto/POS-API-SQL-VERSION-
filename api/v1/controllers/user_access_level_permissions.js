var moment = require('moment');
const {poolPromise}=require('../util/db');
const helper = require('../util/helper');
var dbConfig = require('../../../config');
var Response = require('../util/response');
var respBody = require('../util/response');
const { error } = require('../util/winston');

const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;
var userAccessRes = {};


async function getAllUserAccessLevelPermissions(req, res, error) {
    var resp = new Response.Response(res);

    const queryString = `SELECT * FROM UserAccessAccessLevelPermissions where active='Yes'`
    const pool = await poolPromise;

    try {

        await pool.query(queryString, function (err, recordset) {
            if (err) {
                userAccessRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, userAccessRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    // send records as a response
                    userAccessRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected+ ' record(s) found');
                    resp.json(200, userAccessRes);

                } else {
                    userAccessRes = respBody.ResponseBody('success', '', 'No record(s) found');
                    resp.json(404, userAccessRes);
                }
            }
        });

    } catch (error) {

        userAccessRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, userAccessRes);
    }

}

async function getUserAccessLevelPermissionsByID(req, res, error) {
    var resp = new Response.Response(res);
    var id = req.params.usercode;
    var queryString = `select * FROM UserAccessAccessLevelPermissions WHERE roleid='${id}' and active='Yes'`
    const pool = await poolPromise;

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {

                userAccessRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, userAccessRes);

            } else {
                if (recordset.rowsAffected > 0) {
                    // send records as a response
                    userAccessRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, userAccessRes);
                } else {
                    userAccessRes = respBody.ResponseBody('success', '', 'No record found');
                    resp.json(404, userAccessRes);
                }

            }
        });

    } catch (error) {
        userAccessRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, userAccessRes);
    }

}

async function createUserAccessLevelPermissions(req, res) {
    var resp = new Response.Response(res);
    const values = [
        req.body.roleid,
        req.body.moduleid,
        req.body.moduletransid,
        req.body.transstageid,
        req.body.add,
        req.body.edit,
        req.body.view,
        req.body.print,
        req.body.delete,
        req.body.viewlog,
        req.body.isactive,
        userid,
        userMachineName,
        userMachineIP
    ];
    const pool = await poolPromise;

    const createQuery = `INSERT INTO UserAccessAccessLevelPermissions(usercode, moduleid,moduletransid,
        transtageid,canadd,canedit,canview,canprint, candelete,canviewchangelog,isactive, userid) VALUES 
        ('${req.body.roleid}','${req.body.moduleid}', '${req.body.moduletransid}','${req.body.transstageid}', 
        '${req.body.add}','${req.body.edit}','${req.body.view}','${req.body.print}','${req.body.delete}',
        '${req.body.viewlog}','${req.body.isactive}','${userid}', '${userMachineName}', '${userMachineIP}')`;


    try {

        await pool.query(createQuery, function (err, recordset) {
            if (err) {
                userAccessRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, userAccessRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    userAccessRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) inserted');
                    resp.json(200, userAccessRes);
                } else {

                    userAccessRes = respBody.ResponseBody('success', '', 'record(s) insert failed');
                    resp.json(404, userAccessRes);

                }
            }
        });

    } catch (error) {

        userAccessRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, userAccessRes);
    }
}

async function updateUserAccessLevelPermissions(req, res) {
    var resp = new Response.Response(res);
    normalizedDate = new Date(Date.now()).toISOString();
    const pool = await poolPromise;

    const updateQuery = `UPDATE UserAccessAccessLevelPermissions SET usercode='${req.body.usercode}', moduleid ='${req.body.moduleid}'
    ,moduletransid='${req.body.moduletransid}',transtageid='${req.body.transstageid}',canadd='${req.body.add}',
    canedit='${req.body.edit}',canview='${req.body.view}',canprint='${req.body.print}', candelete='${req.body.delete}',
    canviewchangelog='${req.body.viewlog}',isactive='${req.body.isactive}', userid='${userid}',
    modified_date='${normalizedDate}',modifier_userid='${userid}',usermachinename='${userMachineName}',
    usermachineip='${userMachineIP}' WHERE id ='${id}'`;


    try {

        await pool.query(updateQuery, function (err, recordset) {
            if (err) {
                userAccessRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, userAccessRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    userAccessRes = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) updated');
                    resp.json(200, userAccessRes);
                } else {

                    userAccessRes = respBody.ResponseBody('success', '', 'record(s) insert failed');
                    resp.json(404, userAccessRes);

                }
            }
        });

    } catch (error) {

        userAccessRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, userAccessRes);
    }
}

module.exports={
    getAllUserAccessLevelPermissions,
    getUserAccessLevelPermissionsByID,
    createUserAccessLevelPermissions,
    updateUserAccessLevelPermissions
}