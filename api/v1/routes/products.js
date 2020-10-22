var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth')
const productsController = require('../controllers/products');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products management
 */


//router.get('/',detailsController.home_page);


//products routes

/**
 * @swagger
 * path:
 *   /products/products:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns all products
 *       tags: [Products]
 *       responses:
 *         '200':
 *           description: OK
 *         '404':
 *           description: No records found
 *         '400':
 *           description: Unexpected error
 */
router.get('/products',authToken.authenticateToken,productsController.getProducts);

/**
 * @swagger
 * path:
 *   /products/get-product:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns a product by id
 *       tags: [Products]
 *       parameters:
 *         - in: query
 *           name: productid
 *           required: true
 *           description: id of product to return
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
 *           description: The specified Product ID is invalid (not a number).
 *         '404':
 *           description: A Product with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/get-product',authToken.authenticateToken,productsController.getProductByID);

/**
 * @swagger
 * /products/add-product:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               ext_description:
 *                 type: string
 *               product_code:
 *                 type: string
 *               cost_price:
 *                 type: integer
 *               s_price:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               baseunit_id:
 *                 type: integer
 *               archived:
 *                 type: string
 *               userid:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: created
 *       '400':
 *         description: Unexpected error
 */
router.post('/add-product',authToken.authenticateToken,productsController.createPoduct);

/**
 * @swagger
 * path:
 *   /products/update-product:
 *     put:
 *       security:
 *         - bearerAuth: []
 *       summary: Updates a product by id
 *       tags: [Products]
 *       parameters:
 *         - in: query
 *           name: id
 *           required: true
 *           description: id of product to update
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                 ext_description:
 *                   type: string
 *                 product_code:
 *                   type: string
 *                 cost_price:
 *                   type: double
 *                 s_price:
 *                   type: double
 *                 category_id:
 *                   type: integer
 *                 isactive:
 *                   type: boolean
 *                 userid:
 *                   type: integer
 *       responses:
 *         '201':
 *           description: created
 *         '400':
 *           description: Unexpected error
 */
router.put('/update-product',authToken.authenticateToken,productsController.updateProduct);


//product Catgeories routes
/**
 * @swagger
 * /products/get-categories:
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
router.get('/get-categories',authToken.authenticateToken,productsController.getProductCategories);

/**
 * @swagger
 * path:
 *   /products/get-category:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns a product category by id
 *       tags: [Product Category]
 *       parameters:
 *         - in: query
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
router.get('/get-category',authToken.authenticateToken,productsController.getProductCategoryID);

/**
 * @swagger
 *
 * /products/add-category:
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
router.post('/add-category',authToken.authenticateToken,productsController.createPoductCategory);

/**
 * @swagger
 * path:
 *   /products/update-category:
 *     put:
 *       security:
 *         - bearerAuth: []
 *       summary: Updates a product category by id
 *       tags: [Product Category]
 *       parameters:
 *         - in: query
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
router.put('/update-category',authToken.authenticateToken,productsController.updateProductCategory);



module.exports=router;