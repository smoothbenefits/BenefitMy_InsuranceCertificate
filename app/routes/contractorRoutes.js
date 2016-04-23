var Contractor = require('../models/contractor');
var InsuranceCertificateValidationService 
    = require('../services/InsuranceCertificateValidationService');

module.exports = function(app) {

    //
    // Get contractor by id
    app.get('/api/v1/contractor/:id', function(req, res) {
      var id = req.params.id;
      Contractor.findById(id, function(err, contractor) {
        if (err) {
          res.status(404).send(err);
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
          res.status(404).send(err);
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
            res.status(400).send(err);
        }

        res.json(createdContractor);
      });
    });

    //
    // Add a new insurance for a given contractor, defined by id
    app.post('/api/v1/contractor/:id/insurance', function(req, res) {

      var id = req.params.id;
      var insurance = req.body;

      Contractor.findById(id, function(err, contractor) {
        if (err) {
          return res.status(404).send(err);
        }

        contractor.insurances.push(insurance);
        contractor.save(function(err) {
          if (err) {
            return res.status(400).send(err);
          }

          res.setHeader('Cache-Control', 'no-cache');
          res.json(contractor);
        });
      });
    });

    //
    // Remove an insurance of a contractor, both defined by id
    app.delete('/api/v1/contractor/:contractorId/insurance/:insuranceId', function(req, res) {
      var contractorId = req.params.contractorId;
      var insuranceId = req.params.insuranceId;

      Contractor.findById(contractorId, function(err, contractor) {
        if (err) {
          return res.status(404).send(err);
        }

        contractor.insurances.pull({_id: insuranceId});
        contractor.save(function(err) {
          if (err) {
            return res.status(400).send(err);
          }
          res.status(204);
        });
      });
    });

    //
    // Update status of an existing contractor, defined by id
    app.put('/api/v1/contractor/:id/status', function(req, res) {

      // request body should be:
      //     { status: 'ACTIVE' }
      var id = req.params.id;
      var status = req.body.status;

      Contractor.findOneAndUpdate(
        {'_id': id},
        { $set: { status: status, updatedTime: Date.now() }},
        {},
        function(err, contractor) {
          if (err) {
            res.status(400).send(err);
          }

          res.setHeader('Cache-Control', 'no-cache');
          res.json(contractor);
        }
      );
    });

    //
    // Execute global contractor insurance expiration validation
    app.post('/api/v1/contractors/execute_insurance_validation', function(req, res) {
        
        // Get the collection of company info from the post body
        var companyInfoCollection = req.body;

        // Invoke the validation service to perform everything
        InsuranceCertificateValidationService.ValidateCoverageExpirationForAllContractors(
            companyInfoCollection, 
            function() {
                res.status(200).send('Insurance expiration validation for all contractors completed!');
            },
            function(err) {
                res.status(500).send(err);
            }
        );
    });
};
