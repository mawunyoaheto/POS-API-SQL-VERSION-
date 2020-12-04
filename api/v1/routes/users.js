var express = require('express');
var router = express.Router();
const usersController = require('../controllers/users');
const genToken = require('../util/generateToken');
const passport = require('passport');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */


//router.get('/', detailsController.home_page);


//Users Routes

/**
 * @swagger
 * path:
 *   /users/{id}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Returns a User by id
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of User to return
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
 *           description: The specified User ID is invalid (not a number).
 *         '404':
 *           description: A User with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/:id',auth.authenticateToken, usersController.getUserByID);

/**
 * @swagger
 * /users/all:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all Users
 *    tags: [Users]
 *    description: Get all Users
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/all',auth.authenticateToken, usersController.getAllUsers);

//User Dash route
router.get('/dashboard', usersController.userDashboard);



//Register user
//router.get('/createuser', usersController.register);

/**
 * @swagger
 *
 * /users:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add a User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *               uname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               password2:
 *                 type: string
 *               user_role:
 *                 type: integer
 *               cellphone:
 *                 type: string
 *               blocked:
 *                 type: string
 *               create_userid:
 *                 type: integer
 *               accesslevels:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     moduleid:
 *                       type: integer
 *                     moduletransid:
 *                       type: integer
 *                     transstageid:
 *                       type: integer
 *                     add:
 *                       type: string
 *                     edit:
 *                       type: string
 *                     view:
 *                       type: string
 *                     print:
 *                       type: string
 *                     delete:
 *                       type: string
 *                     viewlog:
 *                       type: string
 *                     isactive:
 *                       type: string
 *               useroutlets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     outletid:
 *                       type: integer            
 *     responses:
 *       '201':
 *         description: created
 *       '400':
 *         description: Unexpected error
 */
router.post('/',auth.authenticateToken, usersController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a User
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of User to update
 *         shema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *               uname:
 *                 type: string
 *               email:
 *                 type: string
 *               user_role:
 *                 type: integer
 *               cellphone:
 *                 type: string
 *               blocked:
 *                 type: string
 *               archived:
 *                 type: string
 *               userid:
 *                 type: integer
 *               accesslevels:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     moduleid:
 *                       type: integer
 *                     moduletransid:
 *                       type: integer
 *                     transstageid:
 *                       type: integer
 *                     add:
 *                       type: string
 *                     edit:
 *                       type: string
 *                     view:
 *                       type: string
 *                     print:
 *                       type: string
 *                     delete:
 *                       type: string
 *                     viewlog:
 *                       type: string
 *                     isactive:
 *                       type: string
 *               useroutlets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     outletid:
 *                       type: integer            
 *     responses:
 *       '201':
 *         description: created
 *       '400':
 *         description: Unexpected error
 */
router.put('/:id',auth.authenticateToken, usersController.updateUser);


// User Login

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Generate token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Sucess
 *       '400':
 *         description: Unexpected error
 */
router.post('/login',genToken.generateToken);

//router.get('/login', usersController.login)

// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/users/dashboard',
//     failureRedirect: '/users/login',
//     failureFlash: true
// })
// );

// router.post('/users/login', passport.authenticate('local', {
//     successRedirect: '/users/dashboard',
//     failureRedirect: '/users/login', failureFlash: true
// }));





//User Types route
router.get('/usertypes', usersController.getUserRoles);
router.get('/usertypes/:id', usersController.getUserRolesByID);


//User outlets route
router.get('/useroutlets/:id', usersController.getUserOutletsByUserID);
router.post('/useroutlets/:id', usersController.updateUserOutletsByUserID);

module.exports = router;