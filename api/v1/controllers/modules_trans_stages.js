var moment = require('moment');
// const db = require('../util/db_worm');
const {poolPromise}=require('../util/db');
const helper = require('../util/helper');
var dbConfig = require('../../../config');
const Response = require('../util/response');
const respBody = require('../util/response');


const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;
var transResp={};


//GET modules 
async function getModules(req, res, error) {
  var resp = new Response.Response(res);

    const queryString = `select * from modules WHERE isactive = 'Yes'`
    const pool = await poolPromise;
  
    try {
  
      await pool.query(queryString, function(err, recordset){

        if (err) {
            transResp = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) found');
            resp.json(404, transResp);
            
        } else {
            if (recordset.rowsAffected > 0) {
                transResp = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                   resp.json(201, transResp);
          
              } else {
                transResp = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) found');
                resp.json(404, transResp);
              }
            
        }
      });
  
  
    } catch (error) {
      transResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(404, transResp);
    }
  
  }
  
  
  //GET module by ID
  async function getModuleByID(req, res, error) {
    var resp = new Response.Response(res);
    const moduleID = req.params.id;

    const pool = await poolPromise;
  
  
    const queryString = `select * FROM modules WHERE id='${moduleID}' and isactive = 'Yes'`
  
    try {
  
      pool.query(queryString, function (err, recordset) {
        if (err) {
            transResp = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) found');
              resp.json(404, transResp);
        } else {
            if (recordset.rowsAffected > 0) {
                // send records as a response
                transResp = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                 resp.json(201, transResp);
              } else {
                transResp = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) found');
              resp.json(404, transResp);
              }
        }
       
      });
  
    } catch (error) {
      transResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(404, transResp);
  
    }
  }
  
  
  //GET module transaction by module ID
//   async function getModuleTransactionsByModuleID(req, res, error) {
//     var resp = new Response.Response(res);
//     const moduleID = req.query.id;
//     const pool = await poolPromise;
  
  
//     const queryString = `select id, description FROM moduletransactions WHERE moduleid='${moduleID}' and isactive = 'Yes'`
  
//     try {
  
//       await pool.query(queryString, function(err, recordset){

//           if (err) {

//             transResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
//             resp.json(404, transResp);

//           } else {
//             if (recordset.rowsAffected > 0) {
  
//                 var transactionstages = []
//                 var stages ={}
          
//                 for (var i = 0; i < recordset.rowsAffected; i++) {
          
//                   var modTransID = recordset.rows[i].id
//                   var modTransDesc = recordset.rows[i].description
          
//                   stages = await getModuleTransStages(modTransID)
          
//                   var transaction ={
//                     id: modTransID,
//                     description: modTransDesc,
//                     stages: stages
//                   }
                  
//                   transactionstages.push(transaction)
                 
//                 }
//                 transResp = respBody.ResponseBody('success', transactionstages, recordset.rowsAffected + ' record(s) found');
//                    resp.json(201, transResp);
          
//               } else {
          
//                 transResp = respBody.ResponseBody('success', '', recordset.rowsAffected + ' record(s) found');
//                    resp.json(201, transResp);
//               }
//           }
//       });
  
//     } catch (error) {
//       transResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
//       resp.json(404, transResp);
  
//     }
//   }
  
  
//   //GET module transaction Stages by module Trans ID
  async function getTransactionStagesByModuleTransID(req, res, error) {
    var resp = new Response.Response(res);
    const moduleTransID = req.params.transid;
    const pool = await poolPromise;
  
  
    const queryString = `select * FROM transactionstages WHERE module_transaction_id='${moduleTransID}'`

    try {

      pool.query(queryString, function (err, recordset) {

          if (err) {

              transResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
              resp.json(404, transResp);

          } else {
              if (recordset.rowsAffected > 0) {
                  // send records as a response
                  transResp = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                  resp.json(200, transResp);
              } else {
                  transResp = respBody.ResponseBody('success', '', 'No record found');
                  resp.json(404, transResp);
              }

          }
      });

  } catch (error) {
      transResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(404, transResp);
  }
  
  //   try {
  
  //   var recordset = await pool.query(queryString);

  //   if (recordset.rowsAffected > 0) {
    
  //     transResp =respBody.ResponseBody('success',recordset.recordset,'transaction stages found');
  //     resp.json(200, transResp);

  //   } else {

  //     //return res.status(404).json({ 'message': 'failed' })
  //     transResp =respBody.ResponseBody('success',recordset.rows,recordset.rowsAffected + ' record(s) found');
  //     resp.json(404, transResp);
  //   }


  // } catch (error) {
  //   //return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
  //   transResp = respBody.ResponseBody('failed',recordset.rows,'failed with error: '+ helper.parseError(error, queryString));
  //   resp.json(400, transResp);
  // }

  }
  
  //   //GET module transaction by module ID
  async function getModuleTransactionsByModuleID(req, res, error) {
    var resp = new Response.Response(res);
    const moduleID = req.params.moduleid;
    const pool = await poolPromise;
  
  
    const queryString = `select id, description FROM moduletransactions WHERE moduleid='${moduleID}' and isactive = 'Yes'`
  
    try {
  
      const modTrans = await pool.query(queryString)
  
      if (modTrans.rowsAffected > 0) {
  
        var transactionstages = []
        var stages ={}
  
        for (var i = 0; i < modTrans.rowsAffected; i++) {
  
          var modTransID = modTrans.recordset[i].id
          var modTransDesc = modTrans.recordset[i].description
  
          stages = await getModuleTransStages(modTransID)
  
          var transaction ={
            id: modTransID,
            description: modTransDesc,
            stages: stages
          }
          
          transactionstages.push(transaction)
         
        }
        transResp = respBody.ResponseBody('success', transactionstages, modTrans.rowCount + ' record(s) found');
           resp.json(201, transResp);
  
      } else {
  
        transResp = respBody.ResponseBody('success', '', modTrans.rowCount + ' record(s) found');
           resp.json(201, transResp);
      }
  
  
    } catch (error) {
      transResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(404, transResp);
  
    }
  }

  //Function to return transaction stages by nodtransid
  async function getModuleTransStages(modtransID) {
  
    const queryString = `select id, description, code, url, iconid, module_transaction_id from transactionstages WHERE module_transaction_id='${modtransID}' and isactive ='Yes'`
  
    const pool = await poolPromise;
  
    try {
  
      const recordset = await pool.query(queryString)
  
      if (recordset.rowCount > 0) {
        // send records as a response
        return recordset.rows
  
      } 
  
    } catch (error) {
      return helper.parseError(error, queryString)
    }
  
  }

  //Funtion to update stage id and transaction status of a transaction
async function updateTransStageStatus(transID, transStage, statusID){

  var tableName;
  
  const upadStageStausIDQuery = `UPDATE '${tableName}' set stageid='${transStage}', statusid='${statusID}' WHERE id='${transID}' and isactive ='Yes'`
  
  const pool = await poolPromise;
  
    try {
  
      const recordset = await pool.query(queryString)
  
      if (recordset.rowCount > 0) {
        // send records as a response
        return recordset.rows
  
      } 
  
    } catch (error) {
      return helper.parseError(error, queryString)
    }
  
}

  module.exports={
    getModuleTransactionsByModuleID,
    getModules,
    getModuleByID,
    getTransactionStagesByModuleTransID
  }