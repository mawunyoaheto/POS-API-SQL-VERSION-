var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth')
const transController = require('../controllers/modules_trans_stages');

/**
 * @swagger
 * path:
 *   /transactions/{moduleid}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns a Module Transactions by Module id
 *       tags: [Module Transactions]
 *       parameters:
 *         - in: path
 *           name: moduleid
 *           required: true
 *           description: id of Module to return
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
 *           description: The specified Module ID is invalid (not a number).
 *         '404':
 *           description: A Module with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/:moduleid',authToken.authenticateToken,transController.getModuleTransactionsByModuleID); 

/**
 * @swagger
 * path:
 *   /transactions/stages/{transid}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns Transaction Stages Module Transaction id
 *       tags: [Transaction Stages]
 *       parameters:
 *         - in: path
 *           name: transid
 *           required: true
 *           description: module Transaction id for returning Transaction Stages 
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
 *           description: The specified Module Transaction ID is invalid (not a number).
 *         '404':
 *           description: A Transaction Stage for the specified Module Transaction ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/stages/:transid',authToken.authenticateToken,transController.getTransactionStagesByModuleTransID);

module.exports=router;