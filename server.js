var express = require('express');
const app = express();
var bodyParser = require("body-parser");
var sql = require('mssql');
const passport = require('passport');
var helmet = require('helmet');
const rateLimit = require('express-rate-limit')
const flash = require('express-flash');
const cors = require("cors");
var compression = require('compression');
var morgan = require('morgan');
const winston = require('./api/v1/util/winston');
const config = require('./config');
var swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');

const user_routes = require("./api/v1/routes/users");
const usercategory_routes = require("./api/v1/routes/usercategories");
const product_routes = require("./api/v1/routes/products");
const productCategory_routes = require("./api/v1/routes/product_categories");
const itembaseunit_routes = require("./api/v1/routes/itembaseunit");
const moduletranstages_routes = require("./api/v1/routes/modules_trans_stages");
const transactions_routes = require("./api/v1/routes/transaction_stages");
const suppliers_routes = require("./api/v1/routes/suppliers");
const tax_routes = require("./api/v1/routes/tax");
const outlet_routes = require("./api/v1/routes/outlets");
const region_routes = require("./api/v1/routes/regions");
const district_routes = require("./api/v1/routes/districts");
const town_routes = require("./api/v1/routes/towns");
const epayment_routes = require("./api/v1/routes/e-payments");
const paymentmodes_routes = require("./api/v1/routes/payment_modes");
const orders_routes = require("./api/v1/routes/orders");

//prevent DDOS by limiting the rate of request

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // 5 requests,
  })

const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "POS API",
        version: "1.0.0",
        description: "An API for Point of Sale",
        contact: {
          name: "GENITICH SOLUTIONS"
        }
        //servers:["http://localhost:5001/api/v2"]
      },
      servers: [
        {
         url: 'http://{urlpath}:{port}{basePath}',
         description: 'The Test API server',
         variables: {
           urlpath: {
             default: 'localhost',
             description: 'this value is assigned by the service provider, in this example `gigantic-server.com`'
              },
              port: {
                enum: [
                  '5007',
                  '443',
                  '8080'
                ],
                default: '5007'
              },
              basePath: {
                default: '/api/v1'
              }
            }
          }
        ],
       components:{
        securitySchemes: {
          bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
      security:{
        bearerAuth: []
      }
    },
      apis: ['./api/v1/routes/*.js']
      //apis: ['./api/v2/routes/*.js']
  
  }
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  

  app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  })
  );
  
  app.set('view engine', 'ejs');
  app.use(flash())
  app.use(passport.initialize())
  app.use(passport.session());
  app.use(helmet());
  app.use(limiter)
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
  app.use(morgan('combined', {
    stream: winston.stream
  }));
  
  // Routes which should handle requests
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));
  
  
  app.use(cors());
  app.use(compression());

  app.use('/api/v1/users',user_routes);
  app.use('/api/v1/usercategory',usercategory_routes);
  app.use('/api/v1/products',product_routes);
  app.use('/api/v1/productcategory',productCategory_routes);
  app.use('/api/v1/items',itembaseunit_routes);
  app.use('/api/v1/modules',moduletranstages_routes);
  app.use('/api/v1/transactions',transactions_routes);
  app.use('/api/v1/suppliers',suppliers_routes);
  app.use('/api/v1/taxes',tax_routes);
  app.use('/api/v1/outlets',outlet_routes);
  app.use('/api/v1/epay',epayment_routes);
  app.use('/api/v1/payments',paymentmodes_routes);
  app.use('/api/v1/regions',region_routes);
  app.use('/api/v1/districts',district_routes);
  app.use('/api/v1/towns',town_routes);
  app.use('/api/v1/orders',orders_routes);

  // catch 404 and forward to error handler
app.use((err, req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.send(err);
  });

app.listen(config.port, function (req, res) {
    app.set('json spaces', 40);
    console.log(`Server running at http://${ config.host }:${ config.port }...`);
  });
  