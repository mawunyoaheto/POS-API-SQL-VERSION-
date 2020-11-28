var moment = require('moment');
const {poolPromise}=require('../util/db');
const helper = require('../util/helper');
var dbConfig = require('../../../config');
const Response = require('../util/response');
const respBody = require('../util/response');


const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;

var userCatResp={}

 //GET User Categories

 async function getUserCategories(req, res, error) {
    var resp = new Response.Response(res);
    const pool = await poolPromise
  
    try {
  
      pool.query('select * from user_categories', function (err, recordset) {
  
        if (recordset.rowCount > 0) {
          // send records as a response
         userCatResp = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
          resp.json(201,userCatResp);
  
        } else {
           userCatResp = respBody.ResponseBody('success', '', recordset.rowCount + ' record(s) found');
            resp.json(402,userCatResp);
        }
      });
  
    } catch (error) {
       userCatResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(500,userCatResp);
    }
  
  }
  
  
  //GET User Category BY ID
  
  async function getUserCategoryID(req, res, error) {
  
    const id = req.params.id
    const queryString = `select * FROM user_categories WHERE id='${id}'`
    const pool = await poolPromise
  
    try {
  
      pool.query(queryString, function (err, recordset) {
  
          if (recordset.rowCount > 0) {
            // send records as a response
           userCatResp = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
          resp.json(201,userCatResp);
  
          } else {
           userCatResp = respBody.ResponseBody('success', '', recordset.rowCount + ' record(s) found');
            resp.json(402,userCatResp);
          }
      });
  
    } catch (error) {
       userCatResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(500,userCatResp);
    }
  
  }
  
  //ADD User Category
  async function createUserCategory(req, res, error) {
  
    
    const pool = await poolPromise
  
    const createQuery = `INSERT INTO public.user_categories(category, isactive, create_userid, create_date, usermachinename, usermachineip)
      VALUES ($1, $2, $3, $4, $5, $6) returning *`;
  
      const values = [
        req.body.category,
        req.body.isactive,
        req.body.createuser_id,
        moment(new Date()),
        userMachineName,
        userMachineIP
      ];
  
    try {
  
      const row_count = await pool.query(createQuery,values) 
  
          if (row_count.rowCount > 0) {
            // send records as a response
           userCatResp = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
          resp.json(201,userCatResp);
  
          } else {
           userCatResp = respBody.ResponseBody('success', '', recordset.rowCount + ' record(s) found');
            resp.json(402,userCatResp);
          }
  
    } catch (error) {
       userCatResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(500,userCatResp);
    }
  }
  
  
  //UPDATE User Category
  
  async function updateUserCategory(req, res,error) {
  
    const id = req.params.id;
    const pool = await poolPromise;
  
    const values = [
      req.body.category,
      req.body.isactive,
      req.body.userId,
      moment(new Date()),
      userMachineName,
      userMachineIP
    ];
  
    const updateonequery = `UPDATE public.user_categories SET category='${req.body.category}', isactive='${req.body.isactive}', 
    create_userid='${req.body.userId}',  modifier_userid='${req.body.userId}', modified_date='${moment(new Date())}', 
    usermachinename='${userMachineName}', usermachineip='${userMachineIP}' WHERE id = '${id}' returning *`;
  
    try {
  
      const recordset = await pool.query(updateonequery)
  
          if (recordset.rowCount > 0) {
            // send records as a response
           userCatResp = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
          resp.json(201,userCatResp);
  
          } else {
           userCatResp = respBody.ResponseBody('success', '', recordset.rowCount + ' record(s) found');
            resp.json(402,userCatResp);
          }
  
    } catch (error) {
       userCatResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(500,userCatResp);
    }
  
  }

  module.exports = {
    getUserCategories,
    getUserCategoryID,
    updateUserCategory,
    createUserCategory
  };