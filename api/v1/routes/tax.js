var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth')
const taxController = require('../controllers/tax');


//Tax routes


/**
 * @swagger
 * /taxes/all-tax:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all Tax
 *    tags: [Tax]
 *    description: Get all Tax
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No Record found
 *      '400':
 *        description: Unexpected error
 */
router.get('/all-tax',authToken.authenticateToken,taxController.getTax);

/**
 * @swagger
 * path:
 *   /taxes/get-tax:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns Tax by id
 *       tags: [Tax]
 *       parameters:
 *         - in: query
 *           name: id
 *           required: true
 *           description: id of Tax to return
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
 *           description: The specified Tax ID is invalid (not a number).
 *         '404':
 *           description: A Tax with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/get-tax',authToken.authenticateToken,taxController.getTaxByID);

/**
 * @swagger
 *
 * /taxes/add-tax:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add New Tax
 *     tags: [Tax]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taxdescription:
 *                 type: string
 *               percentage:
 *                 type: float
 *               userid:
 *                 type: integer
 *               isactive:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.post('/add-tax',authToken.authenticateToken,taxController.createTax);

/**
 * @swagger
 *
 * /taxes/update-tax:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update Tax
 *     tags: [Tax]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: id of Tax to return
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taxdescription:
 *                 type: string
 *               percentage:
 *                 type: float
 *               userid:
 *                 type: integer
 *               isactive:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.put('/update-tax',authToken.authenticateToken,taxController.updateTax);

module.exports=router;