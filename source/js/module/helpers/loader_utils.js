/**
 * Created by wert on 19.11.15.
 */

const   specialModels   = ['parents', 'manager', 'admin', 'site', 'www', 'stage', 'login', 'playground'],
        defaultModel    = 'school',
        apiVersion      = 1;

/** Parses domain name to structure */
function parseDomainName(domainName) {
    // http://manager.squard.com → ["manager.squard.com", "manager", undefined|stage, "squard"]
    const external = domainName.match(/([A-z0-9-]+)+(?:.(stage|prod|preprod))?.(squadintouch|squard)\.(com|co\.uk)/);
    return {
        fullName:   external[0],
        model:      external[1],
        isStage:    external[2] === 'stage',
        rootDomain: external[3],
        env:        external[2]
    }
}

/** Returns api endpoint based on given domain name */
function apiSelector(domainName) {
    const parsedDomain = parseDomainName(domainName);
    let apiDomains;
    switch (true) {
        case parsedDomain.rootDomain === 'squadintouch':
            apiDomains = {
                main:   'api' + (parsedDomain.env ? '.' + parsedDomain.env : '') + '.squadintouch.com',
                img:    'img' + (parsedDomain.env ? '.' + parsedDomain.env : '') + '.squadintouch.com'
            };
            break;
        case parsedDomain.rootDomain === 'squard':
            apiDomains = {
                main:   'api.stage.squadintouch.com',
                img:    'img.stage.squadintouch.com'
            };
            break;
        default:
            apiDomains = {
                main:   'api.stage.squadintouch.com',
                img:    'img.stage.squadintouch.com'
            };
    }

    apiDomains.main = '//' + apiDomains.main + '/v' + apiVersion;
    apiDomains.img  = '//' + apiDomains.img;
    return apiDomains;
}

/** Chooses module to load based on given domain name */
function startModuleSelector(domainName) {
    const   parsedDomain    = parseDomainName(domainName),
            model           = parsedDomain.model,
            modelToStart    =  specialModels.indexOf(model) !== -1 ? model : defaultModel;

    let startModule     = 'module/start_as_' + modelToStart;

    // TEST SERVER TEMPORARY SOLUTION
    if (startModule === 'module/start_as_stage') {
        startModule = 'module/start_as_www';
    }

    return startModule;
}

const loaderUtils = {
    parseDomainName:        parseDomainName,
    apiSelector:            apiSelector,
    startModuleSelector:    startModuleSelector
};

module.exports = loaderUtils;
