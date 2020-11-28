var moment = require('moment');
const helper = require('../util/helper');
var dbConfig = require('../../../config');
const Response = require('../util/response');
const respBody = require('../util/response');
const {poolPromise}=require('../util/db');
const { Console } = require('winston/lib/winston/transports');
const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;

var itemBaseRes={};


async function getItemBaseUnits(req, res) {
  var resp = new Response.Response(res);

  const queryString = 'select * from itembaseunits'
  //const pool = await db.dbConnection()

  const pool = await poolPromise;
  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        itemBaseRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
        resp.json(404, itemBaseRes);
      } else {
        if (recordset.rowsAffected> 0) {
          // send records as a response
          itemBaseRes= respBody.ResponseBody('success',recordset.recordset,recordset.rowsAffected + ' record(s) found');
        resp.json(200, itemBaseRes);
        } else {
          itemBaseRes= respBody.ResponseBody('failed','',recordset.rowsAffected + ' record(s) found');
        resp.json(404, itemBaseRes);
        }

      }
    });

  } catch (error) {
    itemBaseRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
    resp.json(404, itemBaseRes);  }

}


async function getItemBaseUnitByID(req, res) {
  var resp = new Response.Response(res);
  const id = req.params.id;

  //const pool = await db.dbConnection()

  const pool = await poolPromise;

  const queryString = `select * FROM itembaseunits WHERE id=${id}`

  try {

    pool.query(queryString, function (err, recordset) {

        if (err) {
            itemBaseRes= respBody.ResponseBody('success','',recordset.rowsAffected + ' record(s) found');
            resp.json(404, itemBaseRes);

        } else {
            if (recordset.rowsAffected > 0) {
                // send records as a response
                itemBaseRes= respBody.ResponseBody('success',recordset.recordset,recordset.rowsAffected + ' record(s) found');
                resp.json(200, itemBaseRes);
              } else {
                itemBaseRes= respBody.ResponseBody('success','',recordset.rowsAffected + ' record(s) found');
                resp.json(404, itemBaseRes);
              }
        }
    });

  } catch (error) {
    itemBaseRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
    resp.json(404, itemBaseRes); 
   }
  }


//add item base unit
async function createItemBaseUnit(req, res) {
  var resp = new Response.Response(res);
  //const pool = await db.dbConnection()

  const pool = await poolPromise;

  const createQuery = `INSERT INTO itembaseunits(baseunit, isactive, create_user, usermachinename, usermachineip) 
  VALUES ('${req.body.baseunit}', '${req.body.isactive}', '${userid}', '${userMachineName}', '${userMachineIP}')`;


  try {

    //await pool.query('BEGIN')

    //for (var i = 0; i < req.body.length; i++) {

    const values = [
      req.body.baseunit,
      req.body.isactive,
      userid,
      userMachineName,
      userMachineIP
    ];

   var recordset =  await pool.query(createQuery)

    //}
    //await pool.query('COMMIT')
    itemBaseRes= respBody.ResponseBody('success','',recordset.rowsAffected + ' record(s) found');
    resp.json(200, itemBaseRes);


  } catch (error) {

    itemBaseRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
    resp.json(404, itemBaseRes); 
  }
}


//update item base unit
async function updateItemBaseUnit(req, res, error) {
  var resp = new Response.Response(res);
  const id = req.params.id;
//   const pool = await db.dbConnection();

  const pool = await poolPromise;

  const values = [
    req.body.baseunit,
    req.body.isactive,
    userid,
    userMachineName,
    userMachineIP,
    normalizedDate = new Date(Date.now()).toISOString()
  ];

  const updateonequery = `UPDATE itembaseunits SET baseunit='${req.body.baseunit}', isactive='${req.body.isactive}', modified_date='${normalizedDate}', 
  modifier_userid='${userid}', usermachinename='${userMachineName}', usermachineip='${userMachineIP}' WHERE id = '${id}'`

  try {

    const recordset = await pool.query(updateonequery)

    if (recordset.rowsAffected > 0) {

      itemBaseRes= respBody.ResponseBody('success','',recordset.rowsAffected + ' record(s) found');
      resp.json(200, itemBaseRes);

    } else {

      itemBaseRes= respBody.ResponseBody('success','',recordset.rowsAffected + ' record(s) found');
        resp.json(404, itemBaseRes);
    }


  } catch (error) {
      console.log(error)
    itemBaseRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
    resp.json(404, itemBaseRes);   }

}


module.exports = {
  getItemBaseUnits,
  getItemBaseUnitByID,
  createItemBaseUnit,
  updateItemBaseUnit,
}