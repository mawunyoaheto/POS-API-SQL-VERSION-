var moment = require('moment');
//import uuidv4 from 'uuid/v4';
//var uuidv4 = require('uuidv4');
//const db = require('../util/db');
const {poolPromise}=require('../util/db');
const helper = require('../util/helper');
var respBody=require('../util/response');
var dbConfig = require('../../../config');
const Response = require('../util/response');
const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;




var productsRes = {};

//GET Products

async function getProducts(req, res, error) {
  var resp = new Response.Response(res);
  var getAllProductsRes = {};
  const pool = await poolPromise

  try {

    pool.query('select * from products', function (err, recordset) {

      if (recordset.rowsAffected > 0) {
     
       getAllProductsRes= respBody.ResponseBody('success',recordset.recordset,recordset.rowsAffected + ' record(s) found');
        resp.json(200, getAllProductsRes);

      } else {
   
        getAllProductsRes= respBody.ResponseBody('success',recordset.rows,recordset.length + ' record(s) found');
        resp.json(404, getAllProductsRes);
      }
    });

  } catch (error) {

    getAllProductsRes= respBody.ResponseBody('failed',recordset.rows,'failed with error: '+ helper.parseError(error, queryString) );
    resp.json(404, getAllProductsRes);
  }

}


//GET Products BY ID

async function getProductByID(req, res, error) {

  var resp = new Response.Response(res);
  var productID = req.params.id;
  const pool = await poolPromise

  try {

    var recordset = await pool.query(`select * FROM products WHERE id='${productID}'`)

    if (recordset.rowsAffected > 0) {
      // send records as a response
      //return res.status(200).json(recordset.rows)

      productsRes =respBody.ResponseBody('success',recordset.recordset,'product found with ID: '+ productID);
      resp.json(200, productsRes);

    } else {

      //return res.status(404).json({ 'message': 'failed' })
      productsRes =respBody.ResponseBody('success',recordset.rows,recordset.rowsAffected + ' record(s) found');
      resp.json(404, productsRes);
    }


  } catch (error) {
    //return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
    productsRes = respBody.ResponseBody('failed',recordset.rows,'failed with error: '+ helper.parseError(error, queryString));
    resp.json(400, productsRes);
  }

}

//CREATE Product

async function createPoduct(req, res) {
  var resp = new Response.Response(res);
  var createProductsRes = {};
  const pool = await poolPromise

  const createQuery = `INSERT INTO products(description, extended_description, product_code, cost_price, s_price, category_id,baseunit_id, 
      create_userid, archived, usermachinename, usermachineip)
      VALUES ('${req.body.description}','${req.body.ext_description}', '${req.body.product_code}', '${req.body.cost_price}', '${req.body.s_price}', 
        '${req.body.category_id}', '${req.body.baseunit_id}', '${req.body.userid}', '${req.body.archived}', '${userMachineName}', '${userMachineIP}')`;

  // const values = [
  //   req.body.description,
  //   req.body.ext_description,
  //   req.body.product_code,
  //   req.body.cost_price,
  //   req.body.s_price,
  //   req.body.category_id,
  //   req.body.baseunit_id,
  //   req.body.userid,
  //   req.body.archived,
  //   userMachineName,
  //   userMachineIP
  // ];

  try {
    
    await pool.query(createQuery, (err, result)=>{
      if (err){
        console.log(err);
        createProductsRes= respBody.ResponseBody('failed','','failed with error: '+ helper.parseError(err) );
        resp.json(404, createProductsRes);
      }
      else{

        if (result.rowsAffected > 0) {
          createProductsRes= respBody.ResponseBody('success',result.recordset,result.rowsAffected + ' record(s) inserted');
          resp.json(201, createProductsRes);
  
      } else {
          createProductsRes= respBody.ResponseBody('success',result.recordset,result.rowsAffected + 'create product failed');
          resp.json(404, createProductsRes);
      }
      }
    });

  } catch (error) {
    createProductsRes= respBody.ResponseBody('failed',result.recordset,'failed with error: '+ helper.parseError(error) );
    resp.json(404, createProductsRes);
  }
}


//update a Product
async function updateProduct(req, res, error) {
  var resp = new Response.Response(res);
  var updateProductsRes = {};
  const id = req.params.id;
  
  const pool = await poolPromise;

  const values = [
    req.body.description,
    req.body.ext_description,
    req.body.product_code,
    req.body.cost_price,
    req.body.s_price,
    req.body.category_id,
    req.body.userid,
    moment(new Date()),
    req.body.archived,
    userMachineName,
    userMachineIP
  ];

  const updateonequery = `UPDATE products SET description='${req.body.description}', extended_description='${req.body.ext_description}', 
  product_code='${req.body.product_code}', cost_price='${req.body.cost_price}', s_price='${req.body.s_price}', category_id='${req.body.category_id}', 
  archived='${req.body.archived}', modified_date='${moment(new Date())}', modifier_id='${req.body.userid}', usermachinename='${userMachineName}', 
  usermachineip='${userMachineIP}', baseunit_id='${req.body.baseunit_id}' WHERE id = '${id}' returning *`;

  
  const productChangeLogQuery = `INSERT INTO productsChangeLogs(description, extended_description, product_code, cost_price, s_price, category_id,baseunit_id, 
    create_userid, archived, usermachinename, usermachineip,logType,loggerId,logTime))
    VALUES ('${req.body.description}','${req.body.ext_description}', '${req.body.product_code}', '${req.body.cost_price}', '${req.body.s_price}', 
      '${req.body.category_id}', '${req.body.baseunit_id}', '${req.body.userid}', '${req.body.archived}', '${userMachineName}', '${userMachineIP}',
      'EDIT','${moment(new Date())}','${req.body.userid}')`;

  try {

    await pool.query(updateonequery,(err, result)=>{
      if (err){

        updateProductsRes = respBody.ResponseBody('failed','','update failed with error: '+ helper.parseError(err, updateonequery));
        resp.json(400, updateProductsRes);
      }
      else{
        if (result.rowCount > 0) {
         updateProductsRes = respBody.ResponseBody('success',result.recordset,' record updated succesfully');
         resp.json(201, updateProductsRes);

        } else {
          updateProductsRes = respBody.ResponseBody('failed','','failed to update record');
          resp.json(402, updateProductsRes);
        }
      }
    });   

  } catch (error) {
    updateProductsRes = respBody.ResponseBody('failed',row_count.rows,'update failed with error: '+ helper.parseError(error, updateonequery));
    resp.json(400, updateProductsRes);
  }
}


//return product details
async function getProductDescriptionByID(id) {

  const pool = await poolPromise

  try {

    var recordset = await pool.query(`select * FROM products WHERE id='${id}' and Archived ='No'`)

    if (recordset.rowsAffected > 0) {
     
      return recordset.recordset[0].description

    } else {

    }


  } catch (error) {
    return error
  }

}
module.exports = {
  getProducts,
  getProductByID,
  createPoduct,
  updateProduct,
  getProductDescriptionByID
}

