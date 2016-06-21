var Project = require('../models/project');


module.exports = function(app) {
    
    // Get Project by id
    app.get('/api/v1/project/:id', function(req, res) {
      var id = req.params.id;
      Project.findById(id, function(err, project) {
        if (err) {
          return res.status(404).send(err);
        }

        res.setHeader('Cache-Control', 'no-cache');
        return res.json(project);
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
        project.payables = req.body.payables,
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

        res.setHeader('Cache-Control', 'no-cache');
        return res.json(projects);
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

      Project.findById(id, function(err, project) {
        if (err) {
          return res.status(404).send(err);
        }
        if(payable._id){
          project.payables.pull({_id: payable._id});
        }
        project.payables.push(payable);
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