var moment = require('moment');
const {poolPromise}=require('../util/db');
const helper = require('../util/helper');
var respBody=require('../util/response');
var dbConfig = require('../../../config');
const Response = require('../util/response');
const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;

var productCatRes = {};

//GET ALL PRODUCT CATEGORIES
async function getProductCategories(req, res, error) {
    var resp = new Response.Response(res);
    //var getAllProductCatRes = {};
  
  
    //const pool = await poolPromise
  
    const pool = await poolPromise;
  
    try {
  
      const rs = pool.query('select * from product_categories')
  
        if (rs.rowsAffected > 0) {
    
          productCatRes= respBody.ResponseBody('success',rs.recordset,rs.rowsAffected + ' record(s) found');
          resp.json(200, productCatRes);
  
        } else {
    
          productCatRes= respBody.ResponseBody('failed','',rs.rowsAffected + ' record(s) found');
          resp.json(404, productCatRes);
        }
      
  
    } catch (error) {
   
      productCatRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
      resp.json(404, productCatRes);
    }
  
  };
  
  
  //GET PRODUCT CATEGORY BY ID
  async function getProductCategoryID(req, res, error) {
    var resp = new Response.Response(res);
    var catID = req.params.id;
    const pool = await poolPromise;
  
    try {
  
    var recordset = await pool.query(`select * FROM product_categories WHERE id ='${catID}'`);
  
      if (recordset.rowCount > 0) {
        // send records as a response
        productCatRes= respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
          resp.json(200, productCatRes);
  
      } else {
       // return res.status(404).json({ 'message': 'failed' })
        
        productCatRes= respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
        resp.json(404, productCatRes);
  
      }
  
  
    } catch (error) {
      //return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
      productCatRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
      resp.json(404, productCatRes);
    }
  
  }
  
  
  
  //CREATE PRODUCT CATEGORY
  async function createPoductCategory(req, res, error) {
    var resp = new Response.Response(res);
    const pool = await poolPromise;
  
    const createQuery = `INSERT INTO product_categories(category, isactive, create_userid, create_date, usermachinename, usermachineip) 
      VALUES ( $1, $2, $3, $4, $5, $6) returning *`;
  
    const values = [
      req.body.category,
      req.body.isactive,
      req.body.userId,
      moment(new Date()),
      userMachineName,
      userMachineIP
    ];
  
    try {
  
      const row_count = await pool.query(createQuery, values);
  
      if (row_count.rowCount > 0) {
        // send records as a response
       // return res.status(201).json({ 'message': 'success' })
  
        productCatRes= respBody.ResponseBody('success',row_count.rows,row_count.rowCount + ' record(s) found');
        resp.json(201, productCatRes);
  
      } else {
    
        productCatRes= respBody.ResponseBody('success',row_count.rows,row_count.rowCount + ' record(s) found');
        resp.json(404, productCatRes);
      }
  
    } catch (error) {
      productCatRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error,createQuery));
      resp.json(404, productCatRes);
    }
  }
  
  
  
  //UPDATE PRODUCT CATEGORY
  async function updateProductCategory(req, res, error) {
    var resp = new Response.Response(res);
    const catID = req.params.id;
    const pool = await poolPromise;
  
    const values = [
      req.body.category,
      req.body.isactive,
      req.body.userId,
      moment(new Date()),
      userMachineName,
      userMachineIP
    ];
  
    const updateonequery = `UPDATE product_categories SET category='${req.body.category}', isactive='${req.body.isactive}', 
      modified_date='${moment(new Date())}', modifier_userid='${req.body.userId}', usermachinename='${userMachineName}', 
      usermachineip='${userMachineIP}' WHERE id = '${catID}' returning *`;
  
  
    try {
      //update is done here
      const row_count = await pool.query(updateonequery)
  
      if (row_count.rowCount > 0) {
  
        //res.status(201).json({ 'message': 'success' });
      
        productCatRes= respBody.ResponseBody('success',row_count.rows,row_count.rowCount + ' record(s) found');
        resp.json(201, productCatRes);
      } else {
       productCatRes= respBody.ResponseBody('failed',row_count.rows,row_count.rowCount + ' record(s) found');
       resp.json(404, productCatRes);
      }
  
  
    } catch (error) {
  
      productCatRes= respBody.ResponseBody('success','','failed with error: ' + helper.parseError(error,updateonequery));
      resp.json(404, productCatRes);
    }
  
  }

  //GET PRODUCT CATEGORY BY DESCRIPTION
  async function getProductCategoryByDescription(description){
    const pool = await poolPromise;

  const queryString = `select * FROM product_categories WHERE category='${description}'` 

  try {

    const recordset = await pool.query(queryString);

            if (recordset.rowsAffected > 0) {
               return recordset.recordset
              } else {
               return "";
              }
        
      } catch (error) {
    return error;
   }
  }
  module.exports = {
    createPoductCategory,
    getProductCategories,
    getProductCategoryID,
    updateProductCategory,
    getProductCategoryByDescription
  }