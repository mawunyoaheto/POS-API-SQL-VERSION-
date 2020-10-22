var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth')
const epayController = require('../controllers/e-payments');


/**
* @swagger
* tags:
*   name: E-Payments
*   description: Electronic Payments
*/


//e-payment api setup

/**
 * @swagger
 * /epay/all-epayments:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all e-payments
 *    tags: [E-Payments]
 *    description: Get all e-payments
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/all-epayments',authToken.authenticateToken,epayController.getEpaymentAPI);
/**
 * @swagger
 * path:
 *   /epay/get-epayment:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns an e-payment type by id
 *       tags: [E-Payments]
 *       parameters:
 *         - in: query
 *           name: id
 *           required: true
 *           description: id of e-payment type to return
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
 *           description: The specified e-payment type ID is invalid (not a number).
 *         '404':
 *           description: An e-payment type with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/get-epayment',authToken.authenticateToken,epayController.getEpaymentAPIByID);

/**
 * @swagger
 *
 * /epay/add-epayment:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add an E-Payment 
 *     tags: [E-Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               requesturl:
 *                 type: string
 *               statusurl:
 *                 type: string
 *               payloadtypeid:
 *                 type: integer
 *               apikey:
 *                 type: string
 *               secretkey:
 *                 type: string
 *               code:
 *                 type: string
 *               requestbody:
 *                 type: string
 *               statusbody:
 *                 type: string
 *               isactive:
 *                 type: string
 *     responses:
 *       '201':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
 router.post('/add-epayment',authToken.authenticateToken,epayController.createEpaymentAPI);

 /**
 * @swagger
 *
 * /epay/update-epayment:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update an e-payment
 *     tags: [E-Payments]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID of e-payment to update
 *         shema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               requesturl:
 *                 type: string
 *               statusurl:
 *                 type: string
 *               payloadtypeid:
 *                 type: integer
 *               apikey:
 *                 type: string
 *               secretkey:
 *                 type: string
 *               code:
 *                 type: string
 *               requestbody:
 *                 type: string
 *               statusbody:
 *                 type: string
 *               isactive:
 *                 type: string
 *     responses:
 *       '201':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.put('/e-payment/',authToken.authenticateToken,epayController.updateEpaymentAPI);

module.exports=router;