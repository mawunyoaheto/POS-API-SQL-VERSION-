var moment = require('moment');
const {poolPromise}=require('../util/db');
const helper = require('../util/helper');
var dbConfig = require('../../../config');
var Response = require('../util/response');
var respBody = require('../util/response');
const { error } = require('../util/winston');
const sql = require('mssql');
const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;
var userAccessRes = {};


async function getAllUserAccessLevelPermissions(req, res, error) {
    var resp = new Response.Response(res);

    const queryString = `SELECT * FROM user_accesslevelpermissions where active='True'`
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
    var queryString = `select * FROM user_accesslevelpermissions WHERE usercode='${id}' and active='True'`
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
    const pool = await poolPromise;
    var resp = new Response.Response(res);
    const transaction = new sql.Transaction(pool);

    try {

        // await pool.query('BEGIN')
        await transaction.begin();
        const trnxReq = new sql.Request(transaction);

        for (i=0;i<req.body.length; i++){

            const createQuery = `INSERT INTO user_accesslevelpermissions(usercode, moduleid,moduletransid,
                transtageid,canadd,canedit,canview,canprint, candelete,canviewchangelog,active, userid,usermachinename,usermachineip) VALUES 
                ('${req.body[i].usercode}','${req.body[i].moduleid}', '${req.body[i].moduletransid}','${req.body[i].transstageid}', 
                '${req.body[i].add}','${req.body[i].edit}','${req.body[i].view}','${req.body[i].print}','${req.body[i].delete}',
                '${req.body[i].viewlog}','${req.body[i].isactive}','${userid}', '${userMachineName}', '${userMachineIP}')`;

                recordset = await trnxReq.query(createQuery);
        }

        await transaction.commit();

        userAccessRes = respBody.ResponseBody('success', '', req.body.length + ' Access Level Permissions created ');
        resp.json(200, userAccessRes);

    } catch (error) {

        await transaction.rollback();
        userAccessRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, userAccessRes);
    }
}

async function updateUserAccessLevelPermissions(req, res) {

    const pool = await poolPromise;
    var resp = new Response.Response(res);
    const transaction = new sql.Transaction(pool);
    var userCode = req.params.usercode;

    normalizedDate = new Date(Date.now()).toISOString();
    try {

        // await pool.query('BEGIN')
        await transaction.begin();
        const trnxReq = new sql.Request(transaction);

        var deleteQuery =`DELETE FROM user_accesslevelpermissions WHERE usercode='${userCode}'`;

        await trnxReq.query(deleteQuery);
        
        for (i=0;i<req.body.length; i++){

            const createQuery = `INSERT INTO user_accesslevelpermissions(usercode, moduleid,moduletransid,
                transtageid,canadd,canedit,canview,canprint, candelete,canviewchangelog,active, userid,usermachinename,usermachineip) VALUES 
                ('${userCode}','${req.body[i].moduleid}', '${req.body[i].moduletransid}','${req.body[i].transstageid}', 
                '${req.body[i].add}','${req.body[i].edit}','${req.body[i].view}','${req.body[i].print}','${req.body[i].delete}',
                '${req.body[i].viewlog}','${req.body[i].isactive}','${userid}', '${userMachineName}', '${userMachineIP}')`;

                recordset = await trnxReq.query(createQuery);
        }

        await transaction.commit();

        userAccessRes = respBody.ResponseBody('success', '', req.body.length + ' Access Level Permissions updated ');
        resp.json(200, userAccessRes);

    } catch (error) {

        await transaction.rollback();
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