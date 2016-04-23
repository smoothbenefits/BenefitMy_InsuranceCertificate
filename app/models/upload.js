var mongoose = require('mongoose');

module.exports = mongoose.model('Upload', {
    id: { type:String, required: true },
    S3: { type:String, required:true },
    file_name: { type: String },
    file_type: { type: String },
    uploaded_at: { type: Date }
});
