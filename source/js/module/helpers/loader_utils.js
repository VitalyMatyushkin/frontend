/**
 * Created by wert on 19.11.15.
 */

const   specialModels   = ['parents', 'manager', 'admin', 'site', 'www', 'stage', 'login', 'playground'],
        defaultModel    = 'school',
        apiVersion      = 1;

/** Parses domain name to structure */
function parseDomainName(domainName) {
    // http://manager.squard.com → ["manager.squard.com", "manager", undefined|stage, "squard"]
    const external = domainName.match(/([A-z0-9-]+)+(?:.(stage|stage2|prod|preprod))?.(squadintouch|squard)\.(com|co\.uk)/);
    return {
        fullName:   external[0],
        model:      external[1],
        isStage:    external[2] === 'stage' || external[2] === 'stage2',
        rootDomain: external[3],
        env:        external[2]
    }
}

/** Returns api endpoint based on given domain name */
function apiSelector(domainName) {
    const parsedDomain = parseDomainName(domainName);
    let apiDomains;
    switch (true) {
        case parsedDomain.rootDomain === 'squadintouch' && parsedDomain.env === 'stage2':
            apiDomains = {
                main:   '//api2.stage.squadintouch.com',
                img:    '//img.stage.squadintouch.com'
            };
            break;
        case parsedDomain.rootDomain === 'squadintouch':
            apiDomains = {
                main:   '//api' + (parsedDomain.env ? '.' + parsedDomain.env : '') + `.squadintouch.com/v${apiVersion}`,
                img:    '//img' + (parsedDomain.env ? '.' + parsedDomain.env : '') + '.squadintouch.com'
            };
            break;
        case parsedDomain.rootDomain === 'squard':
            apiDomains = {
                // TODO COMMENT THIS LINE BEFORE COMMIT. ONLY FOR LOCAL WORK.
                main:   `//localhost:3000`,
                //main:   `//api2.stage.squadintouch.com`,
                img:    '//img.sta1ge.squadintouch.com'
            };
            break;
        default:
            apiDomains = {
                main:   `//api.stage.squadintouch.com/v${apiVersion}`,
                img:    '//img.stage.squadintouch.com'
            };
    }

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
