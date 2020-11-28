var moment = require('moment');
const {poolPromise}=require('../util/db');
const helper = require('../util/helper');
var dbConfig = require('../../../config');
const Response = require('../util/response');
const respBody = require('../util/response');


const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;

var usersResp={}


async function createUser(req, res, next) {

  

  const pool = await poolPromise
  let errors =[]
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

if (req.body.password!=req.body.password2) {
  errors.push({ 'message': 'Passwords do not match' });
    //res.status(400).send({ 'message': 'Passwords do not match' });
  }

  if (!helper.Helper.isValidEmail(req.body.email)) {
    errors.push({ 'message': 'Please enter a valid email address' });
    res.status(400).send({ 'message': 'Please enter a valid email address' });
  }

  if(errors.length>0){

    res.render('register',{errors})
  }

  else{

    const hashPassword = helper.Helper.hashPassword(req.body.password);

    const createQuery = `INSERT INTO public.users(first_name, last_name, username, email, password, user_role_id, phone_number, blocked, 
      create_date, create_userid, usermachinename, usermachineip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *`;
  
      const userOutletsQuery = `INSERT INTO public.user_outlets(userid, outletid) VALUES ($1, $2);`
  
  
    const values = [
      req.body.fname,
      req.body.lname,
      req.body.uname,
      req.body.email,
      hashPassword,
      req.body.user_role,
      req.body.cellphone,
      req.body.blocked,
      moment(new Date()),
      req.body.create_userid,
      userMachineName,
      userMachineIP
    ];
  
  
    try {
  
      
      //await pool.query('BEGIN')
  
      const records = await pool.query(createQuery, values)
  
      userID = records.rows[0].id
  
      for (var i = 0; i < req.body.useroutlets.length; i++) {
  
        var userOutletValues=[
          userID,
          req.body.useroutlets[i].id      
        ];
  
       await pool.query(userOutletsQuery,userOutletValues)
  
      }
  
      await pool.query('COMMIT')
        //const token = helper.Helper.generateToken(records[0].id);
        //console.log('token', token)
        
        res.status(201).json({ 'message': 'Success' });
        res.render('login')
  
    } catch (error) {
  
      pool.query('ROLLBACK')
  
      if (error.routine === '_bt_check_unique') {
        res.status(400).send({ 'message': 'User with that EMAIL already exist' })
      }
      return res.status(400).json('record update failed with error: ' + helper.parseError(error, createQuery))
    }

  }


}

//GET User by ID

async function getUserByID(req, res, error) {

  const pool = await poolPromise

  var userDetails = {}
  const userId = req.params.id;

  const getUserQuery = `SELECT * FROM users WHERE id = '${userId}'`;

  try {
    const  recordset= await pool.query(getUserQuery)
    
    if (recordset.rowCount > 0 ) {
      userDetails.details = recordset.rows[0]
      userDetails.details.outlets = await getUserOutletsByUserID(userId)

      return res.status(200).json(userDetails)
    }else{

      return res.status(404).json({ 'message': 'failed' })
    }
  } catch (error) {
    return res.status(400).json('record not found with error: ' + helper.parseError(error, getUserQuery))
  }
}


async function getAllUsers(req, res) {

  const pool = await poolPromise

  const getUserQuery = `SELECT * FROM users WHERE Archived = 'false'`;

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

//UPDATE User 
async function updateUser(req, res, next){

  const pool = await poolPromise

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

  const id = req.params.id
  
  const values = [
    req.body.fname,
    req.body.lname,
    req.body.uname,
    req.body.email,
    req.body.user_role,
    req.body.cellphone,
    req.body.blocked,
    req.body.archived,
    moment(new Date()),
    req.body.userid,
    userMachineName,
    userMachineIP
  ];

  const updateQuery = `UPDATE public.users SET first_name='${req.body.fname}', last_name='${req.body.lname}', username='${req.body.uname}',
  email='${req.body.email}', user_role_id='${req.body.user_role}', phone_number='${req.body.cellphone}',blocked='${req.body.blocked}', 
  archived='${req.body.archived}', modifier_userid='${req.body.userid}', modified_date='${moment(new Date())}', usermachinename='${userMachineName}',
   usermachineip='${userMachineIP}' WHERE id ='${id}' returning *`;

    const userOutletsQuery = `INSERT INTO public.user_outlets(userid, outletid) VALUES ($1, $2);`

    const deleteUserOutlets = `DELETE FROM public.user_outlets WHERE userid = '${id}'`


  try {

    await pool.query('BEGIN')

    await pool.query(deleteUserOutlets)
    await pool.query(updateQuery)

    for (var i = 0; i < req.body.useroutlets.length; i++) {

      var userOutletValues=[
        id,
        req.body.useroutlets[i].id      
      ];

     await pool.query(userOutletsQuery,userOutletValues)

    }

    await pool.query('COMMIT')
    
      res.status(201).json({ 'message': 'Success' });

  } catch (error) {

    pool.query('ROLLBACK')
    return res.status(400).json('record update failed with error: ' + helper.parseError(error, updateQuery))
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
  
     const recordset = await  pool.query(queryString) 
  
          if (recordset.rowCount > 0) {
            // send records as a response
            return recordset.rows
  
          } else {
            return res.status(404).json({ 'message': 'failed' })
          }
  
    } catch (error) {
      return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
    }
  
  }


  async function updateUserOutletsByUserID(req, res,error) {

    const id = req.params.id;
    const pool = await poolPromise;
  
    const deleteUserOutlets = `delete from public.user_outlets WHERE userid='${id}'`
    const userOutletsQuery = `INSERT INTO public.user_outlets(userid, outletid) VALUES ($1, $2);`
  
    try {

      await pool.query('BEGIN')
  
      const records = await pool.query(deleteUserOutlets)
  
      for (var i = 0; i < req.body.useroutlets.length; i++) {
  
        console.log('useroutlets',req.body.useroutlets[i].id)
  
        var userOutletValues=[
          id,
          req.body.useroutlets[i].id      
        ];
  
  
       await pool.query(userOutletsQuery,userOutletValues)
  
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
    else{
      res.render('login')    }
}

//Register renderer
function register(req, res) {

  res.render('register')
 
 }

 //User Dash renderer
 function userDashboard(req, res) {

  res.render('dashboard',{user: req.user.first_name})
 
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