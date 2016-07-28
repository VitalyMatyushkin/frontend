
const SportsHelpers = {
    SPORTS_PAGE: 'admin_schools/admin_views/sports',
    redirectToSportsPage: function() {
        const self = this;

        document.location.hash = self.SPORTS_PAGE
    },
    gendersMap: {
        male: {
            formFormat:'boys',
            serverFormat:['male']
        },
        female: {
            formFormat:'girls',
            serverFormat:['female']
        },
        all: {
            formFormat:'girls and boys',
            serverFormat:['female', 'male']
        }
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
    /**
     * Convert genders data from server to form format
     * Genders array => String
     * [male] || [female] || [male,female]  => male || female || male && female
     * @param genderArray
     * @returns
     */
    convertGendersToFormFormat: function(genderArray) {
        const self = this;
        let gender = undefined;

        if(genderArray !== null && genderArray !== undefined && genderArray.length != 0) {
            if(genderArray.length == 2) {
                gender = self.gendersMap.all.formFormat;
            } else if(genderArray.indexOf('male') !== -1) {
                gender = self.gendersMap.male.formFormat;
            } else if(genderArray.indexOf('female') !== -1) {
                gender = self.gendersMap.female.formFormat;
            }
        } else {
            gender = 'female and male';
        }

        return gender;
    },
    /**
     * Convert genders form format to server format
     * String => Genders array
     * male || female || male && female => [male] || [female] || [male,female]
     * @param genders
     * @returns {Array}
     */
    convertGendersToServerFormat: function(genders) {
        const self = this;
        let gendersArray = [];

        if(genders !== null && genders !== undefined) {
            switch (genders) {
                case self.gendersMap.male.formFormat:
                    gendersArray = self.gendersMap.male.serverFormat;
                    break;
                case self.gendersMap.female.formFormat:
                    gendersArray = self.gendersMap.female.serverFormat;
                    break;
                case self.gendersMap.all.formFormat:
                    gendersArray = self.gendersMap.all.serverFormat;
                    break;
            }
        }

        return gendersArray;
    },
    getEmptyFromData: function() {
        return {
            name:          undefined,
            description:   undefined,
            minPlayers:    undefined,
            maxPlayers:    undefined,
            maxSubs:       undefined,
            genders:       undefined,
            fieldPic:      undefined,
            positions:     []
        };
    },
    convertServerDataToFormData: function(serverData) {
        const self = this;

        let formData = self.getEmptyFromData();

        formData.name        = self.getData(serverData, 'name');
        formData.description = self.getData(serverData, 'description');
        formData.fieldPic    = self.getData(serverData, 'fieldPic');
        formData.minPlayers  = self.getData(serverData, 'limits.minPlayers');
        formData.maxPlayers  = self.getData(serverData, 'limits.maxPlayers');
        formData.maxSubs     = self.getData(serverData, 'limits.maxSubs');
        formData.genders     = SportsHelpers.convertGendersToFormFormat(self.getData(serverData, 'limits.genders'));

        let positions = self.getData(serverData, 'limits.positions');
        if(positions !== undefined) {
            formData.positions = positions;
        }

        return formData;
    },
    convertFormDataToServerData: function(dataFromForm) {
        const self = this;

        let dataToPost = {
            name:        dataFromForm.name,
            description: dataFromForm.description,
            fieldPic:    dataFromForm.fieldPic,
            limits: {
                minPlayers:  dataFromForm.minPlayers,
                maxPlayers:  dataFromForm.maxPlayers,
                maxSubs:     dataFromForm.maxSubs,
                positions:   dataFromForm.positions
            }
        };

        dataToPost.limits.genders = self.convertGendersToServerFormat(dataFromForm.genders);

        return dataToPost;
    }
};

module.exports = SportsHelpers;