var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth');
const productsController = require('../controllers/products');
const uploadProductsCSVController = require('../controllers/uploadproductscsv');
const upload = require("../util/upload");

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
 *   /products/all:
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
router.get('/all',authToken.authenticateToken,productsController.getProducts);

/**
 * @swagger
 * path:
 *   /products/{id}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns a product by id
 *       tags: [Products]
 *       parameters:
 *         - in: path
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
router.get('/:id',authToken.authenticateToken,productsController.getProductByID);

/**
 * @swagger
 * /products/:
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
router.post('/',authToken.authenticateToken,productsController.createPoduct);


/**
 * @swagger
 *
 * /products/upload:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add Products from a CSV file
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: object
 *           properties:
 *             file:
 *               type: string
 *               format: binary
 *     responses:
 *       '201':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.post('/upload',uploadProductsCSVController.upload);
//router.post('/upload',authToken.authenticateToken,upload.single("file"),uploadProductsCSVController.uploadProductcFromCSV);


/**
 * @swagger
 * path:
 *   /products/{id}:
 *     put:
 *       security:
 *         - bearerAuth: []
 *       summary: Updates a product by id
 *       tags: [Products]
 *       parameters:
 *         - in: path
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
router.put('/:id',authToken.authenticateToken,productsController.updateProduct);

module.exports=router;