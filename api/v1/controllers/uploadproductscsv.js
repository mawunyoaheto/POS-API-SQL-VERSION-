var moment = require('moment');
const { poolPromise } = require('../util/db');
const helper = require('../util/helper');
var respBody = require('../util/response');
var dbConfig = require('../../../config');
const Response = require('../util/response');
const sql = require('mssql');
const csvToJson = require('csvtojson');
const fs = require("fs");
const fastcsv = require("fast-csv");
const uploadFile = require('../util/upload');

const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;
var productsRes = {};

const upload = async (req, res, done) => {

  const pool = await poolPromise;
  var resp = new Response.Response(res);
  const transaction = new sql.Transaction(pool);

  try {

    await uploadFile.uploadFileMiddleware(req, res);

    if (req.file == undefined) {

      productsRes = respBody.ResponseBody('failed', 'Please upload a CSV file!', '');
      resp.json(400, productsRes);
    }

    console.log("Uploaded the file successfully: " + req.file.originalname)
    let path = __basedir + "/resources/static/assets/uploads/" + req.file.originalname;

    var csvData = [];
    var stream = fs.createReadStream(path);

    var csvStream = fastcsv
      //.parse()
      .parseStream(stream, { headers: true })
      .on("data", function (data) {
        csvData.push(data);
      })
      .on("end", function () {

        // remove the first line: header
        csvData.shift();
        fs.unlinkSync(path);

        try {

          
      const readCSV = await csvToJson({
        trim:true
    }).fromFile(path);

    // Code executes after recipients are fully loaded.
    readCSV.forEach((readCSV) => {
      csvData.push(readCSV);

    });

          await transaction.begin();
          const trnxReq = new sql.Request(transaction);

          for (i = 2; i < csvData.length; i++) {

            console.log(csvData[i]['description'],csvData[i]['cost_price']);

            const createProductQuery = `INSERT INTO products(description, extended_description, product_code, cost_price, s_price, category_id,baseunit_id, 
              create_userid, usermachinename, usermachineip)
              VALUES ('${csvData[i]['description']}','${csvData[i]['description']}', '${csvData[i]['product_code']}', '${req.body.cost_price}', '${csvData[i]['s_price']}', 
                '${csvData[i]['category']}', '${csvData[i]['baseunit']}', '${userid}', '${userMachineName}', '${userMachineIP}')`;
            
                await trnxReq.query(createProductQuery);
          }
          productsRes = respBody.ResponseBody('success', '', "inserted " + res.rowCount + " row:");
          resp.json(201, productsRes);
          
        
        }
        catch (err) {
          console.log(err.stack);
          fs.unlinkSync(path);
          productsRes = respBody.ResponseBody('failed', err.stack, '');
          resp.json(400, productsRes);
        }
        finally {

          done();
        }
      });
    stream.pipe(csvStream);
  } catch (err) {

    productsRes = respBody.ResponseBody('failed', 'Could not upload the file:', 'failed with error: ' + err);
    resp.json(500, productsRes);
  }
};
function validateCsvData(rows) {
  const dataRows = rows.slice(1, rows.length); //ignore header at 0 and get rest of the rows
  for (let i = 0; i < dataRows.length; i++) {
    const rowError = validateCsvRow(dataRows[i]);
    if (rowError) {
      return `${rowError} on row ${i + 1}`
    }
  }
  return;
}

function validateCsvRow(row) {
  if (!row[0]) {
    return "invalid name"
  }
  else if (!Number.isInteger(Number(row[1]))) {
    return "invalid roll number"
  }
  else if (!moment(row[2], "YYYY-MM-DD").isValid()) {
    return "invalid date of birth"
  }
  return;
}


    //   const readCSV = await csvToJson({
    //     trim:true
    // }).fromFile(path);

    // // Code executes after recipients are fully loaded.
    // readCSV.forEach((readCSV) => {
    //   csvData.push(readCSV);

    // });
module.exports = {
  upload
}
