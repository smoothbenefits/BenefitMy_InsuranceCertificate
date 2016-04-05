var Comment = require('../models/comment');

module.exports = function(app) {

    app.get('/api/v1/comments', function(req, res) {

        Comment
        .find()
        .sort('timestamp')
        .exec(function(err, comments) {
            if (err) {
                res.send(err);
            }

            res.setHeader('Cache-Control', 'no-cache');
            res.json(comments);
        });

    });

    app.post('/api/v1/comments', function(req, res) {

        Comment.create(req.body, function(err, comment) {
            if (err) {
                res.send(err);
            }

            Comment
            .find()
            .sort('timestamp')
            .exec(function(err, comments) {
                if (err) {
                    res.send(err);
                }

                res.setHeader('Cache-Control', 'no-cache');
                res.json(comments);
            });
        });
    
    });
};