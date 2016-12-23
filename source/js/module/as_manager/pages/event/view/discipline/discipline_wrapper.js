const	React		= require('react'),
		Immutable	= require('immutable'),
		Morearty	= require('morearty'),

		Discipline	= require('./discipline');

const DisciplineWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId : React.PropTypes.string.isRequired
	},
	/**
	 * Function return view mode for discipline component.
	 * View mode - player list and they discipline values.
	 * Edit mode - player list and they discipline values and possibility to change it.
	 */
	isEditMode: function() {
		// Edit mode only for closing mode.
		return this.getBinding('mode').toJS() === "closing";
	},
	isDataSync: function() {
		return this.getDefaultBinding().toJS('isSync');
	},
	getEvent: function() {
		return this.getBinding('event').toJS();
	},
	getPlayers: function() {
		return this.getDefaultBinding().toJS('viewPlayers.players')
	},
	disciplineItems: function() {
		const event = this.getEvent();

		if(typeof event.sport.discipline !== "undefined") {
			return event.sport.discipline;
		} else {
			return [];
		}
	},
	disciplineValues: function() {
		const event = this.getEvent();

		if(
			typeof event.results !== "undefined" &&
			typeof event.results.individualDiscipline !== "undefined"
		) {
			return event.results.individualDiscipline;
		} else {
			return [];
		}
	},
	handleChange: function(userId, permissionId, teamId, disciplineId, valueObject) {
		const disciplineValues = this.disciplineValues();

		const foundDisciplineValueIndex = disciplineValues.findIndex(disciplineValue => {
			return disciplineValue.userId === userId && disciplineValue.disciplineId === disciplineId;
		});

		if(foundDisciplineValueIndex === -1) {
			disciplineValues.push({
				userId			: userId,
				permissionId	: permissionId,
				teamId			: teamId,
				disciplineId	: disciplineId,
				value			: valueObject.value
			});
		} else {
			disciplineValues[foundDisciplineValueIndex].value = valueObject.value;
		}

		this.getBinding('event').set('results.individualDiscipline', Immutable.fromJS(disciplineValues));
	},
	render: function() {
		let body = null;

		if(this.isDataSync()) {
			body = (
				<Discipline		event				= {this.getEvent()}
								players				= {this.getPlayers()}
								disciplineItems		= {this.disciplineItems()}
								disciplineValues	= {this.disciplineValues()}
								isEditMode			= {this.isEditMode()}
								activeSchoolId		= {this.props.activeSchoolId}
								handleChange		= {this.handleChange}
				/>
			);
		}

		return body;
	}
});

module.exports = DisciplineWrapper;