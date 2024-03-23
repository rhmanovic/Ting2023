var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var TransferRequestSchema = new mongoose.Schema({
    requestNo: {
      type: Number,
      default: 0
    },
    status : {
        type: String,
        default: "processing"
    },
    from: String,
    to: String,

    url: {
      type: String,
      default: "",
    },
    
    


    inventoryID: {
      type: String,
      default: "",
      text: true,
    },
    productID: {
      type: String,
      default: "",
      text: true,
    },
    nameA: {
      type: String,
      default: "",
      text: true,
    },
    nameE: {
      type: String,
      default: "",
      text: true,
    },
    productNo: {
      type: String,
      default: "",
      text: true,
    },
    brand: {
      type: String,
      default: "",
      text: true,
    },
    productNameA: {
      type: String,
      default: "",
    },
    productNameE: {
      type: String,
      default: "",
    },


  
    quantity: {
      type: Number,
      default: 0
    },
    requestBy: {
        type: String,
        default: "-"
    },
    
    time : { type : Date, default: () => new Date(new Date().getTime() + (3 * 60 * 60 * 1000)) },
    
    
    
    productNameAs: {
      type: [String],
      default: []
    },
    productNameEs: {
      type: [String],
      default: []
    },
    inventoryQuantities: {
      type: [Number],
      default: []
    },
    brands: {
      type: [String],
      default: []
    },
    inventoryIDs: {
      type: [String],
      default: []
    },
    nameAs: {
      type: [String],
      default: []
    },
    nameEs: {
      type: [String],
      default: []
    },
    sendFrom: {
      type: String,
      default: ""
    },

  
    approvalDetails: {
      sender: {
        approval: {
          type: Boolean,
          default: false
        },
        username: {
          type: String,
          default: ""
        },
        place: {
          type: String,
          default: ""
        },
        date: {
          type: Date,
          default: null
        }
      },
      receiver: {
        approval: {
          type: Boolean,
          default: false
        },
        username: {
          type: String,
          default: ""
        },
        place: {
          type: String,
          default: ""
        },
        date: {
          type: Date,
          default: null
        }
      },
      Finalpproval: {
        type: Boolean,
        default: false
      },
    }
  
});
 
var TransferRequest = mongoose.model('transferRequest', TransferRequestSchema);
module.exports = TransferRequest;
