var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth')
const districtsController = require('../controllers/districts');


/**
* @swagger
* tags:
*   name: districts
*   description: districts
*/

//districts routes


/**
 * @swagger
 * /districts/all-districts:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all districts
 *    tags: [districts]
 *    description: Get all districts
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/all-districts',authToken.authenticateToken,districtsController.getDistricts);

/**
 * @swagger
 * path:
 *   /districts/get-district:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns a district by id
 *       tags: [districts]
 *       parameters:
 *         - in: query
 *           name: id
 *           required: true
 *           description: id of district to return
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
 *           description: An Outlet with the district ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/get-district',authToken.authenticateToken,districtsController.getDistrictByID);


/**
 * @swagger
 *
 * /districts/add-district:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add an Outlet (Branch)
 *     tags: [districts]
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
router.post('/add-district',authToken.authenticateToken,districtsController.createDistrict);

/**
 * @swagger
 *
 * /districts/update-outlet:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a district
 *     tags: [districts]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID of district to update
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
router.put('/update-district',authToken.authenticateToken,districtsController.updateDistrict);

module.exports=router;