/**
 * Created by wert on 19.11.15.
 */


var specialModels = ['parents', 'manager', 'admin', 'site', 'www', 'stage'];
var defaultModel = 'school';
var apiVersion = 1;

/** Parses domain name to structure */
function parseDomainName(domainName) {
    // http://manager.squard.com → ["manager.squard.com", "manager", undefined|stage, "squard"]
    var external = document.location.hostname.match(/([A-z0-9-]+)+(?:.(stage))?.(squadintouch|squard)\.com/);
    return {
        fullName:   external[0],
        model:      external[1],
        isStage:    external[2] === 'stage',
        rootDomain: external[3]
    }
}

/** Returns api endpoint based on given domain name */
function apiSelector(domainName) {
    var parsedDomain = parseDomainName(domainName);
    var apiBase = 'api.stage.squadintouch.com';
    if(parsedDomain.rootDomain === "squadintouch" && !parsedDomain.isStage) {
        apiBase = 'api.squadintouch.com';
    }
    var fullApiAddress = '//' + apiBase + '/v' + apiVersion;
    return fullApiAddress;
}

/** Chooses module to load based on given domain name */
function startModuleSelector(domainName) {
    var parsedDomain = parseDomainName(domainName);
    var model = parsedDomain.model;
    var startModule = 'module/start_as_' + specialModels.indexOf(model) !== -1 ? model : defaultModel;

    // TEST SERVER TEMPORARY SOLUTION
    if (startModule === 'module/start_as_stage') {
        startModule = 'module/start_as_www';
    }

    return startModule;
}

module.exports.parseDomainName      = parseDomainName;
module.exports.apiSelector          = apiSelector;
module.exports.startModuleSelector  = startModuleSelector;