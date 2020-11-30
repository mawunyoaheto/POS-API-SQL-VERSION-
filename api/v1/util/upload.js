const multer = require('multer');
const util = require("util");
const path = require('path');

const csvFilter = (req, file, cb) => {

    console.log('file-type',file.mimetype)
  if (file.mimetype=="csv"|| file.mimetype=="application/vnd.ms-excel") {
    cb(null, true);
  } else {
    cb("Please upload only csv file.", false);
  }
};

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

//let uploadFile = multer({ storage: storage}).single("file");
let uploadFile = multer({ storage: storage, fileFilter: csvFilter }).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

module.exports ={
    uploadFile,
    uploadFileMiddleware
} 
