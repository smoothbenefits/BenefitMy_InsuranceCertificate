var moment = require('moment');
var _ = require("underscore");
var Contractor = require('../models/contractor');
var EmailService = require('./EmailService');
var CommonUtilityService = require('./CommonUtilityService');

var InsuranceExpirationValidationThresholdInDays = 15;

var ValidateCoverageExpirationForAllContractors = function(companyInfoCollection, successCallBack, errCallBack) {
    // Each company violation data item would look like
    // 
    // {
    //     companyDescriptor: 'XYZ',
    //     contractorName: 'ABC',
    //     violationInsurances: [
    //         {
    //             insuranceType: 'Transportation',
    //             policyEndDate: '2016-06-29',
    //             daysUntilExpiration: 14
    //         }
    //         ...
    //     ]
    // }
    Contractor
        .find({})
        .exec(function(err, contractors) {
            if (err) {
                // TODO: add logging
                return;
            }

            try {
                var violationRecords = [];

                contractors.forEach(function(contractor) {
                    var violationRecord =
                        _getCoverageExpirationValidationDataForContractor(contractor);
                    if (violationRecord) {
                        violationRecords.push(violationRecord);
                    }
                });

                // Map the collection of violation records to a dictionary
                // based on the company descriptor
                var violationDataCompanyMap = 
                    _.groupBy(violationRecords, 'companyDescriptor');
            
                companyInfoCollection.forEach(function(companyInfo) {
                    var violationData = violationDataCompanyMap[companyInfo.descriptor];
                    if (violationData) {
                        var contextData = {
                            companyDescriptor: companyInfo.descriptor,
                            contractors: violationData
                        };
                        _sendInsuranceExpirationEmailToCompany(contextData, companyInfo);
                    }
                });
                if (successCallBack) {
                    successCallBack();
                }
            } catch (err) {
                console.log(err.stack);
                if (errCallBack) {
                    errCallBack(err.stack);
                }
            }

        });
};

var _sendInsuranceExpirationEmailToCompany = function(violationData, companyInfo) {
    EmailService.sendSupportEmailWithTemplate(
        [companyInfo.email],
        '[Alert]Insurance Certificate Expiration',
        'insurance_expiration_notification_company',
        violationData
    );
};

var _getCoverageExpirationValidationDataForContractor = function(contractorRecord) {
    var violationRecord = {
        companyDescriptor: contractorRecord.companyDescriptor,
        contractorName: contractorRecord.name,
        violationInsurances: []
    };

    contractorRecord.insurances.forEach(function(insurance) {
        var daysUntilExpiration = 
            _computeInsuranceExpirationInDaysFromNow(insurance);
        
        // For now, we only care if the insurance is to be 
        // expired in less than the threshold number of days
        if (daysUntilExpiration <= InsuranceExpirationValidationThresholdInDays) {
            violationRecord.violationInsurances.push({
                insuranceType: insurance.type,
                policyEndDate: CommonUtilityService.getDisplayDate(insurance.policy.endDate),
                daysUntilExpiration: Math.max(Math.round(daysUntilExpiration), 0)
            });
        }
    });

    return violationRecord.violationInsurances.length > 0
        ? violationRecord
        : null;
};

var _computeInsuranceExpirationInDaysFromNow = function(insuranceRecord) {
    var now = moment.utc();
    var expiration = moment.utc(insuranceRecord.policy.endDate);
    var diffNumDays = expiration.diff(now, 'day', true);
    return diffNumDays;
};

module.exports = {
    ValidateCoverageExpirationForAllContractors: ValidateCoverageExpirationForAllContractors
};