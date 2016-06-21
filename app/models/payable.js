var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PayableSchema = new Schema({
  dateStart: { type: Date, required: true, default: Date.now },
  dateEnd: { type: Date, required: true },
  Contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor'
  },
  amount: { type: Number, required: true },
  createdTime: { type: Date, default: Date.now },
  modifiedTime: { type: Date }
});

module.exports = mongoose.model('Payable', PayableSchema);
