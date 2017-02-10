const TeamHelper = require('./../ui/managers/helpers/team_helper');

const EventResultHelper = {
	/**
	 * !! Function modify event object !!
	 * Initialize event results.
	 * It means:
	 * 1) Set zero points to appropriate score bundle(schools score, teams score, houses score and etc.)
	 * 2) Backup init state of results for revert changes in scores if it will be need.
	 * @param event
	 */
	initializeEventResults: function(event) {
		if(TeamHelper.isTeamSport(event) || TeamHelper.isOneOnOneSport(event)) {
			TeamHelper.callFunctionForLeftContext(
				this.activeSchoolId,
				event,
				this.getInitResults.bind(this, event)
			);
			TeamHelper.callFunctionForRightContext(
				this.activeSchoolId,
				event,
				this.getInitResults.bind(this, event)
			);
		}
	},
	getInitResults: function(event, teamBundleName, order) {
		let	scoreBundleName,
			resultIdFieldName,
			dataBundleIdFieldName,
			dataBundle;

		switch (teamBundleName) {
			case 'schoolsData':
				scoreBundleName			= 'schoolScore';
				resultIdFieldName		= 'schoolId';
				dataBundleIdFieldName	= 'id';
				dataBundle				= event[teamBundleName];
				break;
			case 'housesData':
				scoreBundleName			= 'houseScore';
				resultIdFieldName		= 'houseId';
				dataBundleIdFieldName	= 'id';
				dataBundle				= event[teamBundleName];
				break;
			case 'teamsData':
				scoreBundleName			= 'teamScore';
				resultIdFieldName		= 'teamId';
				dataBundleIdFieldName	= 'id';
				dataBundle				= event[teamBundleName];
				break;
			case 'individualsData':
				scoreBundleName			= 'individualScore';
				resultIdFieldName		= 'userId';
				dataBundleIdFieldName	= 'userId';
				dataBundle				= event.individualsData;
				break;
		}

		if(typeof dataBundle[order] !== 'undefined') {
			const scoreData = event.results[scoreBundleName].find(r => r[resultIdFieldName] === dataBundle[order][dataBundleIdFieldName]);

			if(typeof scoreData === 'undefined') {
				const newScoreData = {};
				newScoreData[resultIdFieldName]	= dataBundle[order][dataBundleIdFieldName];
				newScoreData.score				= 0;
				if(teamBundleName === 'individualsData') {
					newScoreData.permissionId = dataBundle[order].permissionId;
				}

				event.results[scoreBundleName].push(newScoreData);
			}
		}
	}
};

module.exports = EventResultHelper;