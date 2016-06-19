var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PayableSchema = new Schema({
  dateStart: { type: Date, required: true, default: Date.now },
  Contractor: {
    identifier: { type: String, required: true },
    name: { type: String, required: true }
  },
  amount: { type: Number, required: true },
  createdTime: { type: Date, default: Date.now },
  modifiedTime: { type: Date }
});

module.exports = mongoose.model('Payable', PayableSchema);
