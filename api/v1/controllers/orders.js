var moment = require('moment');
const helper = require('../util/helper');
const Response = require('../util/response');
const respBody = require('../util/response');
var dbConfig = require('../../../config');
var productsController = require('../controllers/products')

const sql = require('mssql');

const { poolPromise } = require('../util/db');
const { Console } = require('winston/lib/winston/transports');
const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;

var ordersRes = {};

async function getOrderStatus(req, res) {

    const queryString = 'select * from orderstatus'
    var resp = new Response.Response(res);
    const pool = await poolPromise;

    const hostname = await helper.getHosnameIP(req)

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {
                ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, ordersRes);
            } else {
                if (recordset.rowsAffected > 0) {

                    // send records as a response
                    ordersRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, ordersRes);

                } else {
                    ordersRes = respBody.ResponseBody('success', '', 'No record(s) found');
                    resp.json(404, ordersRes);
                }
            }
        });

    } catch (error) {
        ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, ordersRes);

    }

}


async function getOrderStatusByID(req, res) {

    const id = req.query.id
    const queryString = `select * FROM orderstatus WHERE id='${id}'`
    var resp = new Response.Response(res);
    const pool = await poolPromise;

    try {

        pool.query(queryString, function (err, recordset) {

            if (err) {

                ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
                resp.json(404, ordersRes);

            } else {
                if (recordset.rowsAffected > 0) {
                    ordersRes = respBody.ResponseBody('success', recordset.recordset, recordset.rowsAffected + ' record(s) found');
                    resp.json(200, ordersRes);
                } else {
                    ordersRes = respBody.ResponseBody('failed', '', 'record(s) not found');
                    resp.json(404, ordersRes);
                }
            }
        });

    } catch (error) {
        ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, ordersRes);

    }

}

//GET ORDER SUMMARY
async function getOrdersSummaryByInvoiceNo(req, res, error) {
    var resp = new Response.Response(res);
    var orders = {}
    //const invoiceNo = req.body.invoiceNo
    const invoiceNo = req.params.invoiceNo
    const queryString = `SELECT * from orders WHERE archived = 'No' and invoiceno= '${invoiceNo}'`
    const pool = await poolPromise;

    try {

        const recordset = await pool.query(queryString)

        // if (err) {
        //     ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
        //     resp.json(404, ordersRes);
        // } else {
        if (recordset.rowsAffected > 0) {

            orders.summary = recordset.recordset[0]
            orders.summary.details = await getOrderDetails(recordset.recordset[0].id)
            // send records as a response
            ordersRes = respBody.ResponseBody('success', orders, recordset.rowsAffected + ' record(s) found');
            resp.json(200, ordersRes);

        } else {
            ordersRes = respBody.ResponseBody('success', '', 'No record(s) found');
            resp.json(404, ordersRes);
        }
        //}


    } catch (error) {
        ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, ordersRes);

    }
}

//CREATE PURCHASE ORDER
async function createOrder(req, res, err) {
    var resp = new Response.Response(res);

    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    //var totalValue = helper.sumOfArrayWithParameter(req.body.orderdetails, 'unitCost');
    var totalValue = 0

    for (var i = 0; i < req.body.orderdetails.length; ++i) {

        totalValue += (req.body.orderdetails[i].qty * req.body.orderdetails[i].unitCost);

    }

    normalizedDate = new Date(req.body.orderDate).toISOString();

    const createOrderQuery = `INSERT INTO orders(invoiceno, awardno, linestotal, totalvalue, supplierid, discount, vatid, orderterms, 
    ordercomments, outletid, createuserid, stageid, statusid, order_date, usermachinename, usermachineip)
    VALUES ('${req.body.invoiceNum}', '${req.body.awardNo}', '${req.body.orderdetails.length}', '${totalValue}', '${req.body.supplierID}',
    '${req.body.discount}', '${req.body.vatID}', '${req.body.orderTerms}', '${req.body.orderComments}', '${req.body.outletID}', '${userid}',
    '${req.body.stageID}', '${req.body.statusID}', '${normalizedDate}', '${userMachineName}', '${userMachineIP}'); SELECT SCOPE_IDENTITY() AS id;`



    //console.log(totalValue)



    try {



        // await pool.query('BEGIN')
        await transaction.begin();
        const trnxReq = new sql.Request(transaction);

        const records = await trnxReq.query(createOrderQuery)

        orderID = records.recordset[0].id

        for (var i = 0; i < req.body.orderdetails.length; ++i) {

            //var lineTotalCost = (req.body.orderdetails[i].qty * req.body.orderdetails[i].unitCost);
            var lineTotalCost = helper.totalLineCost(req.body.orderdetails[i].qty, req.body.orderdetails[i].unitCost);

            const createOrderLinesQuery = `INSERT INTO orderlines(orderid, itemid, itemunitid, quantity, unitcost,linetotalcost, stocklevel, 
                reorderlevel, remark, approvallevelid, approvalstatusid, stageid, statusid, createtime)
                VALUES ('${orderID}', '${req.body.orderdetails[i].itemID}', '${req.body.orderdetails[i].itemUnitID}', 
                '${req.body.orderdetails[i].qty}', '${req.body.orderdetails[i].unitCost}','${lineTotalCost}','${req.body.orderdetails[i].stockLevel}',
                '${req.body.orderdetails[i].reOrderLevel}', '${req.body.orderdetails[i].remark}', '${req.body.orderdetails[i].approvaLevelID}',
                '${req.body.orderdetails[i].approvaSatusID}', '${req.body.orderdetails[i].stageID}', '${req.body.orderdetails[i].statusID}', 
                '${normalizedDate}')`;

            recordset = await trnxReq.query(createOrderLinesQuery)

        }

        await transaction.commit();

        ordersRes = respBody.ResponseBody('success', '', req.body.orderdetails.length + ' order Line(s) created ');
        resp.json(200, ordersRes);

    }
    catch (error) {
        await transaction.rollback();

        ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, ordersRes);

    }
}

async function createOrderReceival(req, res) {

    var resp = new Response.Response(res);

    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    const receiveQuery = `INSERT INTO orderreceivals(orderid, receiveddate, waybillnumber, sranumber, costtouppercentage, 
    receivalnumber, remark, outletid, createuserid, usermachinename, usermachineip)
    VALUES ('${req.body.orderID}', '${req.body.receivedDate}', '${req.body.wayBillNo}', '${req.body.sraNo}', '${req.body.costPercent}',
     '${req.body.receivalNo}','${req.body.remark}', '${req.body.outletID}', '${userid}', '${userMachineName}', '${userMachineIP}'); 
     SELECT SCOPE_IDENTITY() AS id;`;


    try {

        await transaction.begin();
        const trnxReq = new sql.Request(transaction);

        const records = await trnxReq.query(receiveQuery)

        const receivalID = records.recordset[0].id

        for (var i = 0; i < req.body.details.length; i++) {


            const orderReceivalLinesQuery = `INSERT INTO orderreceivallines(purchaseorderlineid, receivalid, itemid, unitcost, receivedqty,
                receivedunitid, batchnumber, expirydate, outletid, createtime, createuserid, usermachinename, usermachineip)
                VALUES ('${req.body.details[i].orderlineid}', '${receivalID}', '${req.body.details[i].itemid}', '${req.body.details[i].unitcost}', 
                '${req.body.details[i].qty}', '${req.body.details[i].unitid}', '${req.body.details[i].batchno}', '${req.body.details[i].expirydate}', '${req.body.details[i].outletID}',
                '${req.body.receivedDate}', '${userid}', '${userMachineName}', '${userMachineIP}')`;

                const updateStatusQuery = `UPDATE orderapprovallines SET stageid = 12 WHERE purchaseorderlineid='${req.body.details[i].orderlineid}' and stageid =11 AND archived='No' `;

            //get product details from here by calling funtion getProductDetails(itemid, outletid) 
            var prodDetails = await getProductDetails(req.body.details[i].itemid, req.body.details[i].outletID);

            const productStockQuery = `INSERT INTO productstock(productid,stocklevel,batchnumber,expirydate,qty,unitcost,baseitemid,outletid,stageid,
            statusid,transactionid,reorderlevel,eoq,averageconsumption,leadtime,minstocklevel,maxstocklevel,usermachinename,usermachineip,createtime,createuserid)
           VALUES('${req.body.details[i].itemid}','${prodDetails.totalStock}','${req.body.details[i].batchno}','${req.body.details[i].expirydate}','${req.body.details[i].qty}',
           '${req.body.details[i].unitcost}','${req.body.details[i].unitid}','${req.body.details[i].outletID}','12','2','12','0','0','0','0','0','0','${userMachineName}','${userMachineIP}',
          '${req.body.receivedDate}','${userid}')`;


            await trnxReq.query(orderReceivalLinesQuery);
            
            await trnxReq.query(updateStatusQuery);  

            await trnxReq.query(productStockQuery);

        }

        await transaction.commit();

        ordersRes = respBody.ResponseBody('success', '', req.body.details.length + ' order Line(s) created ');
        resp.json(200, ordersRes);

    } catch (error) {
        await transaction.rollback();

        ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, ordersRes);

    }

}

//APPROVE PURCHASE ORDER
async function approveOrder(req, res) {

    var resp = new Response.Response(res);
    normalizedDate = new Date(Date.now()).toISOString();

    console.log('date', normalizedDate);
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    const approveOrderQuery = `INSERT INTO orderapprovals(purchaseorderid, approverid, approvalnumber, outletid, remark, 
    approvallevelid, createtime, createuserid, usermachinename, usermachineip)
    VALUES ('${req.body.purchaseOrderID}', '${userid}', '${req.body.approvalNo}', '${req.body.outletID}',
     '${req.body.remark}', '${req.body.approvalLevelId}', '${normalizedDate}', '${userid}',
      '${userMachineName}', '${userMachineIP}'); SELECT SCOPE_IDENTITY() AS id;`;



    try {


        var totalValue = 0

        for (var i = 0; i < req.body.approvaldetails.length; ++i) {

            totalValue += (req.body.approvaldetails[i].approvedtQty * req.body.approvaldetails[i].unitCost);

        }

        await transaction.begin();
        const trnxReq = new sql.Request(transaction);

        const records = await trnxReq.query(approveOrderQuery)

        const orderApprovalSummaryID = records.recordset[0].id

        for (var i = 0; i < req.body.approvaldetails.length; ++i) {


            var validateQty = await checkOrderQuantity(11, req.body.approvaldetails[i].productID, req.body.approvaldetails[i].purchaseOrderLineID, req.body.approvaldetails[i].approvedtQty)

            if (validateQty) {
                //get description of affected product
                var affectedProduct = await productsController.getProductDescriptionByID(req.body.approvaldetails[i].productID);

                i = req.body.approvaldetails.length;



            } else {


                const approvalLinesQuery = `INSERT INTO orderapprovallines(purchaseorderlineid, productid, unitcost, approvedqty, linetotalcost,
                productunitid, reorderlevel, stocklevel,remarks, outletid, baseitemid, createtime,stageid,statusid, approvalid, createuserid,
                usermachinename, usermachineip) VALUES ('${req.body.approvaldetails[i].purchaseOrderLineID}', '${req.body.approvaldetails[i].productID}', 
                '${req.body.approvaldetails[i].unitCost}','${req.body.approvaldetails[i].approvedtQty}','${req.body.approvaldetails[i].approvedLineTotalCost}', '${req.body.approvaldetails[i].productUnitID}',
                '${req.body.approvaldetails[i].reOrderLevel}', '${req.body.approvaldetails[i].stockLevel}', '${req.body.approvaldetails[i].remarks}',
                '${req.body.approvaldetails[i].outletID}','${req.body.approvaldetails[i].baseItemID}','${normalizedDate}','11','3', '${orderApprovalSummaryID}', 
                '${userid}','${userMachineName}', '${userMachineIP}')`;

                const updateStageStausIDQuery = `UPDATE orderlines set stageid=11, statusid=3, approvedqty='${req.body.approvaldetails[i].approvedtQty}' 
            WHERE orderlineid='${req.body.approvaldetails[i].purchaseOrderLineID}' AND itemid ='${req.body.approvaldetails[i].productID}'  AND archived ='No'`

                await trnxReq.query(approvalLinesQuery);
                await trnxReq.query(updateStageStausIDQuery);
            }

        }
        if (validateQty) {
            await transaction.rollback();
            ordersRes = respBody.ResponseBody('failed', 'Approval Quantity of ' + affectedProduct + ' cannot be greater than requested quantity', 'failed with error: Quantity greater than requested quantity');
            resp.json(404, ordersRes);

        } else {
            await transaction.commit();

            ordersRes = respBody.ResponseBody('success', '', req.body.approvaldetails.length + ' order Line(s) created ');
            resp.json(200, ordersRes);
        }



    }
    catch (error) {
        await transaction.rollback();

        ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, ordersRes);

    }
}

//GET ORDERS PENDING APPROVAL
async function getOrderPendingApprovalSummary(req, res) {
    var resp = new Response.Response(res);

    const queryString = `SELECT * FROM orders WHERE archived = 'No' and stageid= 10 AND statusid =1 OR statusid=2`;

    const pool = await poolPromise;

    try {

        recordset = await pool.query(queryString)

        if (recordset.rowsAffected > 0) {

            // var orderSummary ={}
            var pendingOrders = []
            var details = []

            for (var i = 0; i < recordset.rowsAffected; i++) {

                var orderID = recordset.recordset[i].id
                orderSummary = recordset.recordset[i]

                var details = await getPendingOrderApprovalDetails(orderID)

                //console.log('details', details)
                if (details.length > 0) {

                    var ordertransaction = {
                        summary: orderSummary,
                        details: details
                    }

                    //var testVar= ordertransaction;

                   // console.log('test',testVar.summary)
                    pendingOrders.push(ordertransaction)
                } else {
                    //do nothing
                }

                //pendingOrders.push(orderSummary)

            }

            // return res.status(200).json(pendingOrders)

            ordersRes = respBody.ResponseBody('success', pendingOrders, recordset.rowsAffected + ' record(s) found');
            resp.json(200, ordersRes);

        } else {

            ordersRes = respBody.ResponseBody('failed', '', 'No record(s) found');
            resp.json(404, ordersRes);
        }

    } catch (error) {

        ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, ordersRes);
    }

}

//GET ORDERS BY STAGE AND STATUS
async function getOrderByStageStatus(req, res) {
    var resp = new Response.Response(res);
    var supplierID = req.query.supplierID
    var invoiceNo = req.params.invoiceNo
    var statusID = req.query.statusid;
    var stageID = req.query.stageid



    const queryString = `SELECT * FROM orders WHERE stageid= '${stageID}' AND statusid ='${statusID}' AND archived = 'No'
    AND supplierid ='${supplierID}' OR invoiceno = '${invoiceNo}' `;

    const pool = await poolPromise;

    try {

        recordset = await pool.query(queryString)

        if (recordset.rowsAffected > 0) {

            // var orderSummary ={}
            var pendingOrders = []
            var details = []

            for (var i = 0; i < recordset.rowsAffected; i++) {

                var orderID = recordset.recordset[i].id
                orderSummary = recordset.recordset[i]

                details = await getOrderDetailsByStageStatus(orderID, stageID, statusID)

                //console.log('details', details)
                var ordertransaction = {
                    summary: orderSummary,
                    details: details
                }
                pendingOrders.push(ordertransaction)
                //pendingOrders.push(orderSummary)

            }

            // return res.status(200).json(pendingOrders)

            ordersRes = respBody.ResponseBody('success', pendingOrders, recordset.rowsAffected + ' record(s) found');
            resp.json(200, ordersRes);

        } else {

            ordersRes = respBody.ResponseBody('failed', '', 'No record(s) found');
            resp.json(404, ordersRes);
        }

    } catch (error) {

        ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, ordersRes);
    }

}

//GET ORDERS PENDING APPROVAL BY INVOICE NO
async function getPendingOrdersSummaryByInvoice(req, res, error) {
    var resp = new Response.Response(res);

    const invoiceNo = req.query.invoiceNo
    const supplierID = req.query.supplierID

    const queryString = `SELECT * FROM orders WHERE archived = 'No' AND invoiceno= '${invoiceNo}' OR supplierid ='${supplierID}' AND stageid= 10`

    const pool = await poolPromise;

    try {

        const recordset = await pool.query(queryString)

        if (recordset.rowsAffected > 0) {

            // var orderSummary ={}
            var pendingOrders = []
            var details = []

            for (var i = 0; i < recordset.rowsAffected; i++) {

                var orderID = recordset.recordset[i].id
                orderSummary = recordset.recordset[i]

                orderSummary.details = await getPendingOrderApprovalDetails(orderID)

                //console.log('details', details)
                var ordertransaction = {
                    summary: orderSummary
                }
                pendingOrders.push(ordertransaction)
                //pendingOrders.push(orderSummary)
            }

            ordersRes = respBody.ResponseBody('success', pendingOrders, recordset.rowsAffected + ' record(s) found');
            resp.json(200, ordersRes);

        } else {

            ordersRes = respBody.ResponseBody('failed', '', 'No record(s) found');
            resp.json(404, ordersRes);
        }

    } catch (error) {

        ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, ordersRes);

    }

}


//GET ORDERS PENDING RECEIVAL BY STATUS 
async function getOrderPendingReceivalByStageStatus(req, res) {
    var resp = new Response.Response(res);
    var supplierID = req.query.supplierID
    var invoiceNo = req.params.invoiceNo
    var statusID = req.query.statusid;
    var stageID = req.query.stageid


    const queryString = `SELECT * FROM approvallines WHERE stageid= '${stageID}' AND statusid ='${statusID}' AND archived = 'No'
    AND supplierid ='${supplierID}' OR invoiceno = '${invoiceNo}'`;

    const pool = await poolPromise;

    try {

        recordset = await pool.query(queryString)

        if (recordset.rowsAffected > 0) {

            // var orderSummary ={}
            var pendingOrders = []
            var details = []

            for (var i = 0; i < recordset.rowsAffected; i++) {

                var orderID = recordset.recordset[i].id
                orderSummary = recordset.recordset[i]

                orderSummary.details = await getOrderDetailsByStageStatus(orderID, stageID, statusID)

                //console.log('details', details)
                var ordertransaction = {
                    summary: orderSummary
                }
                pendingOrders.push(ordertransaction)
                //pendingOrders.push(orderSummary)

            }

            // return res.status(200).json(pendingOrders)

            ordersRes = respBody.ResponseBody('success', pendingOrders, recordset.rowsAffected + ' record(s) found');
            resp.json(200, ordersRes);

        } else {

            ordersRes = respBody.ResponseBody('failed', '', 'No record(s) found');
            resp.json(404, ordersRes);
        }

    } catch (error) {

        ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, ordersRes);
    }

}

//GET ALL ORDERS PENDING RECEIVAL
async function getOrdersPendingReceival(req, res) {
    var resp = new Response.Response(res);

    //const queryString = `SELECT * FROM ordersapproval WHERE archived = 'No' and stageid= 10 AND statusid =1 OR statusid=2`;   
    const queryString = `SELECT DISTINCT approvalid FROM orderapprovallines  WHERE archived = 'No' and stageid= 11 AND statusid =1 OR statusid=2`;

    const pool = await poolPromise;

    try {

        recordset = await pool.query(queryString)

        if (recordset.length > 0 ||recordset.rowsAffected > 0)  {

            // var orderSummary ={}
            var pendingApprovedOrders = []
            var approvedOrderDetails = []

            for (var i = 0; i < recordset.rowsAffected; i++) {

                var id = recordset.recordset[i].approvalid;
                //orderSummary = recordset.recordset[i];


                var pendingReceivalSummary = await getOrdersReceivalSummary(id);

                var pendingReceivalDetails = await getPendingOrdersReceivalDetails(id);


                //console.log('details', details)
                //if (details.length>0) {

                var ordertransaction = {
                    summary: pendingReceivalSummary,
                    details: pendingReceivalDetails
                }
                pendingApprovedOrders.push(ordertransaction)
                // } else {
                //do nothing
                //}

                //pendingOrders.push(orderSummary)

            }

            // return res.status(200).json(pendingOrders)

            ordersRes = respBody.ResponseBody('success', pendingApprovedOrders, recordset.rowsAffected + ' record(s) found');
            resp.json(200, ordersRes);

        } else {

            ordersRes = respBody.ResponseBody('failed', '', 'Sorry No Pending orders(s) for receival');
            resp.json(404, ordersRes);
        }

    } catch (error) {

        ordersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, ordersRes);
    }

}

//function to check order approval quantity
async function checkOrderQuantity(transid, itemid, orderlineid, qty) {
    const pool = await poolPromise;
    var recordset;
    switch (transid) {
        case 11:
            recordset = await pool.query(`SELECT quantity FROM orderlines where itemid='${itemid}' AND orderlineid = '${orderlineid}' AND archived ='No'`)

            if (qty > recordset.recordset[0].quantity) {

                return true;
            } else {
                return false;
            }
            break;

        default:

    }



}
async function getOrderDetails(orderID) {

    const queryString = `select * from orderlines WHERE orderid='${orderID}'`
    const pool = await poolPromise;

    try {

        const recordset = await pool.query(queryString, function (err, recordset) {
            if (err) {

                return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))

            } else {
                if (recordset.rowsAffected > 0) {
                    // send records as a response
                    return recordset.recordset

                } else {
                    return res.status(404).json({ 'message': 'failed' })
                }
            }
        })

    } catch (error) {
        return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
    }

}

async function getOrdersReceivalSummary(id) {

    const queryString = `select * from orderapprovals WHERE id='${id}'`
    const pool = await poolPromise;

    try {

        const recordset = await pool.query(queryString)


        if (recordset.rowsAffected > 0) {
            // send records as a response
            var summary = recordset.recordset[0];
            console.log('sum', summary);
            return summary

        } else {
            return res.status(404).json({ 'message': 'failed' })
        }

    } catch (error) {
        return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
    }

}

async function getProductDetails(productID, outletID) {



    const productStockQuery = `select sum(qty) AS totalStock from productstock WHERE id='${productID}' AND outletid='${outletID}'`
    const productDescriptionQuery = `select * from products WHERE id='${productID}'`
    const pool = await poolPromise;

    var productstock =0;
    try {
        const productDesRecordset = await pool.query(productDescriptionQuery)
        const productStockrecordset = await pool.query(productStockQuery);
        

        if (productStockrecordset.length >0) {

            productstock=productStockrecordset[0].totalStock;
            
        } else {
            
            productstock=0;
        }

        var productDetails = {
            description: productDesRecordset.recordset[0].description,
            extDescription: productDesRecordset.recordset[0].extended_description,
            costPrice: productDesRecordset.recordset[0].cost_price,
            sellingPrice: productDesRecordset.recordset[0].s_price,
            totalStock: productstock
        }

        return productDetails

    } catch (error) {
        return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
    }

}

async function getOrderDetailsByStageStatus(orderID, stageID, statusID) {

    const queryString = `select * from orderlines WHERE orderid='${orderID}' AND stageid ='${stageID}'
     AND statusid = '${statusID}' AND archived ='No'`;

    const pool = await poolPromise;

    try {

        const recordset = await pool.query(queryString)

        if (recordset.rowsAffected > 0) {

            return recordset.recordset;

        } else {
            return ({ 'message': 'failed' })
        }

    } catch (error) {
        return helper.parseError(error, queryString);
    }

}

async function getPendingOrderApprovalDetails(orderID) {

    const queryString = `select * from orderlines WHERE orderid='${orderID}' and stageid =10 `;
    const pool = await poolPromise;

    try {

        const recordset = await pool.query(queryString)

        // if (err) {
        //     return res.status(404).json({ 'message': 'failed' });

        // } else {
        if (recordset.rowsAffected > 0) {
            // send records as a response

            // console.log(orderID,recordset.recordset)
            return recordset.recordset;


        } else {
            return recordset.recordset;
        }

        // }
        // });


    } catch (error) {
        return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
    }

}
async function getPendingOrdersReceivalDetails(approvalID) {

    const queryString = `select * from orderapprovallines WHERE approvalid='${approvalID}' and stageid =11 AND archived='No' `;
    const pool = await poolPromise;

    try {

        const recordset = await pool.query(queryString)

        // if (err) {
        //     return res.status(404).json({ 'message': 'failed' });

        // } else {
        if (recordset.rowsAffected > 0) {
            // send records as a response

            // console.log(orderID,recordset.recordset)
            return recordset.recordset;


        } else {
            return recordset.recordset;
        }

        // }
        // });


    } catch (error) {
        return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
    }

}

async function updateOrderStatus(transid,lineid) {


    
    const pool = await poolPromise;

    switch (transid,lineid) {

        //
        case 12:
            const updateStatusQuery = `UPDATE orderapprovallines SET stageid = 12 WHERE approvalineid='${lineid}' and stageid =11 AND archived='No' `;
            break;
    
        default:
            break;
    }

    try {

        const recordset = await pool.query(updateStatusQuery)

        if (recordset.rowsAffected > 0) {

            return true

        } else {
            return false;
        }

        // }
        // });


    } catch (error) {
        return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
    }

}
module.exports = {
    getOrderStatus,
    getOrderStatusByID,
    createOrder,
    createOrderReceival,
    getOrdersSummaryByInvoiceNo,
    approveOrder,
    getOrderPendingApprovalSummary,
    getOrderByStageStatus,
    getPendingOrdersSummaryByInvoice,
    getOrdersPendingReceival,
    getProductDetails
}


