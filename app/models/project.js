var mongoose = require('mongoose');
var PayableSchema = require('./payable');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  companyDescriptor: { type: String, required: true},
  name: { type: String, required: true },
  address : {
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String }
  },
  requiredInsuranceTypes: [
    { type: String }
  ],
  payables: [ PayableSchema ],
  status: { type: String, required: true },
  isCCIP: { type: Boolean, required: true, default: false },
  createdTime: { type: Date, default: Date.now },
  updatedTime: { type: Date }
});

module.exports = mongoose.model('Project', ProjectSchema);
