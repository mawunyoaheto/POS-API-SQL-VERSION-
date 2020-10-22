var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth')
const regionsController = require('../controllers/regions');


/**
* @swagger
* tags:
*   name: Regions
*   description: Regions
*/

//Regions routes


/**
 * @swagger
 * /regions/all:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all regions
 *    tags: [Regions]
 *    description: Get all regions
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/all',authToken.authenticateToken,regionsController.getRegions);

/**
 * @swagger
 * path:
 *   /regions/{id}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns a region by id
 *       tags: [Regions]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of region to return
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
 *           description: The specified region ID is invalid (not a number).
 *         '404':
 *           description: An Outlet with the region ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/:id',authToken.authenticateToken,regionsController.getRegionByID);


/**
 * @swagger
 *
 * /regions/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add an Outlet (Branch)
 *     tags: [Regions]
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
router.post('/',authToken.authenticateToken,regionsController.createRegion);

/**
 * @swagger
 *
 * /regions/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a region
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of region to update
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
router.put('/:id',authToken.authenticateToken,regionsController.updateRegion);

module.exports=router;