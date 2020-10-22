var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth')
const townsController = require('../controllers/towns');


/**
* @swagger
* tags:
*   name: Towns
*   description: Towns
*/

//towns routes


/**
 * @swagger
 * /towns/all-towns:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all towns
 *    tags: [Towns]
 *    description: Get all towns
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/all-towns',authToken.authenticateToken,townsController.getTowns);

/**
 * @swagger
 * path:
 *   /towns/get-town:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns a town by id
 *       tags: [Towns]
 *       parameters:
 *         - in: query
 *           name: id
 *           required: true
 *           description: id of town to return
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
 *           description: The specified town ID is invalid (not a number).
 *         '404':
 *           description: An Outlet with the town ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/get-town',authToken.authenticateToken,townsController.getTownByID);

/**
 * @swagger
 * path:
 *   /towns/get-districttowns:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns a towns by district id
 *       tags: [Towns]
 *       parameters:
 *         - in: query
 *           name: id
 *           required: true
 *           description: id of district towns to return
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
 *           description: The specified district ID is invalid (not a number).
 *         '404':
 *           description: towns with the specified district ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/get-districttowns',authToken.authenticateToken,townsController.getTownByDistrictID);



/**
 * @swagger
 *
 * /towns/add-town:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add an Outlet (Branch)
 *     tags: [Towns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               zoneid:
 *                 type: integer
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
router.post('/add-town',authToken.authenticateToken,townsController.createTown);

/**
 * @swagger
 *
 * /towns/update-town:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a town
 *     tags: [Towns]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID of town to update
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
 *               zoneid:
 *                 type: integer
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
router.put('/update-town',authToken.authenticateToken,townsController.updateTown);

module.exports=router;