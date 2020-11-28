var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth')
const productCatController = require('../controllers/product_categories');

//product Catgeories routes
/**
 * @swagger
 * /product-category/all:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all Product Categories
 *    tags: [Product Category]
 *    description: Get all Product Categories
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/all',authToken.authenticateToken,productCatController.getProductCategories);

/**
 * @swagger
 * path:
 *   /product-category/{id}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns a product category by id
 *       tags: [Product Category]
 *       parameters:
 *         - in: path
 *           name: catid
 *           required: true
 *           description: id of product category to return
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
 *           description: The specified Product Category ID is invalid (not a number).
 *         '404':
 *           description: A Product Category with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/:id',authToken.authenticateToken,productCatController.getProductCategoryID);

/**
 * @swagger
 *
 * /product-category/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add a product category
 *     tags: [Product Category]
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
 *       '400':
 *         description: Unexpected error
 */
router.post('/',authToken.authenticateToken,productCatController.createPoductCategory);

/**
 * @swagger
 * path:
 *   /product-category/{id}:
 *     put:
 *       security:
 *         - bearerAuth: []
 *       summary: Updates a product category by id
 *       tags: [Product Category]
 *       parameters:
 *         - in: path
 *           name: catid
 *           required: true
 *           description: id of product category to update
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 *                 isactive:
 *                   type: boolean
 *                 userId:
 *                   type: integer
 *       responses:
 *         '201':
 *           description: updated
 *         '404':
 *           description: A Product Category with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.put('/:id',authToken.authenticateToken,productCatController.updateProductCategory);

module.exports=router;