var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UploadSchema = new Schema({
    id: { type:String, required: true },
    S3: { type:String, required:true },
    file_name: { type: String },
    file_type: { type: String },
    uploaded_at: { type: Date }
});

module.exports = UploadSchema;
