var Contractor = require('../models/contractor');

module.exports = function(app) {

    //
    // Get contractor by id
    app.get('/api/v1/contractor/:id', function(req, res) {
      var id = req.params.id;
      Contractor.findById(id, function(err, contractor) {
        if (err) {
          res.send(err);
        }

        res.setHeader('Cache-Control', 'no-cache');
        res.json(contractor);
      });
    });

    //
    // Get all contractors of a company
    app.get('/api/v1/company/:token/contractors', function(req, res) {
      var token = req.params.token;
      Contractor
      .find({ companyDescriptor: token })
      .exec(function(err, contractors) {
        if (err){
          res.status(400).send(err);
        }

        res.setHeader('Cache-Control', 'no-cache');
        res.json(contractors);
      });
    });

    //
    // Add a new contractor
    app.post('/api/v1/contractors', function(req, res) {

      Contractor.create(req.body, function(err, createdContractor) {
        if (err) {
            res.send(err);
        }

        res.json(createdContractor);
      });
    });

    //
    // Add a new insurance for a given contractor, defined by id
    app.post('/api/v1/contractor/:id/insurance', function(req, res) {

      var id = req.params.id;
      var insurnace = req.body.insurance;

      Contractor.findById(id), function(err, contractor) {
        if (err) {
          return res.status(400).send(err);
        }

        contractor.insurance.push(insurance);

        res.setHeader('Cache-Control', 'no-cache');
        res.json(contractor);
      }
    });

    //
    // Remove an insurance of a contractor, both defined by id
    app.delete('/api/v1/contractor/:contractorId/insurance/:insuranceId', function(req, res) {
      var contractorId = req.params.contractorId;
      var insuranceId = req.params.insuranceId;

      Contractor.findById(contractorId, function(err, contractor) {
        if (err) {
          return res.status(400).send(err);
        }

        contractor.insurance.id(insuranceId).remove();
        contractor.save(function(err) {
          if (err) {
            return res.status(400).send(err);
          }

          return res.status(204);
        });
      });
    });

    //
    // Update status of an existing contractor, defined by id
    app.put('/api/v1/contractor/:id/status', function(req, res) {
      var id = req.params.id;
      var status = req.body.status;

      Contractor.findOneAndUpdate(
        {'_id': id},
        { $set: { status: status, updatedTime: Date.now() }},
        {},
        function(err, contractor) {
          if (err) {
            res.send(err);
          }

          res.setHeader('Cache-Control', 'no-cache');
          res.json(contractor);
        }
      );
    });
};
