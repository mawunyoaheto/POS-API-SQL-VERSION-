var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth');
const userLevePermController = require('../controllers/user_access_level_permissions');

/**
 * @swagger
 * tags:
 *   name: User Acces Level Permissions
 *   description: User management
 */

 //User Access Level Permissions route

/**
 * @swagger
 * /userlevelpermissions/all:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all User Role Permissions
 *    tags: [User Access Level Permissions]
 *    description: Get all User Acces Level Permissions
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/all',authToken.authenticateToken, userLevePermController.getAllUserAccessLevelPermissions);

/**
 * @swagger
 * path:
 *   /userlevelpermissions/{usercode}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns User Level Permissions by user id
 *       tags: [User Access Level Permissions]
 *       parameters:
 *         - in: path
 *           name: usercode
 *           required: true
 *           description: Role id of User Role Permissions to return
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
 *           description: The specified User Role ID is invalid (not a number).
 *         '404':
 *           description: Role Permissions with the specified Role ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/:usercode', authToken.authenticateToken,userLevePermController.getUserAccessLevelPermissionsByID);

/**
 * @swagger
 * /userlevelpermissions/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add User Level Permissions
 *     tags: [User Access Level Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 usercode:
 *                   type: integer
 *                 moduleid:
 *                   type: integer
 *                 moduletransid:
 *                   type: integer
 *                 transstageid:
 *                   type: integer
 *                 add:
 *                   type: string
 *                 edit:
 *                   type: string
 *                 view:
 *                   type: string
 *                 print:
 *                   type: string
 *                 delete:
 *                   type: string
 *                 viewlog:
 *                   type: string
 *                 isactive:
 *                   type: string
 *     responses:
 *       '201':
 *         description: created
 *       '400':
 *         description: Unexpected error
 */
router.post('/',authToken.authenticateToken,userLevePermController.createUserAccessLevelPermissions);


/**
 * @swagger
 * /userlevelpermissions/{usercode}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update User Level Permission by User Id
 *     tags: [User Access Level Permissions]
 *     parameters:
 *       - in: path
 *         name: usercode
 *         required: true
 *         description: User ID of User Level Permissions to update
 *         shema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 moduleid:
 *                   type: integer
 *                 moduletransid:
 *                   type: integer
 *                 transstageid:
 *                   type: integer
 *                 add:
 *                   type: string
 *                 edit:
 *                   type: string
 *                 view:
 *                   type: string
 *                 print:
 *                   type: string
 *                 delete:
 *                   type: string
 *                 viewlog:
 *                   type: string
 *                 isactive:
 *                   type: string
 *     responses:
 *       '201':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.put('/:usercode',authToken.authenticateToken, userLevePermController.updateUserAccessLevelPermissions);

module.exports=router;