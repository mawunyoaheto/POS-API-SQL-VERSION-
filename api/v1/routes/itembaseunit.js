var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth')
const itemsController = require('../controllers/itembaseunit');


//Item Base Unit  routes

/**
 * @swagger
 * /items/all-baseunits:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all Item Base Units
 *    tags: [ItemBaseUnit]
 *    description: Get all Item Base Units
 *    responses:
 *      '200':
 *        description: OK
 */
router.get('/all-baseunits',authToken.authenticateToken,itemsController.getItemBaseUnits);



/**
 * @swagger
 * path:
 *   /items/get-baseunit:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns an Item Base Unit by id
 *       tags: [ItemBaseUnit]
 *       parameters:
 *         - in: query
 *           name: id
 *           required: true
 *           description: id of item base unit to return
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: An Item Base Unit object
 *           content:
 *             application/json:
 *               schema:
 *                 type: object    
 *         '400':
 *           description: The specified base unit ID is invalid (not a number).
 *         '404':
 *           description: A base unit with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/get-baseunit',authToken.authenticateToken,itemsController.getItemBaseUnitByID);


/**
 * @swagger
 *
 * /items/add-baseunit:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create Item Base Unit
 *     tags: [ItemBaseUnit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               baseunit:
 *                 type: string
 *               isactive:
 *                 type: string
 *     responses:
 *       '200':
 *         description: created
 */
router.post('/add-baseunit',authToken.authenticateToken,itemsController.createItemBaseUnit);

/**
 * @swagger
 * path:
 *   /items/update-baseunit:
 *     put:
 *       security:
 *         - bearerAuth: []
 *       summary: Updates an Item Base Unit by id
 *       tags: [ItemBaseUnit]
 *       parameters:
 *         - in: query
 *           name: id
 *           required: true
 *           description: id of item base unit to update
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 baseunit:
 *                   type: string
 *                 isactive:
 *                   type: string
 *       responses:
 *         '200':
 *           description: updated
 */
router.put('/update-baseunit',authToken.authenticateToken,itemsController.updateItemBaseUnit);


module.exports=router;