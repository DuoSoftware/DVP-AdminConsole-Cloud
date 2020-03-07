/**
 * Created by dinusha on 5/29/2016.
 */

(function () {

    var cdrApiHandler = function ($http, baseUrls, loginService)
    {
        var getCDRForTimeRange = function (startDate, endDate, limit, offsetId, agent, skill, direction, record, custNumber, didFilter, bUnit, qpriority) {
            var url = baseUrls.cdrProcessor + 'Processed/GetCallDetailsByRange?startTime=' + startDate + '&endTime=' + endDate + '&limit=' + limit;

            if (agent) {
                url = url + '&agent=' + agent;
            }
            if (skill) {
                url = url + '&skill=' + skill;
            }
            if (direction) {
                url = url + '&direction=' + direction;
            }
            if (record) {
                url = url + '&recording=' + record;
            }

            if (offsetId) {
                url = url + '&offset=' + offsetId;
            }

            if (custNumber) {
                url = url + '&custnumber=' + custNumber;
            }

            if (qpriority >= 0) {
                url = url + '&qpriority=' + qpriority;
            }

            if (didFilter) {
                url = url + '&didnumber=' + didFilter;
            }

            if(bUnit)
            {
                url = url + '&businessunit=' + bUnit;
            }


            return $http({
                method: 'GET',
                url: url,
                timeout: 240000
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                return null;
            })
        };

        var getCampaignCDRForTimeRange = function (startDate, endDate, limit, offsetId, agent, skill, record, custNumber, campaignName) {
            var url = baseUrls.cdrProcessor + 'Processed/GetCampaignCallDetailsByRange?startTime=' + startDate + '&endTime=' + endDate + '&limit=' + limit;

            if (agent) {
                url = url + '&agent=' + agent;
            }

            if (skill) {
                url = url + '&skill=' + skill;
            }

            if (record) {
                url = url + '&recording=' + record;
            }

            if (offsetId) {
                url = url + '&offset=' + offsetId;
            }

            if (custNumber) {
                url = url + '&custnumber=' + custNumber;
            }

            if (campaignName) {
                url = url + '&campaignName=' + campaignName;
            }

            return $http({
                method: 'GET',
                url: url,
                timeout: 240000
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            })
        };

        var getCampaignAgentSummary = function (startDate, endDate) {
            var url = baseUrls.cdrProcessor + 'CampaignCallSummary?StartDate=' + startDate + '&EndDate=' + endDate;

            return $http({
                method: 'GET',
                url: url,
                timeout: 240000
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            })
        };

        var getCDRForTimeRangeCount = function (startDate, endDate, agent, skill, direction, record, custNumber, didFilter, bUnit, qpriority)
        {
            var url = baseUrls.cdrProcessor + 'Processed/GetCallDetailsByRange/Count?startTime=' + startDate + '&endTime=' + endDate;

            if (agent) {
                url = url + '&agent=' + agent;
            }
            if (skill) {
                url = url + '&skill=' + skill;
            }
            if (direction) {
                url = url + '&direction=' + direction;
            }
            if (record) {
                url = url + '&recording=' + record;
            }

            if (custNumber) {
                url = url + '&custnumber=' + custNumber;
            }

            if(qpriority >= 0)
            {
                url = url + '&qpriority=' + qpriority;
            }

            if (didFilter) {
                url = url + '&didnumber=' + didFilter;
            }

            if(bUnit)
            {
                url = url + '&businessunit=' + bUnit;
            }

            return $http({
                method: 'GET',
                url: url,
                timeout: 240000
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            })
        };

        var getCampaignCDRForTimeRangeCount = function (startDate, endDate, agent, skill, record, custNumber, campaignName)
        {
            var url = baseUrls.cdrProcessor + 'Processed/GetCampaignCallDetailsByRange/Count?startTime=' + startDate + '&endTime=' + endDate;

            if (agent) {
                url = url + '&agent=' + agent;
            }

            if (skill) {
                url = url + '&skill=' + skill;
            }

            if (record) {
                url = url + '&recording=' + record;
            }

            if (custNumber) {
                url = url + '&custnumber=' + custNumber;
            }

            if (campaignName) {
                url = url + '&campaignName=' + campaignName;
            }

            return $http({
                method: 'GET',
                url: url,
                timeout: 240000
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            })
        };

        var downloadCDRFileCSV = function (fileName) {
            var url = baseUrls.fileServiceUrl + 'File/DownloadLatest/' + fileName;

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getFileMetaData = function (fileName) {
            var url = baseUrls.fileServiceUrl + 'File/' + fileName + '/MetaData';

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getProcessedCDRByFilter = function (startDate, endDate, agent, skill, direction, record, custNumber) {
            var url = baseUrls.cdrProcessor + 'GetProcessedCallDetailsByRange?startTime=' + startDate + '&endTime=' + endDate;

            if (agent) {
                url = url + '&agent=' + agent;
            }
            if (skill) {
                url = url + '&skill=' + skill;
            }
            if (direction) {
                url = url + '&direction=' + direction;
            }
            if (record) {
                url = url + '&recording=' + record;
            }

            if (custNumber) {
                url = url + '&custnumber=' + custNumber;
            }
            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            })
        };

        var prepareDownloadCDRByType = function (startDate, endDate, agent, skill, direction, record, custNumber, didNumber, fileType, tz, bUnit, qpriority) {
            var url = baseUrls.cdrProcessor + 'PrepareDownload?startTime=' + startDate + '&endTime=' + endDate;

            if (agent) {
                url = url + '&agent=' + agent;
            }
            if (skill) {
                url = url + '&skill=' + skill;
            }
            if (direction) {
                url = url + '&direction=' + direction;
            }
            if (record) {
                url = url + '&recording=' + record;
            }

            if (custNumber) {
                url = url + '&custnumber=' + custNumber;
            }

            if (didNumber) {
                url = url + '&didnumber=' + didNumber;
            }

            if (fileType) {
                url = url + '&fileType=' + fileType;
            }

            if (tz) {
                url = url + '&tz=' + tz;
            }

            if(bUnit)
            {
                url = url + '&businessunit=' + bUnit;
            }

            if(qpriority)
            {
                url = url + '&qpriority=' + qpriority;
            }

            return $http({
                method: 'GET',
                url: url,
                timeout: 240000
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            })
        };

        var prepareDownloadCampaignCDRByType = function (startDate, endDate, agent, skill, record, custNumber, campaignName, fileType, tz) {
            var url = baseUrls.cdrProcessor + 'PrepareDownloadCampaign?startTime=' + startDate + '&endTime=' + endDate;

            if (agent) {
                url = url + '&agent=' + agent;
            }

            if (skill) {
                url = url + '&skill=' + skill;
            }

            if (record) {
                url = url + '&recording=' + record;
            }

            if (custNumber) {
                url = url + '&custnumber=' + custNumber;
            }

            if (campaignName) {
                url = url + '&campaignName=' + campaignName;
            }

            if (fileType) {
                url = url + '&fileType=' + fileType;
            }

            if (tz) {
                url = url + '&tz=' + tz;
            }

            return $http({
                method: 'GET',
                url: url,
                timeout: 240000
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            })
        };

        var prepareDownloadCDRAbandonByType = function (startDate, endDate, agent, skill, direction, record, custNumber, didNumber, fileType, tz, bUnit) {
            var url = baseUrls.cdrProcessor + 'PrepareDownloadAbandon?startTime=' + startDate + '&endTime=' + endDate;

            if (agent) {
                url = url + '&agent=' + agent;
            }
            if (skill) {
                url = url + '&skill=' + skill;
            }
            if (direction) {
                url = url + '&direction=' + direction;
            }
            if (record) {
                url = url + '&recording=' + record;
            }

            if (custNumber) {
                url = url + '&custnumber=' + custNumber;
            }

            if (didNumber) {
                url = url + '&didnumber=' + didNumber;
            }

            if (fileType) {
                url = url + '&fileType=' + fileType;
            }

            if (tz) {
                url = url + '&tz=' + tz;
            }

            if(bUnit)
            {
                url = url + '&businessunit=' + bUnit;
            }

            return $http({
                method: 'GET',
                url: url,
                timeout: 240000
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getAbandonCDRForTimeRange = function (startDate, endDate, limit, offsetId, agent, skill, custNumber, bUnit, qpriority) {
            var url = baseUrls.cdrProcessor + 'Processed/GetAbandonCallDetailsByRange?startTime=' + startDate + '&endTime=' + endDate + '&limit=' + limit;


            if (offsetId) {
                url = url + '&offset=' + offsetId;
            }

            if (agent) {
                url = url + '&agent=' + agent;
            }
            if (skill) {
                url = url + '&skill=' + skill;
            }
            if (custNumber) {
                url = url + '&custnumber=' + custNumber;
            }

            if(bUnit)
            {
                url = url + '&businessunit=' + bUnit;
            }

            if(qpriority >= 0)
            {
                url = url + '&qpriority=' + qpriority;
            }

            return $http({
                method: 'GET',
                url: url,
                timeout: 240000
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                return null;
            });
        };

        var getAbandonCDRForTimeRangeCount = function (startDate, endDate, agent, skill, custNumber, bUnit, qpriority) {
            var url = baseUrls.cdrProcessor + 'Processed/GetAbandonCallDetailsByRange/Count?startTime=' + startDate + '&endTime=' + endDate;


            if (agent) {
                url = url + '&agent=' + agent;
            }
            if (skill) {
                url = url + '&skill=' + skill;
            }
            if (custNumber) {
                url = url + '&custnumber=' + custNumber;
            }

            if(bUnit)
            {
                url = url + '&businessunit=' + bUnit;
            }

            if(qpriority >= 0)
            {
                url = url + '&qpriority=' + qpriority;
            }

            return $http({
                method: 'GET',
                url: url,
                timeout: 240000
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getCallSummaryForHr = function (date, tz, bUnit) {
            var url = baseUrls.cdrProcessor + 'CallCDRSummary/Hourly?date=' + date + '&tz=' + tz;

            if(bUnit)
            {
                url = url + '&businessunit=' + bUnit;
            }

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getCallSummaryForHrDownload = function (date, tz, fileType, bUnit) {
            var url = baseUrls.cdrProcessor + 'CallCDRSummary/Hourly/Download?date=' + date + '&tz=' + tz;

            if (fileType) {
                url = url + '&fileType=' + fileType;
            }

            if(bUnit)
            {
                url = url + '&businessunit=' + bUnit;
            }

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getCallSummaryForCustDownload = function (startTime, endTime, fileType, tz, bUnit) {
            var url = baseUrls.cdrProcessor + 'CallSummaryByCustomerDownload?startTime=' + startTime + '&endTime=' + endTime + '&tz=' + tz;

            if (fileType) {
                url = url + '&fileType=' + fileType;
            }

            if (bUnit) {
                url = url + '&businessunit=' + bUnit;
            }

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getCallSummaryForCust = function (startTime, endTime, tz, bUnit) {
            var url = baseUrls.cdrProcessor + 'CallSummaryByCustomer?startTime=' + startTime + '&endTime=' + endTime + '&tz=' + tz;

            if(bUnit)
            {
                url = url + '&businessunit=' + bUnit;
            }

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getCallSummaryForQueueHr = function (date, skill, tz) {
            var url = baseUrls.cdrProcessor + 'CallCDRSummaryByQueue/Hourly?date=' + date + '&tz=' + tz + '&skill=' + skill;

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getCallSummaryForQueueByHr = function (fromdate, todate, fromhour, tohour, skills, tz,businessUnit) {
            var qData = [];
            if(businessUnit && businessUnit !='ALL')
            {
                qData['businessunit'] = businessUnit;
            }
            qData['fromdate'] = fromdate;
            qData['todate'] = todate;
            qData['fromhour'] = fromhour;
            qData['tohour'] = tohour;
            qData['tz'] = tz;
            qData['skills'] = skills;

            //var url = baseUrls.cdrProcessor + 'CallCDRSummaryByQueue/Hourly?date=' + date + '&tz=' + tz + '&skill=' + skill + '&hour=' + hr;
            var url = baseUrls.cdrProcessor + 'CallCDRSummaryByQueue/Hourly';

            return $http({
                method: 'GET',
                url: url,
                params: qData
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getCallSummaryForQueueHrDownload = function (fromdate, todate, fromhour, tohour, skills, tz, fileType,businessUnit) {

            var qData = [];
            if(businessUnit && businessUnit !='ALL')
            {
                qData['businessunit'] = businessUnit;
            }

            qData['fromdate'] = fromdate;
            qData['todate'] = todate;
            qData['fromhour'] = fromhour;
            qData['tohour'] = tohour;
            qData['tz'] = tz;

            //var url = baseUrls.cdrProcessor + 'CallCDRSummaryByQueue/Hourly/Download?date=' + date + '&tz=' + tz;
            var url = baseUrls.cdrProcessor + 'CallCDRSummaryByQueue/Hourly/Download';

            if (fileType) {
                qData['fileType'] = fileType;
            }

            return $http({
                method: 'POST',
                url: url,
                data: JSON.stringify({skills: skills}),
                params: qData
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getAttributeList = function () {
            var url = baseUrls.resourceServiceBaseUrl + 'Attributes';

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getAgentStatusList = function (startDate, endDate, statusList, agentList) {
            var url = baseUrls.cdrProcessor + 'AgentStatus?startDate=' + startDate + '&endDate=' + endDate;

            var body = {
                agentList: null,
                statusList: null
            };

            if (agentList) {
                body.agentList = agentList
            }

            if (statusList) {
                body.statusList = statusList
            }

            return $http({
                method: 'POST',
                url: url,
                data: JSON.stringify(body)
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };
        var getAgentStatusRecords = function (startDate, endDate, statusList, agentList) {
            var url = baseUrls.cdrProcessor + 'Agent/AgentStatus?startDate=' + startDate + '&endDate=' + endDate;

            var body = {
                agentList: null,
                statusList: null
            };

            if (agentList) {
                body.agentList = agentList
            }

            if (statusList) {
                body.statusList = statusList
            }

            return $http({
                method: 'POST',
                url: url,
                data: JSON.stringify(body)
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getCallSummaryForDay = function (sdate, edate, tz, bUnit) {
            var url = baseUrls.cdrProcessor + 'CallCDRSummary/Daily?startDate=' + sdate + '&endDate=' + edate + '&tz=' + tz;

            if(bUnit)
            {
                url = url + '&businessunit=' + bUnit;
            }

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getCallSummaryForDayDownload = function (sdate, edate, tz, fileType, bUnit) {
            var url = baseUrls.cdrProcessor + 'CallCDRSummary/Daily/Download?startDate=' + sdate + '&endDate=' + edate + '&tz=' + tz;

            if (fileType) {
                url = url + '&fileType=' + fileType;
            }

            if (bUnit) {
                url = url + '&businessunit=' + bUnit;
            }

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getEmailRecipientsForReport = function (reportName) {
            var url = baseUrls.cdrProcessor + 'MailRecipients/ReportType/' + reportName;

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var getTimeZones = function () {
            var url = baseUrls.cdrProcessor + 'TimeZones';

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        var saveRecipients = function (repType, template, recipientsList) {
            var url = baseUrls.cdrProcessor + 'MailRecipient/ReportType/' + repType;

            var body = {
                recipients: recipientsList,
                template: template
            };

            return $http({
                method: 'POST',
                url: url,
                data: JSON.stringify(body)
            }).then(function (resp) {
                return resp.data;
            }, function (err) {
                loginService.isCheckResponse(err);
            });
        };

        return {
            getCDRForTimeRange: getCDRForTimeRange,
            getAbandonCDRForTimeRange: getAbandonCDRForTimeRange,
            getCallSummaryForHr: getCallSummaryForHr,
            getCallSummaryForDay: getCallSummaryForDay,
            getAgentStatusList: getAgentStatusList,
            prepareDownloadCDRByType: prepareDownloadCDRByType,
            getProcessedCDRByFilter: getProcessedCDRByFilter,
            getCallSummaryForQueueHr: getCallSummaryForQueueHr,
            getAttributeList: getAttributeList,
            downloadCDRFileCSV: downloadCDRFileCSV,
            getFileMetaData: getFileMetaData,
            prepareDownloadCDRAbandonByType: prepareDownloadCDRAbandonByType,
            getCallSummaryForHrDownload: getCallSummaryForHrDownload,
            getCallSummaryForDayDownload: getCallSummaryForDayDownload,
            getCallSummaryForQueueHrDownload: getCallSummaryForQueueHrDownload,
            getCallSummaryForCustDownload: getCallSummaryForCustDownload,
            getCallSummaryForCust: getCallSummaryForCust,
            getEmailRecipientsForReport: getEmailRecipientsForReport,
            saveRecipients: saveRecipients,
            getTimeZones: getTimeZones,
            getCallSummaryForQueueByHr: getCallSummaryForQueueByHr,
            getCDRForTimeRangeCount: getCDRForTimeRangeCount,
            getAbandonCDRForTimeRangeCount: getAbandonCDRForTimeRangeCount,
            getCampaignCDRForTimeRangeCount: getCampaignCDRForTimeRangeCount,
            getCampaignCDRForTimeRange: getCampaignCDRForTimeRange,
            getAgentStatusRecords: getAgentStatusRecords,
            prepareDownloadCampaignCDRByType: prepareDownloadCampaignCDRByType,
            getCampaignAgentSummary: getCampaignAgentSummary
        };
    };

    var module = angular.module("veeryConsoleApp");
    module.factory("cdrApiHandler", cdrApiHandler);

}());
