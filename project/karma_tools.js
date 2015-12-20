/**
 * Created by wert on 20.12.15.
 */


/**Constructs new FakeConfig to inject into Karma's config definition
 * Fake config is similar to Karma's config and provides few usefull methods
 **/
function FakeConfig(){

    var FOCUS = "FOCUS";
    var IGNORE = "IGNORE";

    /** During Karma configuration this method will be called and filled with all properties */
    this.set = function(params){
        this.params = params;
        this.isSet = true;
    };

    this.isFocused = function(){
        return this.params.hasOwnProperty(FOCUS) && this.params[FOCUS] === true
    };

    this.isIgnored = function(){
        return this.params.hasOwnProperty(IGNORE) && this.params[IGNORE] === true
    };

    this.params = {};
    this.isSet = false;	// allow to guess if config was really set or .set() method never called
}

/** Loads config from given Karma config file and return FakeConfig */
function loadConfigFromKarmaFile(path){
    var config = new FakeConfig();
    var karmaConfigModule = require(path);
    if(typeof karmaConfigModule === 'function') {
        karmaConfigModule(config);
    }
    return config;
}

/** Return all configurations with `CONFIG: true` params */
function getFocusedConfigs(configPathArray) {
    return configPathArray.filter(function(configPath){
        return loadConfigFromKarmaFile(configPath).isFocused();
    });
}

/** Return all configurations with `IGNORE: true` params */
function getIgnoredConfigs(configPathArray) {
    return configPathArray.filter(function(configPath){
        return loadConfigFromKarmaFile(configPath).isIgnored();
    });
}

function _objectForEach(obj, kvFunc){
    Object.keys(obj).forEach(function(key){
        var value = obj[key];
        kvFunc(key, value);
    })
}

function _objectFilter(obj, kvPredicate){
    var filteredObj = {};
    _objectForEach(obj, function(key, value){
        if(kvPredicate(key, value)) {
            filteredObj[key] = value;
        }
    });
    return filteredObj;
}

/**
 *
 * @param params is an object
 * {
 *   runFocusedIgnored: true,       // will run configurations marked both with FOCUS and IGNORE
 *   notifyOnFocusedIgnored: true,  // will write few lines in console about collision
 *   multiFocus: true               // will run multiple confs with FOCUS if true. Otherwise will return error
 * }
 */
function getActiveConfigurations(configPathArray, params){
    var runFocusedIgnored       = params && params.hasOwnProperty('runFocusedIgnored') ? params.runFocusedIgnored : false;
    var notifyOnFocusedIgnored  = params && params.hasOwnProperty('notifyOnFocusedIngored') ? params.notifyOnFocusedIgnored : true;
    var multiFocus              = params && params.hasOwnProperty('multiFocus') ? params.multiFocus : false;

    var focusedConfigs = getFocusedConfigs(configPathArray);
    var ignoredConfigs = getIgnoredConfigs(configPathArray);
    var focusedExists = focusedConfigs.length !== 0;        // checking if there at least one config marked with focused

    if(!focusedExists) {    // if no focused config - marking all config to be focused.
        focusedConfigs = configPathArray;
    }

    var configSetArray = {};
    focusedConfigs.forEach(function(conf){
        configSetArray[conf] = {
            focused: true,
            ignored: false
        };
    });

    ignoredConfigs.forEach(function(conf){
        var existedConf = configSetArray[conf] || {};
        existedConf.ignored = true;
        existedConf.focused = existedConf.focused || false;
        configSetArray[conf] = existedConf;
    });

    var confsToRun = _objectFilter(configSetArray, function(key, confSet){
        if(confSet.focused && !confSet.ignored) {       // just marked with focused - definetly running
            return true;
        } else if(confSet.focused && confSet.ignored) { // marked both with focused and ingore. Consulting external params
            return runFocusedIgnored;
        } else {                // not marked to be focused
            return false;
        }
    });

    console.log("### confsToRun: " + JSON.stringify(confsToRun));
    // TODO: maybe not all ways considered here...
    if(!focusedExists || multiFocus || confsToRun.length <= 1) {    // there wasn't really focused config. All config from focused was just not marked with anything or multifocus allowed or there is one or less items
        return confsToRun;                // return as is
    } else if(confsToRun.length > 1 && !multiFocus) {   // if there are more than one element and no multifocus - return nothing
        return [];
    }
}


module.exports = {
    FakeConfig:                 FakeConfig,
    loadConfigFromKarmaFile:    loadConfigFromKarmaFile,
    getFocusedConfigs:          getFocusedConfigs,
    getIgnoredConfigs:          getIgnoredConfigs,
    getActiveConfigs:           getActiveConfigurations
};