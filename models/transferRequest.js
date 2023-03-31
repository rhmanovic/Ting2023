var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var TransferRequestSchema = new mongoose.Schema({
    requestNo: Number,
    status : {
        type: String,
        default: "processing"
    },
    fromID: String,
    fromName: String,
    toID: String,
    toName: String,
    productNo: String,
    productID: String,
    productName: String,
    quantity: Number,
    senderApprove: {
        type: Boolean,
        default: false
    },
    receiverApprove: {
        type: Boolean,
        default: false
    },
    managerApprove : {
        type: String,
        default: "no"
    },
    time : { type : Date, default: Date.now },
});
 
var TransferRequest = mongoose.model('transferRequest', TransferRequestSchema);
module.exports = TransferRequest;
