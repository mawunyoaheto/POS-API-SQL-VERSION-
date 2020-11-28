var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth')
const itemsController = require('../controllers/itembaseunit');


//Item Base Unit  routes

/**
 * @swagger
 * /itembaseunit/all:
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
router.get('/all',authToken.authenticateToken,itemsController.getItemBaseUnits);



/**
 * @swagger
 * path:
 *   /itembaseunit/{id}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns an Item Base Unit by id
 *       tags: [ItemBaseUnit]
 *       parameters:
 *         - in: path
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
router.get('/:id',authToken.authenticateToken,itemsController.getItemBaseUnitByID);


/**
 * @swagger
 *
 * /itembaseunit/:
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
router.post('/',authToken.authenticateToken,itemsController.createItemBaseUnit);

/**
 * @swagger
 * path:
 *   /itembaseunit/{id}:
 *     put:
 *       security:
 *         - bearerAuth: []
 *       summary: Updates an Item Base Unit by id
 *       tags: [ItemBaseUnit]
 *       parameters:
 *         - in: path
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
router.put('/:id',authToken.authenticateToken,itemsController.updateItemBaseUnit);


module.exports=router;