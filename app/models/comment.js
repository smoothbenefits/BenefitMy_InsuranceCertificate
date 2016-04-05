var mongoose = require('mongoose');

module.exports = mongoose.model('Comment', {
    author : String,
    text: String,
    timestamp: { type:Date, default: Date.now}
});