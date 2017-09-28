const GenderHelper = {
	getDefaultGender: function (sport) {
		switch (true) {
			case sport.genders.maleOnly && sport.genders.femaleOnly && sport.genders.mixed:
				return undefined;
			case sport.genders.maleOnly && sport.genders.femaleOnly && !sport.genders.mixed:
				return undefined;
			case sport.genders.femaleOnly:
				return 'femaleOnly';
			case sport.genders.maleOnly:
				return 'maleOnly';
			case sport.genders.mixed:
				return undefined;
		}
	}
};

module.exports = GenderHelper;