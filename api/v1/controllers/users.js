var moment = require('moment');
const { poolPromise } = require('../util/db');
const helper = require('../util/helper');
var dbConfig = require('../../../config');
var Response = require('../util/response');
var respBody = require('../util/response');
const { error } = require('../util/winston');
var userAccessLevels = require('../controllers/user_access_level_permissions')
const sql = require('mssql');

const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;


var usersRes = {}

//GET User by ID

async function getUserByID(req, res, error) {

  var resp = new Response.Response(res);
  const pool = await poolPromise

  var userDetails = {}
  const userId = req.params.id;

  const getUserQuery = `SELECT * FROM users WHERE id = '${userId}'`;

  try {
    const recordset = await pool.query(getUserQuery)

    if (recordset.rowsAffected > 0) {
      userDetails.details = recordset.recordset[0]
      userDetails.accesslevels = await userAccessLevels.getUserAccessLevelByID(userId)
      userDetails.details.outlets = await getUserOutletsByUserID(userId)
      console.log(userDetails.accesslevels);
      usersRes = respBody.ResponseBody('success', userDetails, 'user Found');
      resp.json(200, usersRes);

    } else {

      userRes = respBody.ResponseBody('failed', '', 'No user found with id:' +userID );
      resp.json(400, userRes);
    }
  } catch (error) {
    userRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(400, userRes);
  }
}

async function getAllUsers(req, res) {

  const pool = await poolPromise

  const getUserQuery = `SELECT * FROM users WHERE Archived = 'False'`;

  try {
    pool.query(getUserQuery, function (err, recordset) {

      if (err) {

        console.log(err)

      } else {

        // send records as a response
        res.status(200).json(recordset.rows);
      }
    });
  }

  catch (error) {
    res.status(400).send(error);
  }
}

async function createUser(req, res, next) {

  const pool = await poolPromise;
  var resp = new Response.Response(res);
  const transaction = new sql.Transaction(pool);

  let errors = []
  if (!req.body.fname) {
    res.status(400).send({ 'message': 'First Name missing' });
    errors.push({ 'message': 'First Name missing' });
  }

  if (!req.body.lname) {
    errors.push({ 'message': 'Last Name missing' });
    res.status(400).send({ 'message': 'Last Name missing' });
  }

  if (!req.body.uname || !req.body.password || !req.body.password2) {
    errors.push({ 'message': 'Some values are missing' });
    res.status(400).send({ 'message': 'Some values are missing' });
  }

  if (req.body.password != req.body.password2) {
    errors.push({ 'message': 'Passwords do not match' });
    //res.status(400).send({ 'message': 'Passwords do not match' });
  }

  if (!helper.Helper.isValidEmail(req.body.email)) {
    errors.push({ 'message': 'Please enter a valid email address' });
    res.status(400).send({ 'message': 'Please enter a valid email address' });
  }

  if (errors.length > 0) {

    res.render('register', { errors })
  }

  else {

    const hashPassword = helper.Helper.hashPassword(req.body.password);

    const createUserQuery = `INSERT INTO users(first_name, last_name, username, email, password, user_role_id, phone_number, blocked, 
      create_userid, usermachinename, usermachineip) VALUES ('${req.body.fname}', '${req.body.lname}', 
      '${req.body.uname}', '${req.body.email}', '${hashPassword}','${req.body.user_role}','${req.body.cellphone}',
       '${req.body.blocked}', '${req.body.create_userid}', '${userMachineName}', 
       '${userMachineIP}'); SELECT SCOPE_IDENTITY() AS id`;

    try {


      // await pool.query('BEGIN')
      await transaction.begin();
      const trnxReq = new sql.Request(transaction);

      const records = await trnxReq.query(createUserQuery);

      userID = records.recordset[0].id


      //Create user outlets
      for (var i = 0; i < req.body.useroutlets.length; i++) {

        var createUserOutletsQuery = `INSERT INTO user_outlets(userid, outletid) VALUES ('${userID}', '${req.body.useroutlets[i].outletid}')`;

        await trnxReq.query(createUserOutletsQuery);

      }

      //Create user permissions
      for (i = 0; i < req.body.accesslevels.length; i++) {

        const createPermissionsQuery = `INSERT INTO user_accesslevelpermissions(usercode, moduleid,moduletransid,
            transtageid,canadd,canedit,canview,canprint, candelete,canviewchangelog,active, userid,usermachinename,usermachineip) VALUES 
            ('${userID}','${req.body.accesslevels[i].moduleid}', '${req.body.accesslevels[i].moduletransid}','${req.body.accesslevels[i].transstageid}', 
            '${req.body.accesslevels[i].add}','${req.body.accesslevels[i].edit}','${req.body.accesslevels[i].view}','${req.body.accesslevels[i].print}',
            '${req.body.accesslevels[i].delete}','${req.body.accesslevels[i].viewlog}','${req.body.accesslevels[i].isactive}',
            '${userid}', '${userMachineName}', '${userMachineIP}')`;

        recordset = await trnxReq.query(createPermissionsQuery);
      }

      await transaction.commit();

      usersRes = respBody.ResponseBody('success', '', 'user created ');
      resp.json(201, usersRes);

    } catch (error) {

      await transaction.rollback();

      if (error.routine === '_bt_check_unique') {
        res.status(400).send({ 'message': 'User with that EMAIL already exist' })

        userRes = respBody.ResponseBody('failed', '', 'User with that EMAIL already exist');
        resp.json(400, userRes);
      }
      userRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(400, userRes);
    }

  }

}

//UPDATE User 
async function updateUser(req, res, next) {

  const userID = req.params.id
  const pool = await poolPromise;
  var resp = new Response.Response(res);
  const transaction = new sql.Transaction(pool);

  normalizedDate = new Date(Date.now()).toISOString();

  if (!req.body.fname) {
    res.status(400).send({ 'message': 'First Name missing' });
  }

  if (!req.body.lname) {
    res.status(400).send({ 'message': 'Last Name missing' });
  }

  if (!req.body.uname) {
    res.status(400).send({ 'message': 'Some values are missing' });
  }

  if (!helper.Helper.isValidEmail(req.body.email)) {
    res.status(400).send({ 'message': 'Please enter a valid email address' });
  }

  const updateUserQuery = `UPDATE users SET first_name='${req.body.fname}', last_name='${req.body.lname}', username='${req.body.uname}',
  email='${req.body.email}', user_role_id='${req.body.user_role}', phone_number='${req.body.cellphone}',blocked='${req.body.blocked}', 
  archived='${req.body.archived}', modifier_userid='${req.body.userid}', modified_date='${normalizedDate}', usermachinename='${userMachineName}',
   usermachineip='${userMachineIP}' WHERE id ='${userID}'SELECT SCOPE_IDENTITY() AS id`;

  const deleteUserOutlets = `DELETE FROM user_outlets WHERE userid = '${userID}'`;
  const deleteUserAccessLevelQuery =`DELETE FROM user_accesslevelpermissions WHERE usercode='${userID}'`;


  try {

    // await pool.query('BEGIN')
    await transaction.begin();
    const trnxReq = new sql.Request(transaction);

    await trnxReq.query(updateUserQuery)
    await trnxReq.query(deleteUserOutlets)
    await trnxReq.query(deleteUserAccessLevelQuery);
    

   //Create user outlets
   for (var i = 0; i < req.body.useroutlets.length; i++) {

    var createUserOutletsQuery = `INSERT INTO user_outlets(userid, outletid) VALUES ('${userID}', '${req.body.useroutlets[i].outletid}')`;

    await trnxReq.query(createUserOutletsQuery);

  }

  
  //Create user Access Level Permissions
  for (i=0;i<req.body.accesslevels.length; i++){

    const createPermissionsQuery = `INSERT INTO user_accesslevelpermissions(usercode, moduleid,moduletransid,
      transtageid,canadd,canedit,canview,canprint, candelete,canviewchangelog,active, userid,usermachinename,usermachineip) VALUES 
      ('${userID}','${req.body.accesslevels[i].moduleid}', '${req.body.accesslevels[i].moduletransid}','${req.body.accesslevels[i].transstageid}', 
      '${req.body.accesslevels[i].add}','${req.body.accesslevels[i].edit}','${req.body.accesslevels[i].view}','${req.body.accesslevels[i].print}',
      '${req.body.accesslevels[i].delete}','${req.body.accesslevels[i].viewlog}','${req.body.accesslevels[i].isactive}',
      '${userid}', '${userMachineName}', '${userMachineIP}')`;

  recordset = await trnxReq.query(createPermissionsQuery);
  }

  await transaction.commit();

  usersRes = respBody.ResponseBody('success', '', 'user updated ');
  resp.json(201, usersRes);

  } catch (error) {
    await transaction.rollback();

    userRes = respBody.ResponseBody('failed', '', 'update failed with error: ' + helper.parseError(error));
    resp.json(400, userRes);
  }


}

//DELETE USER

async function deleteUser(req, res) {
  try {

    const id = req.params.id;
    const pool = await poolPromise

    const findonequery = 'SELECT * FROM users WHERE id = ($1)';
    const deleteQuery = `UPDATE users SET Archived ='Yes' WHERE id='${id}' returning *`;

    const confirmed = await helper.confirmRecord(findonequery, id);

    if (confirmed) {

      try {

        await pool.query(deleteQuery, function (err, res, next) {
        });

        res.status(201).json({ 'message': 'User deleted succesfully' });

      } catch (error) {
        res.status(404).send({ 'error': err });
      }

    } else {
      res.status(404).send({ 'error': 'user with id:' + id + ' not found' });
    }

  }
  catch (error) {

    res.status(400).send(error);
  }
}


async function getUserID(email, res) {

  const pool = await poolPromise

  try {

    const recordset = pool.query(`select id FROM users WHERE email='${email}'`)

    if (recordset.rowsAffected > 0) {
      recordset.recordset[0].id
      console.log('user-id', recordset.recordset[0].id)
    } else {
      return {
        message: 'No record found'
      }

    }

  } catch (error) {
    console.log(error);
    res.end()

  }

}

async function getUserOutletsByUserID(userId) {

  const queryString = `select outletid  AS id FROM user_outlets WHERE userid='${userId}'`
  const pool = await poolPromise

  try {

    const recordset = await pool.query(queryString)

    if (recordset.rowsAffected > 0) {
      // send records as a response
      return recordset.recordset;

    } else {
      return "";
    }

  } catch (error) {
    return error;
  }

}


async function updateUserOutletsByUserID(req, res, error) {

  const id = req.params.id;
  const pool = await poolPromise;

  const deleteUserOutlets = `delete from public.user_outlets WHERE userid='${id}'`
  const userOutletsQuery = `INSERT INTO public.user_outlets(userid, outletid) VALUES ($1, $2);`

  try {

    await pool.query('BEGIN')

    const records = await pool.query(deleteUserOutlets)

    for (var i = 0; i < req.body.useroutlets.length; i++) {

      console.log('useroutlets', req.body.useroutlets[i].id)

      var userOutletValues = [
        id,
        req.body.useroutlets[i].id
      ];


      await pool.query(userOutletsQuery, userOutletValues)

    }

    await pool.query('COMMIT')

    return true

  } catch (error) {

    pool.query('ROLLBACK')

    return false
  }

}

//Longin renderer
function login(req, res) {

  if (req.isAuthenticated()) {
    res.render('dashboard');
  }
  else {
    res.render('login')
  }
}

//Register renderer
function register(req, res) {

  res.render('register')

}

//User Dash renderer
function userDashboard(req, res) {

  res.render('dashboard', { user: req.user.first_name })

}

//GET User Role by ID

async function getUserRolesByID(typeID, res) {

  const pool = await poolPromise

  try {

    const recordset = await pool.query(`select * FROM user_roles WHERE id='${typeID}'`)

    if (recordset.rowsAffected > 0) {
      return recordset.recordset[0].description
      console.log('userCategory-id', recordset.recordset[0].id)
    } else {
      return {
        message: 'No record found'
      }

    }

  } catch (error) {
    console.log(error);
    res.end()

  }

}

async function getUserRoles(req, res) {

  const pool = await poolPromise

  try {

    pool.query('select * from user_roles', function (err, recordset) {

      if (err) {

        console.log(err)

      } else {

        // send records as a response
        res.status(200).json(recordset.rows);
      }
    });


  } catch (error) {

    console.log(error)

  }

}

module.exports = {
  createUser,
  getAllUsers,
  login,
  userDashboard,
  register,
  deleteUser,
  getUserID,
  getUserByID,
  getUserRolesByID,
  getUserRoles,
  getUserOutletsByUserID,
  updateUserOutletsByUserID,
  updateUser
};