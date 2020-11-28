var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth')
const transController = require('../controllers/modules_trans_stages');


//MODULES ROUTES

/**
 * @swagger
 * /modules/all:
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
router.get('/all',authToken.authenticateToken,transController.getModules);


/**
 * @swagger
 * path:
 *   /modules/{id}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns a Module by id
 *       tags: [Modules]
 *       parameters:
 *         - in: path
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
router.get('/:id',authToken.authenticateToken,transController.getModuleByID);

module.exports=router;