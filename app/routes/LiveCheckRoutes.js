module.exports = function(app) {
    app.get('/livecheck', function(req, res) {
        res.setHeader('Cache-Control', 'no-cache');
        res.json({ 'message': 'Service is Live!' });
    });
};
