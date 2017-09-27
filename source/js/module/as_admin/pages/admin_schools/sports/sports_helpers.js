
const SportsHelpers = {
    SPORTS_PAGE: '/sports',
    redirectToSportsPage: function() {
        const self = this;

        document.location.hash = self.SPORTS_PAGE
    },
    clientPointDisplayArray: [
    	'plain',
		'time',
		'distance',
        'presence only'
	],
    clientScoringArray: [
        'More scores',
        'Less scores',
        'More time',
        'Less time',
        'More result',
        'Less result',
        'First to n points'
    ],
    clientPlayersArray: [
        '1x1',
        '2x2',
        'Individual',
        'Team'
    ],
	pointsDisplayServerToClientMap: {
    	'PLAIN': 	'plain',
		'TIME': 	'time',
		'DISTANCE':	'distance',
		'PRESENCE_ONLY': 'presence only'
	},
	pointsDisplayClientToServerMap: {
		'plain': 	'PLAIN',
		'time': 	'TIME',
		'distance':	'DISTANCE',
		'presence only': 'PRESENCE_ONLY'
	},
    playersServerToClientMap: {
        '1X1':          '1x1',
        '2X2':          '2x2',
        'INDIVIDUAL':   'Individual',
        'TEAM':         'Team'
    },
    playersClientToServerMap: {
        '1x1':          '1X1',
        '2x2':          '2X2',
        'Individual':   'INDIVIDUAL',
        'Team':         'TEAM'
    },
    scoringServerToClientMap: {
        'MORE_SCORES':          'More scores',
        'LESS_SCORES':          'Less scores',
        'MORE_TIME':            'More time',
        'LESS_TIME':            'Less time',
        'MORE_RESULT':          'More result',
        'LESS_RESULT':          'Less result',
        'FIRST_TO_N_POINTS':    'First to n points'
    },
    scoringClientToServerMap: {
        'More scores':          'MORE_SCORES',
        'Less scores':          'LESS_SCORES',
        'More time':            'MORE_TIME',
        'Less time':            'LESS_TIME',
        'More result':          'MORE_RESULT',
        'Less result':          'LESS_RESULT',
        'First to n points':    'FIRST_TO_N_POINTS'
    },
    getDefaultScoringClientValue: function() {
        return this.clientScoringArray[0];
    },
    getDefaultPlayersClientValue: function() {
        return this.clientPlayersArray[0];
    },
	getDefaultDisplayPointsClientValue: function(){
    	return this.clientPointDisplayArray[0];
	},
    /**
     * Get data from object by path.
     * Function converts data to acceptable format for form.
     * Data on input can be value, undefined or null. Data on output - value, undefined.
     * @param object
     * @param path
     * @returns {*}
     */
    getData: function(object, path) {
        const pathParts = path.split('.');
        let data = Object.assign({}, object);

        //digging
        for(let i = 0; i < pathParts.length; i++) {
            let pathPart = pathParts[i];
            if(data[pathPart] !== undefined && data[pathPart] !== null) {
                data = data[pathPart];
            } else {
                data = undefined;
                break;
            }
        }

        return data;
    },
    getEmptyFromData: function() {
        const self = this;

        return {
            name:                           undefined,
            description:                    undefined,
            minPlayers:                     undefined,
            maxPlayers:                     undefined,
            maxSubs:                        undefined,
            genders:                        {
                                                 femaleOnly: true,
                                                 maleOnly:   true,
                                                 mixed:      true
                                            },
            scoring:                        self.getDefaultScoringClientValue(),
            players:                        self.getDefaultPlayersClientValue(),
            field:                          {
                                                positions:  []
                                            },
            icon:                           undefined,
            pointsName:                     undefined,
            pointsNamePlural:               undefined,
            pointsStep:                     undefined,
			pointsDisplay:					self.getDefaultDisplayPointsClientValue(),
			pointsInputMask: 				undefined,
			performance:                    [],
            discipline:                     [],
            fieldPic:                       undefined,
            individualResultsAvailable:     true,
			multiparty:						true
        };
    },
    convertServerDataToFormData: function(serverData) {
        const self = this;

        let formData = self.getEmptyFromData();

        formData.name                       = self.getData(serverData, 'name');
        formData.description                = self.getData(serverData, 'description');
        formData.icon                       = self.getData(serverData, 'icon');
        formData.minPlayers                 = self.getData(serverData, 'defaultLimits.minPlayers');
        formData.maxPlayers                 = self.getData(serverData, 'defaultLimits.maxPlayers');
        formData.minSubs                    = self.getData(serverData, 'defaultLimits.minSubs');
        formData.maxSubs                    = self.getData(serverData, 'defaultLimits.maxSubs');
        formData.pointsName                 = self.getData(serverData, 'points.name');
        formData.pointsNamePlural           = self.getData(serverData, 'points.namePlural');
        formData.pointsStep                 = self.getData(serverData, 'points.pointsStep');
		formData.pointsDisplay 				= self.pointsDisplayServerToClientMap[self.getData(serverData, 'points.display')];
		formData.pointsInputMask 			= self.getData(serverData, 'points.inputMask');
		formData.genders                    = self.getData(serverData, 'genders');
        formData.discipline                 = self.getData(serverData, 'discipline');
        formData.performance                = self.getData(serverData, 'performance');
        formData.scoring                    = self.scoringServerToClientMap[self.getData(serverData, 'scoring')];
        formData.players                    = self.playersServerToClientMap[self.getData(serverData, 'players')];
        formData.field                      = self.getData(serverData, 'field');
        formData.fieldPic                   = self.getData(serverData, 'field.pic');
        formData.individualResultsAvailable = self.getData(serverData, 'individualResultsAvailable');
        formData.multiparty 				= self.getData(serverData, 'multiparty');

        return formData;
    },
    convertFormDataToServerData: function(dataFromForm) {
        const self = this;

        // this is a little hack
        // we ignore user min/maxPlayers value if players type 1x1 or 2x2
        let minPlayers, maxPlayers;
        switch (dataFromForm.players) {
            case '1x1':
                minPlayers = 1;
                maxPlayers = 1;
                break;
            case '2x2':
                minPlayers = 2;
                maxPlayers = 2;
                break;
            default:
                minPlayers = dataFromForm.minPlayers;
                maxPlayers = dataFromForm.maxPlayers;
                break;
        }

        let dataToPost = {
            name:                       dataFromForm.name,
            description:                dataFromForm.description,
            defaultLimits:              {
                                            minPlayers:  minPlayers,
                                            maxPlayers:  maxPlayers,
                                            minSubs:     dataFromForm.minSubs,
                                            maxSubs:     dataFromForm.maxSubs
                                        },
            scoring:                    self.scoringClientToServerMap[dataFromForm.scoring],
            players:                    self.playersClientToServerMap[dataFromForm.players],
            genders:                    dataFromForm.genders,
            points:                     {
                                            name:       dataFromForm.pointsName,
                                            namePlural: dataFromForm.pointsNamePlural,
                                            pointsStep: dataFromForm.pointsStep,
											display:	self.pointsDisplayClientToServerMap[dataFromForm.pointsDisplay],
											inputMask: 	dataFromForm.pointsInputMask
                                        },
            discipline:                 self.filterEmptyDisciplineItems(dataFromForm.discipline),
            performance:                self.filterEmptyPerformanceItems(dataFromForm.performance.map(item => {

                                            return {
                                                name:       item.name,
                                                //TODO remove this dirty magic
                                                minValue:   parseInt(item.minValue) !== NaN ? parseInt(item.minValue) : '',
                                                maxValue:   parseInt(item.maxValue) !== NaN ? parseInt(item.maxValue) : ''
                                            }
                                        })),
            field:                      dataFromForm.field,
            icon:                       dataFromForm.icon,
            individualResultsAvailable: dataFromForm.individualResultsAvailable,
			multiparty: 				dataFromForm.multiparty
        };

        dataToPost.field.positions = self.filterEmptyPositionsItems(dataFromForm.field.positions);
        dataToPost.field.pic = dataFromForm.fieldPic;

        return dataToPost;
    },
	/**
     * Function validate custom form fields - positions, discipline, performance.
     * It's necessary because our form react component can't validate these form fields.
     * @param data
     * @returns {boolean}
     */
    isCustomFieldsError: function(data) {
        const positionsErrorItem = data.field.positions.filter(item => {
            return item.nameError || item.descriptionError;
        });

        const disciplineErrorItem = data.discipline.filter(item => {
            return item.nameError || item.namePluralError || item.descriptionError;
        });

        const performanceErrorItem = data.performance.filter(item => {
            return item.nameError || item.minValueError || item.maxValueError;
        });

        return !(positionsErrorItem.length === 0 && disciplineErrorItem.length === 0 && performanceErrorItem.length === 0);
    },
	/**
     * Function return true if position item haven't data. Just look at code.
     * @private
     */
    isEmptyPositionItem: function(item) {
        return (
            item.name.trim() === ''&&
            item.description.trim() === ''
        );
    },
    /**
     * Function return true if discipline item haven't data. Just look at code.
     * @private
     */
    isEmptyDisciplineItem: function(item) {
        return (
            item.name.trim() === ''&&
            item.namePlural.trim() === ''&&
            item.description.trim() === ''
        );
    },
    /**
     * Function return true if performance item haven't data. Just look at code.
     * @private
     */
    isEmptyPerformanceItem: function(item) {
        return (
            item.name.trim() === ''&&
            item.minValue.trim() === ''&&
            item.maxValue.trim() === ''
        );
    },
	/**
     * Return only non empty position items
     * @param positions
     * @returns {*}
     */
    filterEmptyPositionsItems: function(positions) {
        const self = this;

        return positions.filter(position => !self.isEmptyPositionItem(position));
    },
    /**
     * Return only non empty performance items
     * @param positions
     * @returns {*}
     */
    filterEmptyPerformanceItems: function(performance) {
        const self = this;

        return performance.filter(performanceItem => !self.isEmptyPerformanceItem(performanceItem));
    },
    /**
     * Return only non empty discipline items
     * @param positions
     * @returns {*}
     */
    filterEmptyDisciplineItems: function(discipline) {
        const self = this;

        return discipline.filter(disciplineItem => !self.isEmptyDisciplineItem(disciplineItem));
    },
    validate: function(name, value, isRequired, type) {
        const self = this;

        const _value = value || '';

        if(self.isGoToValidation(_value, isRequired)) {
            switch (type) {
                case 'text':
                    return self.validateText(name, _value, isRequired);
                case 'number':
                    return self.validateNumber(name, _value, isRequired);
            }
        } else {
            return false;
        }
    },
    validateText: function(name, value, isRequired) {
        const _value = value.trim();

        switch (true) {
            case (isRequired && _value === ''):
                return `Please enter your ${name}`;
            case ((!isRequired || isRequired) && _value !== ''):
                if (/[^a-zA-Z0-9,\.\(\) \-\/]+$/.test(_value)) {
                    return 'Should contain only alphanumeric characters';
                } else {
                    return false;
                }
        }
    },
    validateNumber: function(name, value, isRequired) {
        const _value = value.trim();

        switch (true) {
            case (isRequired && _value === ''):
                return `Please enter your ${name}`;
            case ((!isRequired || isRequired) && _value !== ''):
                if (/[^0-9]+$/.test(_value)) {
                    return 'Should be number';
                } else {
                    return false;
                }
        }
    },
    isGoToValidation: function(value, isRequired) {
        return !(!isRequired && value.trim && value.trim() === '');
    }
};

module.exports = SportsHelpers;