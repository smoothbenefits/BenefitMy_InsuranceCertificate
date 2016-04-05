var nodemailer = require('nodemailer');
var appSettings = require('../settings/appSettings');
var path = require('path');
var emailTemplates = require('email-templates');
var templatesDir = path.resolve(__dirname, '..', 'templates/emails');
var commonUtilityService = require('./CommonUtilityService');

// This is the SMTP configuration to be used by node-mailer
var smtpConfig = {
    host: appSettings.emailConfig.emailHost,
    port: appSettings.emailConfig.emailPort,
    auth: {
        user: appSettings.emailConfig.emailHostUser,
        pass: appSettings.emailConfig.emailHostPassword
    }
};

var transporter = nodemailer.createTransport(smtpConfig);

var sendSupportEmail = function(
    toEmailList,
    subject,
    html,
    text,
    includeSupportEmail) {

    // Adjust the subject to indicate for testing based on the 
    // environment.
    var nodeEnv = process.env.NODE_ENV;
    if (nodeEnv != 'production') {
        subject = '[For Test]' + subject;
    }

    // Determine whether should automatically include the support
    // email address as a recipient
    includeSupportEmail = typeof includeSupportEmail !== 'undefined' 
                ? includeSupportEmail
                : true;

    if (includeSupportEmail) {
        toEmailList.push(appSettings.emailConfig.appSupportEmailAddress);
    }

    // Build the mail content and sent it
    var mailOptions = {
        from: appSettings.emailConfig.appSupportEmailAddress, // sender address
        to: toEmailList, // list of receivers
        subject: subject, // Subject line
        html: html,
        text: text //, // plaintext body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            // TODO: log error
            console.log(error);
            return;
        }
    });
};

var sendSupportEmailWithTemplate = function(
    toEmailList,
    subject,
    templateName,
    contextData,
    includeSupportEmail) {

    // Build mail contents form template    
    emailTemplates(templatesDir, function(err, template) {
        if (err) {
            // TODO: log error
            console.log(err);
            return;
        }

        // Add main site URL to the context
        contextData.mainSiteUrl = appSettings.mainAppSiteUrl;

        template(templateName, contextData, function(err, html, text) {
            if (err) {
                // TODO: log error
                console.log(err);
                return;
            }

            // Now we have the rendered html and text, use the normal 
            // email sending method to handle the main thing.
            sendSupportEmail(
                toEmailList,
                subject,
                html,
                text,
                includeSupportEmail
            );
        });
    });
};

module.exports = {
    sendSupportEmail: sendSupportEmail,
    sendSupportEmailWithTemplate: sendSupportEmailWithTemplate
};