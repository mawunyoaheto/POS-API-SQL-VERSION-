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
var suppliersRes = {};
//SUPPLIERS

async function getSuppliers(req, res, error) {
  var resp = new Response.Response(res);

  const queryString = 'SELECT * FROM suppliers'
  const pool = await poolPromise;

  try {

    await pool.query(queryString, function(err, recordset){
        if (err) {
            suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
            resp.json(404, suppliersRes);

        } else {
            if (recordset.rowsAffected > 0) {

                suppliersRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                resp.json(201, suppliersRes);
          
              } else {
          
                suppliersRes = respBody.ResponseBody('failed', '', recordset.rowsAffected + ' record(s) found');
                resp.json(404, suppliersRes);
              }
        }
    });
  }
  catch (error) {

    suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
    resp.json(404, suppliersRes);
  }
}


async function getSupplierByID(req, res) {
  var resp = new Response.Response(res);
  const id = req.query.id;
  const pool = await poolPromise;
  const query = `SELECT * FROM suppliers WHERE id ='${id}'`

  try {

    pool.query(query, function (err, recordset) {

      if (err) {

        suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
        resp.json(404, suppliersRes);
      } else {
        if (recordset.rowsAffected > 0) {
          // send records as a response
          suppliersRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
          resp.json(200, suppliersRes);
        } else {
          suppliersRes = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) found');
          resp.json(404, suppliersRes);
        }

      }
    });

  } catch (error) {
    suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
    resp.json(404, suppliersRes);
  }

}

//Create supplier

async function createSupplier(req, res) {
  var resp = new Response.Response(res);
  const pool = await poolPromise;

  const createQuery = `INSERT INTO suppliers (name, address, suppliercode, phone_number, email, create_date, user_id, isactive,
      usermachinename, usermachineip) VALUES ('${req.body.suppliername}', '${req.body.address}', '${req.body.suppliercode}','${req.body.phonenumber}', 
      '${req.body.email}', '${new Date(Date.now()).toISOString()}', '${userid}', '${req.body.isactive}','${userMachineName}','${userMachineIP}')`;


  try {

   await pool.query(createQuery, function (err, recordset) {

      if (err) {

        suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, suppliersRes);
      } else {
        if (recordset.rowsAffected > 0) {
          // send records as a response
          suppliersRes = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) added');
          resp.json(200, suppliersRes);
        } else {
          suppliersRes = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) added');
          resp.json(404, suppliersRes);
        }

      }
    });

  } catch (error) {
    suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
    resp.json(404, suppliersRes);
  }
}


//update supplier

async function updateSupplier(req, res, error) {
  var resp = new Response.Response(res);
  const id = req.query.id;
  const pool = await poolPromise;

  const values = [
    req.body.suppliername,
    req.body.address,
    req.body.suppliercode,
    req.body.phonenumber,
    req.body.email,
    normalizedDate = new Date(Date.now()).toISOString(),
    req.body.userid,
    req.body.isactive,
    userMachineName,
    userMachineIP
  ];


  const updateonequery = `UPDATE suppliers SET name='${req.body.suppliername}', address='${req.body.address}', 
  suppliercode='${req.body.suppliercode}', phone_number='${req.body.phonenumber}', email='${req.body.email}', isactive='${req.body.isactive}', 
      modified_date='${normalizedDate}', m_user_id='${userid}', userMachineName='${userMachineName}',
      usermachineip='${userMachineIP}' WHERE id = '${id}'`;

  try {

    await pool.query(updateonequery,function(err, recordset){

        if (err) {
            suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
            resp.json(404, suppliersRes);
        } else {
            if (recordset.rowsAffected > 0) {

                suppliersRes = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) updated');
                resp.json(200, suppliersRes);
          
              } else {
          
                suppliersRes = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) updated');
                    resp.json(404, suppliersRes);
              }
        }
    })
  }
  catch (error) {
    suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
    resp.json(404, suppliersRes);
  }
}
module.exports = {
  getSuppliers,
  getSupplierByID,
  createSupplier,
  updateSupplier
}  