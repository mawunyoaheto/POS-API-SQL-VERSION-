var express = require('express');
var router = express.Router();
const authToken = require('../middleware/auth');
const userRolePermController = require('../controllers/user_role_permissions');

/**
 * @swagger
 * tags:
 *   name: User Role Permissions
 *   description: User management
 */

 //User Role Permissions route

/**
 * @swagger
 * /userrolepermissions/all:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all User Role Permissions
 *    tags: [User Role Permissions]
 *    description: Get all User Role Permissions
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/all',authToken.authenticateToken, userRolePermController.getAllUserRolePermissions);

/**
 * @swagger
 * path:
 *   /userrolepermissions/{roleid}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns Role Permissions by role id
 *       tags: [User Role Permissions]
 *       parameters:
 *         - in: path
 *           name: roleid
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
router.get('/:roleid', authToken.authenticateToken,userRolePermController.getUserRolePermissionsByID);

/**
 * @swagger
 * /userrolepermissions/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add User Role Permissions
 *     tags: [User Role Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 roleid:
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
router.post('/',authToken.authenticateToken,userRolePermController.createUserRolePermissions);


/**
 * @swagger
 *
 * /userrolepermissions/{roleid}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update User Role Permission by Role Id
 *     tags: [User Role Permissions]
 *     parameters:
 *       - in: path
 *         name: roleid
 *         required: true
 *         description: Role ID of User Role Permissions to update
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
router.put('/:roleid',authToken.authenticateToken, userRolePermController.updateUserRolePermissions);

module.exports=router;