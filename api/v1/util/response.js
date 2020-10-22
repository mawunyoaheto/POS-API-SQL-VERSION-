var winston = require('./winston');


function Response(res) {
    this.res = res;
}

Response.prototype.json = function(status, body) {
    if (status !== 200) {
        winston.info(body.message);
    }
    this.res.status(status).json(body);

    
}
function ResponseBody(status, data, message) {
    this.status = status;
    this.data = data;
    this.message = message;

    var body ={
        status: status,
        data: data,
        message: message
    };

    return body;
}

module.exports = {
    Response,
    ResponseBody
};