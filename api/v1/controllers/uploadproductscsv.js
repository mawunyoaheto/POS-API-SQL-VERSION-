var moment = require('moment');
const { poolPromise } = require('../util/db');
const helper = require('../util/helper');
var respBody = require('../util/response');
var dbConfig = require('../../../config');
const Response = require('../util/response');
const fs = require("fs");
const fastcsv = require("fast-csv");
const uploadFile = require('../util/upload');

const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;
var productsRes = {};

const upload = async (req, res, done) => {
    var resp = new Response.Response(res);
    const pool = await poolPromise;
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
            .parse()
            .on("data", function (data) {
                csvData.push(data);
                // console.log('Data-read',csvData);
            })
            .on("end", function () {
                // remove the first line: header
                csvData.shift();
                fs.unlinkSync(path);
                console.log(csvData.shift())

                //var queryString = `INSERT INTO sales (region, country, itemtype, channel, priority, orderdate, orderid, shipdate, unitsold, unitprice, unitcost, totalrevenue, totalcost, totalprofit) VALUES ?`;
                var queryString = `INSERT INTO sales (region, country, itemtype) VALUES ('ocean','Ghana','H')`;

                try {
                    csvData.forEach(row => {
                      //  console.log(row.)
                        pool.query(queryString, (err, res) => {
                            if (err) {

                                console.log(err.stack);
                                fs.unlinkSync(path);
                                productsRes = respBody.ResponseBody('failed', err.stack, '');
                                resp.json(400, productsRes);

                            } else {
                                console.log("inserted " + res.rowCount + " row:", row);

                                // productsRes = respBody.ResponseBody('success', '', "inserted " + res.rowCount + " row:");
                                // resp.json(201, productsRes);
                            }
                        });
                    });
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

        productsRes = respBody.ResponseBody('failed', 'Could not upload the file:', 'failed with error: ' +err);
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
module.exports = {
    upload
}
