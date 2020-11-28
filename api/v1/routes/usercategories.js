var express = require('express');
var router = express.Router();
const userCatController = require('../controllers/usercategories');

/**
 * @swagger
 * tags:
 *   name: User Categories
 *   description: User management
 */

 //User Categories route

/**
 * @swagger
 * /usercategory/all:
 *  get:
 *    summary: Returns all User Categories
 *    tags: [User Category]
 *    description: Get all User Categories
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/all', userCatController.getUserCategories);

/**
 * @swagger
 * path:
 *   /usercategory/{id}:
 *     get:
 *       summary: Returns a User Category by id
 *       tags: [User Category]
 *       parameters:
 *         - in: query
 *           name: id
 *           required: true
 *           description: id of User Category to return
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
 *           description: The specified User Category ID is invalid (not a number).
 *         '404':
 *           description: A User Category with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/:id', userCatController.getUserCategoryID);

/**
 * @swagger
 *
 * /usercategory/:
 *   post:
 *     summary: Add New User Category
 *     tags: [User Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               isactive:
 *                 type: boolean
 *               createuser_id:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.post('/', userCatController.createUserCategory);

/**
 * @swagger
 *
 * /usercategory/{id}:
 *   put:
 *     summary: Update User Category
 *     tags: [User Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of User Category to update
 *         shema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               isactive:
 *                 type: boolean
 *               userId:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.put('/:id', userCatController.updateUserCategory);

module.exports=router;