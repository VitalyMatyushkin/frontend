const	React		= require('react'),
		Immutable	= require('immutable'),
		Morearty	= require('morearty'),
		Promise 	= require('bluebird'),
		RoleHelper	= require('../../../../../helpers/role_helper'),
		Discipline	= require('./discipline');

const DisciplineWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId : React.PropTypes.string.isRequired
	},
	getDiscipline: function() {
		return this.getBinding('event').toJS('results.individualDiscipline');
	},
	getBackupDiscipline: function() {
		return this.getDefaultBinding().toJS('backupDiscipline');
	},
	backupDiscipline: function() {
		this.getDefaultBinding().set(
			'backupDiscipline',
			Immutable.fromJS(this.getDiscipline())
		);
	},
	restoreDiscipline: function() {
		this.getBinding('event').set(
			'results.individualDiscipline',
			Immutable.fromJS(this.getBackupDiscipline())
		);
	},
	clearBackupDiscipline: function() {
		this.getDefaultBinding().set(
			'backupDiscipline',
			undefined
		);
	},
	isEditMode: function() {
		return this.getDefaultBinding().toJS('isEditMode');
	},
	isDataSync: function() {
		return this.getBinding('eventTeams').toJS('isSync');
	},
	isNewDisciplineItem: function(disciplineItem) {
		return typeof disciplineItem._id === "undefined";
	},
	isDisciplineItemChanged: function(disciplineItem) {
		return !this.isNewDisciplineItem(disciplineItem) && disciplineItem.isChanged;
	},
	getEvent: function() {
		return this.getBinding('event').toJS();
	},
	getPlayers: function() {
		return this.getBinding('eventTeams').toJS('viewPlayers.players')
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
	createNewDisciplineItem: function(event, individualDisciplineItem) {
		window.Server.schoolEventIndividualDiscipline.post(
			{
				schoolId:	this.props.activeSchoolId,
				eventId:	event.id
			},
			individualDisciplineItem
		)
	},
	updateDisciplineItem: function(event, individualDisciplineItem) {
		window.Server.schoolEventIndividualDisciplinePoint.put(
			{
				schoolId:			this.props.activeSchoolId,
				eventId:			event.id,
				disciplinePointId:	individualDisciplineItem._id
			},
			{
				value: individualDisciplineItem.value
			}
		)
	},
	submitIndividualDiscipline: function(event) {
		let promises = [];

		// create new discipline items
		promises.push(
			event.results.individualDiscipline
				.filter(individualDisciplineItem => this.isNewDisciplineItem(individualDisciplineItem))
				.map(individualDisciplineItem => this.createNewDisciplineItem(event, individualDisciplineItem))
		);
		// update discipline items
		promises.push(
			event.results.individualDiscipline
				.filter(individualDisciplineItem => this.isDisciplineItemChanged(individualDisciplineItem))
				.map(individualDisciplineItem => this.updateDisciplineItem(event, individualDisciplineItem))
		);

		return Promise.all(promises);
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
			disciplineValues[foundDisciplineValueIndex].isChanged = true;
		}

		this.getBinding('event').set('results.individualDiscipline', Immutable.fromJS(disciplineValues));
	},
	changeViewMode: function() {
		this.getDefaultBinding().set(
			'isEditMode',
			!this.isEditMode()
		);
	},
	handleClickChangeMode: function() {
		if(!this.isEditMode()) {
			this.backupDiscipline();
		}
		this.changeViewMode();
	},
	onSave: function() {
		this.submitIndividualDiscipline(this.getEvent());
		this.clearBackupDiscipline();
		this.changeViewMode();
	},
	onCancel: function() {
		this.restoreDiscipline();
		this.clearBackupDiscipline();
		this.changeViewMode();
	},
	render: function() {
		let body = null;

		if(this.isDataSync()) {
			body = (
				<Discipline	role					= {RoleHelper.getLoggedInUserRole(this)}
							event					= {this.getEvent()}
							players					= {this.getPlayers()}
							disciplineItems			= {this.disciplineItems()}
							disciplineValues		= {this.disciplineValues()}
							isEditMode				= {this.isEditMode()}
							activeSchoolId			= {this.props.activeSchoolId}
							handleChange			= {this.handleChange}
							handleClickChangeMode	= {this.handleClickChangeMode}
							onSave					= {this.onSave}
							onCancel				= {this.onCancel}
				/>
			);
		}

		return body;
	}
});

module.exports = DisciplineWrapper;