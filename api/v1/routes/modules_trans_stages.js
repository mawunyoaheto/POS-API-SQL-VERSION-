var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth')
const transController = require('../controllers/modules_trans_stages');


//MODULES ROUTES

/**
 * @swagger
 * /moduletranstages/all-modules:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all Modules
 *    tags: [Modules]
 *    description: Get all Modules
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/all-modules',authToken.authenticateToken,transController.getModules);


/**
 * @swagger
 * path:
 *   /moduletranstages/get-module:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns a Module by id
 *       tags: [Modules]
 *       parameters:
 *         - in: query
 *           name: id
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
router.get('/get-module',authToken.authenticateToken,transController.getModuleByID);

/**
 * @swagger
 * path:
 *   /moduletranstages/moduletrans:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns a Module Transactions by Module id
 *       tags: [Module Transactions]
 *       parameters:
 *         - in: query
 *           name: id
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
router.get('/moduletrans',authToken.authenticateToken,transController.getModuleTransactionsByModuleID); 

/**
 * @swagger
 * path:
 *   /moduletranstages/get-transtages:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns Transaction Stages Module Transaction id
 *       tags: [Transaction Stages]
 *       parameters:
 *         - in: query
 *           name: id
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
router.get('/get-transtages',authToken.authenticateToken,transController.getTransactionStagesByModuleTransID);

module.exports=router;