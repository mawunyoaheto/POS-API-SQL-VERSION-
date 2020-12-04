var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth')
const ordersController = require('../controllers/orders');
const auth = require('../middleware/auth');



/**
* @swagger
* tags:
*   name: Purchase Orders
*   description: Purchases
*/

//order status routes

// router.get('/orderstatus',ordersController.getOrderStatus);
// router.get('/orderstatus/:id',ordersController.getOrderStatusByID);
// router.post('/payment-mode',operationsController.createPaymentMode);
// router.put('/payment-mode/:id',operationsController.updatePaymentMode);


//orders routes
/**
 * @swagger
 * /orders/all:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all Purchase Orders
 *    tags: [Purchase Orders]
 *    description: Get all Purchase Orders
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/all',authToken.authenticateToken,ordersController.getOrderPendingApprovalSummary);

/**
 * @swagger
 * /orders/ip:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get IP Address
 *    tags: [Purchase Orders]
 *    description: Get IP Address
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/ip', function (req, res){     
   // console.log("REQ:: "+req.headers.host);  
    // console.log (req.headers['x-forwarded-for'] || req.connection.remoteAddress);   
    // res.end(req.headers.host); 

    require('dns').reverse(req.connection.remoteAddress, function(err, domains) {
        console.log(domains);
    });
});


router.get('/product', auth.authenticateToken,function(req,res){
    

    var respn = ordersController.getProductDetails(req.query.productid, req.query.outletid);
    // return respn;
    return res.status(404).json({ 'message': 'failed' })
});

// /**
//  * @swagger
//  * path:
//  *   /productdetails/
//  *     get:
//  *       security:
//  *         - bearerAuth: []
//  *       summary: Returns Product details by product id
//  *       tags: [Products]
//  *       parameters:
//  *         - in: query
//  *           name: productid
//  *           required: false
//  *           description: id of product details to return
//  *           schema:
//  *             type: string
//  *         - in: query
//  *           name: outletid
//  *           required: false
//  *           description: id of product's outlet
//  *           schema:
//  *             type: integer
//  *       responses:
//  *         '200':
//  *           description: OK
//  *           content:
//  *             application/json:
//  *               schema:
//  *                 type: object
//  *         '400':
//  *           description: The specified product id is invalid (not a number).
//  *         '404':
//  *           description: The specified outletid was not found.
//  *         default:
//  *           description: Unexpected error
//  */
// router.get('/productdetails',authToken.authenticateToken,ordersController.getProductDetails(req.query.productid, req.query.outletid));

/**
 * @swagger
 * path:
 *   /orders/{invoiceNo}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns orders by invoiceNo
 *       tags: [Purchase Orders]
 *       parameters:
 *         - in: path
 *           name: invoiceNo
 *           required: true
 *           description: invoiceNo of order to return
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *         '400':
 *           description: The specified invoiceNo is invalid (not a number).
 *         '404':
 *           description: An order with the specified invoiceNo was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/:invoiceNo',authToken.authenticateToken,ordersController.getOrdersSummaryByInvoiceNo);

/**
 * @swagger
 * /orders/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add an Order
 *     tags: [Purchase Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invoiceNum:
 *                 type: string
 *               awardNo:
 *                 type: string
 *               supplierID:
 *                 type: integer
 *               discount:
 *                 type: number
 *               vatID:
 *                 type: integer
 *               orderTerms:
 *                 type: string
 *               orderComments:
 *                 type: string
 *               outletID:
 *                 type: integer
 *               create_userid:
 *                 type: integer
 *               stageID:
 *                 type: integer
 *               statusID:
 *                 type: integer
 *               orderDate:
 *                 type: string
 *               orderTime:
 *                 type: string
 *               orderdetails:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemID:
 *                       type: integer
 *                     itemUnitID:
 *                       type: integer
 *                     qty:
 *                       type: integer
 *                     unitCost:
 *                       type: number
 *                     stockLevel:
 *                       type: integer
 *                     reOrderLevel:
 *                       type: integer
 *                     remark:
 *                       type: string
 *                     approvaLevelID:
 *                       type: integer
 *                     approvaSatusID:
 *                       type: integer
 *                     stageID:
 *                       type: integer
 *                     statusID:
 *                       type: integer
 *                     createTime:
 *                       type: string
 *     responses:
 *       '201':
 *         description: created
 *       '400':
 *         description: Unexpected error
 */
router.post('/',authToken.authenticateToken,ordersController.createOrder);


/**
 * @swagger
 * /orders/pendingorders/all:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all Pending Purchase Orders
 *    tags: [Purchase Orders]
 *    description: Get all Pending Purchase Orders for Approval
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */

router.get('/pendingorders/all',authToken.authenticateToken,ordersController.getOrderPendingApprovalSummary);

/**
 * @swagger
 * path:
 *   /orders/pendingorders:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns Pending orders for approval by invoiceNo
 *       tags: [Purchase Orders]
 *       parameters:
 *         - in: query
 *           name: invoiceNo
 *           required: false
 *           description: invoiceNo of pending order approval to return
 *           schema:
 *             type: string
 *         - in: query
 *           name: supplierID
 *           required: false
 *           description: Supplier ID of pending order approval to return
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *         '400':
 *           description: The specified invoiceNo is invalid (not a number).
 *         '404':
 *           description: An order with the specified invoiceNo was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/pendingorders',authToken.authenticateToken,ordersController.getPendingOrdersSummaryByInvoice);

/**
 * @swagger
 * path:
 *   /orders/ordersbystagestatus:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns orders by invoiceNo OR supplierID AND stageID AND statusID
 *       tags: [Purchase Orders]
 *       parameters:
 *         - in: query
 *           name: invoiceNo
 *           required: false
 *           description: invoiceNo of pending order approval to return
 *           schema:
 *             type: string
 *         - in: query
 *           name: supplierID
 *           required: false
 *           description: Supplier ID of  to return
 *           schema:
 *             type: integer
 *         - in: query
 *           name: stageid
 *           required: true
 *           description: stage id of order to return
 *           schema:
 *             type: integer
 *         - in: query
 *           name: statusid
 *           required: true
 *           description: status id of order to return
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *         '400':
 *           description: The specified invoiceNo is invalid (not a number).
 *         '404':
 *           description: An order with the specified invoiceNo was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/ordersbystagestatus',authToken.authenticateToken,ordersController.getOrderByStageStatus);

/**
 * @swagger
 * path:
 *   /orders/approveorder:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       summary: Approves an order
 *       tags: [Purchase Orders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 purchaseOrderID:
 *                   type: integer
 *                 approvalNo:
 *                   type: string
 *                 outletID:
 *                   type: integer
 *                 remark:
 *                   type: string
 *                 approvalLevelId:
 *                   type: integer
 *                 approvalDate:
 *                   type: string
 *                 approvaldetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       purchaseOrderLineID:
 *                         type: integer
 *                       productID:
 *                         type: integer
 *                       unitCost:
 *                         type: integer
 *                       approvedtQty:
 *                         type: number
 *                       approvedLineTotalCost:
 *                         type: integer
 *                       productUnitID:
 *                         type: integer
 *                       reOrderLevel:
 *                         type: integer
 *                       stockLevel:
 *                         type: integer
 *                       remarks:
 *                         type: string
 *                       outletID:
 *                         type: integer
 *                       baseItemID:
 *                         type: integer
 *       responses:
 *         '201':
 *           description: created
 *         '400':
 *           description: Unexpected error
 */
router.post('/approveorder',authToken.authenticateToken,ordersController.approveOrder);

/**
 * @swagger
 * /orders/pendingreceival/all:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all Approved Purchase Orders Pending Receival
 *    tags: [Purchase Orders]
 *    description: Get  all Approved Purchase Orders Pending Receival
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/pendingreceival/all',authToken.authenticateToken,ordersController.getOrdersPendingReceival);


/**
 * @swagger
 * path:
 *   /orders/receiveorder:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       summary: Receive an order
 *       tags: [Purchase Orders]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderID:
 *                   type: integer
 *                 receivedDate:
 *                   type: string
 *                 wayBillNo:
 *                   type: string
 *                 sraNo:
 *                   type: string
 *                 costPercent:
 *                   type: integer
 *                 receivalNo:
 *                   type: string
 *                 remark:
 *                   type: string
 *                 outletID:
 *                   type: integer
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderlineid:
 *                         type: integer
 *                       itemid:
 *                         type: integer
 *                       unitcost:
 *                         type: integer
 *                       qty:
 *                         type: integer
 *                       unitid:
 *                         type: integer
 *                       batchno:
 *                         type: string
 *                       expirydate:
 *                         type: string
 *                       outletID:
 *                         type: integer
 *                       baseItemID:
 *                         type: integer
 *       responses:
 *         '201':
 *           description: created
 *         '400':
 *           description: Unexpected error
 */
router.post('/receiveorder',authToken.authenticateToken,ordersController.createOrderReceival);


module.exports=router;