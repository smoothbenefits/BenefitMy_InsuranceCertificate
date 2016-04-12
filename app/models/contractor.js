var mongoose = require('mongoose');
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
  createdTime: { type: Date, default: Date.now }
});

var contractorSchema = new Schema({
  companyDescriptor: { type: String, required: true},
  name: { type: String, required: true },
  address: { type: String },
  status: { type: String, required: true },
  createdTime: { type: Date, default: Date.now },
  updatedTime: { type: Date },
  insurance: [
    insuranceSchema
  ]
});

module.exports = mongoose.model('Contractor', contractorSchema);
