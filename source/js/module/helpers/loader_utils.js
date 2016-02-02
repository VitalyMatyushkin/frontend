/**
 * Created by wert on 19.11.15.
 */

var specialModels = ['parents', 'manager', 'admin', 'site', 'www', 'stage', 'login'];
var defaultModel = 'school';
var apiVersion = 1;

/** Parses domain name to structure */
function parseDomainName(domainName) {
    // http://manager.squard.com → ["manager.squard.com", "manager", undefined|stage, "squard"]
    var external = domainName.match(/([A-z0-9-]+)+(?:.(stage))?.(squadintouch|squard)\.com/);
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
    if (parsedDomain.rootDomain === "squadintouch" && !parsedDomain.isStage) {
        apiBase = 'api.squadintouch.com';
    }
    apiBase = 'localhost:3000';
    var fullApiAddress = '//' + apiBase + '/v' + apiVersion;
    return fullApiAddress;
}

/** Chooses module to load based on given domain name */
function startModuleSelector(domainName) {
    var parsedDomain = parseDomainName(domainName);
    var model = parsedDomain.model;
    var modelToStart =  specialModels.indexOf(model) !== -1 ? model : defaultModel;
    var startModule = 'module/start_as_' + modelToStart;

    // TEST SERVER TEMPORARY SOLUTION
    if (startModule === 'module/start_as_stage') {
        startModule = 'module/start_as_www';
    }

    return startModule;
}

const loaderUtils = {
    parseDomainName: parseDomainName,
    apiSelector: apiSelector,
    startModuleSelector: startModuleSelector
};

module.exports = loaderUtils;
