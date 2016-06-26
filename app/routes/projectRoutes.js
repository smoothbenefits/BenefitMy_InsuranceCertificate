var Project = require('../models/project');
var Payable = require('../models/payable');
var Contractor = require('../models/contractor');
var mongoose = require('mongoose');

module.exports = function(app) {

    // Get Project by id
    app.get('/api/v1/project/:id', function(req, res) {
      var id = req.params.id;
      Project.findById(id, function(err, project) {
        if (err) {
          return res.status(404).send(err);
        }

        // Mongoose 3.* does not support deep population
        // Workaround is to manual populate sub-document content by triggering sub-model
        // ref: https://github.com/Automattic/mongoose/issues/1377#issuecomment-15911192
        Contractor.populate(project, {
          path: 'payables.contractor',
          select: 'name'
        }, function(populateErr, response) {

          if (err) {
            return res.status(400).send(err);
          }

          res.setHeader('Cache-Control', 'no-cache');
          return res.json(project);
        });
      });
    });


    // Update Project by id
    app.put('/api/v1/project/:id', function(req, res) {
      var id = req.params.id;
      Project.findById(id, function(err, project) {
        // request body should be:
        //     { name: 'exampleProjectName',
        //       address: {
        //         address1: '23 test street',
        //         address2: '',
        //         city: 'Boston',
        //         state: 'MA',
        //         zip: '02344',
        //       },
        //       requiredInsuranceTypes: [
        //         'Commercial General Liability',
        //         'Umbrella Liability' ],
        //       payables: [],
        //     }
        if (err) {
          return res.status(404).send(err);
        }

        project.name = req.body.name;
        project.address = req.body.address;
        project.requiredInsuranceTypes = req.body.requiredInsuranceTypes;
        project.payables = req.body.payables;
        project.isCCIP = req.body.isCCIP;
        project.updatedTime = Date.now();
        project.save(function(err) {
          if (err) {
            return res.status(400).send(err);
          }
          res.setHeader('Cache-Control', 'no-cache');
          return res.json(project);
        });
      });
    });

    //
    // Get all Projects of a company
    app.get('/api/v1/company/:token/projects', function(req, res) {
      var token = req.params.token;
      Project
      .find({ companyDescriptor: token })
      .exec(function(err, projects) {
        if (err){
          return res.status(404).send(err);
        }

        // comment ref: [GET] '/api/v1/project/:id'
        Contractor.populate(projects, {
          path: 'payables.contractor',
          select: 'name'
        }, function(populateErr, response) {

          if (err) {
            return res.status(400).send(err);
          }

          res.setHeader('Cache-Control', 'no-cache');
          return res.json(projects);
        });
      });
    });

    //
    // Add a new Project
    app.post('/api/v1/project', function(req, res) {
      req.body.updatedTime = Date.now();
      Project.create(req.body, function(err, createdProject) {
        if (err) {
            return res.status(400).send(err);
        }

        return res.json(createdProject);
      });
    });

    //
    // Add a new Payable for a given Project, defined by id
    app.post('/api/v1/project/:id/payable', function(req, res) {

      var id = req.params.id;
      var payable = req.body;

      _createPayableIfNotExists(id, payable, function(err, projectId, savedPayable) {
        if (err) {
          return res.status(400).send(err);
        }

        // Then find project by id and add the newly created payable to the project
        Project.findById(projectId, function(projectErr, project) {
          if (projectErr) {
            return res.status(400).send(projectErr);
          }

          // If payable does not exist, pull will simply return 'this'
          project.payables.pull({_id: savedPayable._id});
          project.payables.push(savedPayable);

          project.save(function(saveProjectErr, savedProject) {
            if (saveProjectErr) {
              return res.status(400).send(saveProjectErr);
            }

            res.setHeader('Cache-Control', 'no-cache');
            return res.json(savedProject);
          });
        });
      })

      // Create payable if it does not exists,
      // then trigger callback function to finish operations
      function _createPayableIfNotExists(projectId, payable, callback) {
        if (!payable._id) {
          // First create ObjectId object and create a payable object in DB
          Payable.create(payable, function(payableErr, savedPayable) {
            if (payableErr) {
              callback(payableErr, projectId, savedPayable);
            }

            callback(null, projectId, savedPayable);
          });
        }

        callback(null, projectId, payable);
      };
    });

    //
    // Remove a payable of a project, both defined by id
    app.delete('/api/v1/project/:projectId/payable/:payableId', function(req, res) {
      var projectId = req.params.projectId;
      var payableId = req.params.payableId;

      Project.findById(projectId, function(err, project) {
        if (err) {
          return res.status(404).send(err);
        }

        project.payables.pull({_id: payableId});
        project.save(function(err) {
          if (err) {
            return res.status(400).send(err);
          }
          return res.status(204).send();
        });
      });
    });


    //
    // Update status of an existing project, defined by id
    app.put('/api/v1/project/:id/status', function(req, res) {

      // request body should be:
      //     { status: 'ACTIVE' }
      var id = req.params.id;
      var status = req.body.status;

      Project.findOneAndUpdate(
        {'_id': id},
        { $set: { status: status, updatedTime: Date.now() }},
        {},
        function(err, project) {
          if (err) {
            return res.status(400).send(err);
          }

          res.setHeader('Cache-Control', 'no-cache');
          return res.json(project);
        }
      );
    });
};
