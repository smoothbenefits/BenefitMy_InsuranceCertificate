var mongoose = require('mongoose');
var uploadModule = require('./upload');
var Schema = mongoose.Schema;


var insuranceSchema = new Schema({
  type: { type: String, required: true},
  agent : {
    name: { type: String, required: true },
    contact: { type: String },
    address: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  policy: {
    policyNumber: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    coveredAmount: { type: Number, default: 0 }
  },
  uploads:[uploadModule.Upload],
  createdTime: { type: Date, default: Date.now }
});

var contractorSchema = new Schema({
  companyDescriptor: { type: String, required: true},
  name: { type: String, required: true },
  contact: {
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    email: { type: String }
  },
  address: {
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String }
  },
  status: { type: String, required: true },
  createdTime: { type: Date, default: Date.now },
  updatedTime: { type: Date },
  insurances: [
    insuranceSchema
  ]
});

module.exports = mongoose.model('Contractor', contractorSchema);
