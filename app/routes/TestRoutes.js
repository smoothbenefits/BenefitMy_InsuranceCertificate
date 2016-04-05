 // app/routes.js

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes


    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('/test', function(req, res) {
        res.sendfile('./public/test_page.html'); // load our public/index.html file
    });
 
};