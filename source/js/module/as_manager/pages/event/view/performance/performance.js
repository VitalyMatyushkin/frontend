const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		Promise 		= require('bluebird'),

		PerformanceView	= require('./performance_view'),
		PerformanceEdit	= require('./performance_edit');

const Performance = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	getPlayerPerformanceBinding: function() {
		return {
			default:	this.getBinding('eventTeams').sub('viewPlayers'),
			event:		this.getBinding('event')
		};
	},
	getPerformanceData: function() {
		return this.getBinding('event').toJS('results.individualPerformance');
	},
	getBackupPerformanceData: function() {
		return this.getDefaultBinding().toJS('backupIndividualPerformance');
	},
	isSync: function() {
		return this.getBinding('eventTeams').toJS('isSync');
	},
	isEditMode: function() {
		return this.getDefaultBinding().get('isEditMode');
	},
	getEvent: function() {
		return this.getBinding('event').toJS();
	},
	isNewPerformanceItem: function(performanceItem) {
		return typeof performanceItem._id === "undefined";
	},
	isPerformanceItemChanged: function(performanceItem) {
		return !this.isNewPerformanceItem(performanceItem) && performanceItem.isChanged;
	},
	createNewPerformanceItem: function(event, individualPerformanceItem) {
		return window.Server.schoolEventIndividualPerformance.post(
			{
				schoolId:	this.props.activeSchoolId,
				eventId:	event.id
			},
			individualPerformanceItem
		);
	},
	updatePerformanceItem: function (event, individualPerformanceItem) {
		return window.Server.schoolEventIndividualPerformancePoint.put(
			{
				schoolId			: this.props.activeSchoolId,
				eventId				: event.id,
				performancePointId	: individualPerformanceItem._id
			},
			{
				value: individualPerformanceItem.value
			}
		);
	},
	submitIndividualPerformance: function(event) {
		let promises = [];

		// create new performance items
		const newItemsArray = event.results.individualPerformance
			.filter(individualPerformanceItem => this.isNewPerformanceItem(individualPerformanceItem))
			.map(individualPerformanceItem => this.createNewPerformanceItem(event, individualPerformanceItem));

		// update performance items
		const updItemsArray = event.results.individualPerformance
			.filter(individualPerformanceItem => this.isPerformanceItemChanged(individualPerformanceItem))
			.map(individualPerformanceItem => this.updatePerformanceItem(event, individualPerformanceItem));

		return Promise.all([].concat(newItemsArray, updItemsArray));
	},
	changeViewMode: function() {
		this.getDefaultBinding().set(
			'isEditMode',
			!this.isEditMode()
		);
	},
	backupPerformanceData: function() {
		this.getDefaultBinding().set(
			'backupIndividualPerformance',
			Immutable.fromJS(this.getPerformanceData())
		);
	},
	restorePerformanceData: function() {
		this.getBinding('event').set(
			'results.individualPerformance',
			Immutable.fromJS(this.getBackupPerformanceData())
		);
	},
	clearBackupPerformanceDate: function() {
		this.getDefaultBinding().set('backupIndividualPerformance', undefined);
	},
	handleClickChangeMode: function() {
		if(!this.isEditMode()) {
			this.backupPerformanceData();
		}
		this.changeViewMode();
	},
	updateEventResultsFromServer: function() {
		const	eventBinding	= this.getBinding('event'),
				event			= eventBinding.toJS();

		return window.Server.schoolEvent.get(
			{
				schoolId:	this.props.activeSchoolId,
				eventId:	event.id
			}
		).then(_updEvent => {
			eventBinding.set('results', Immutable.fromJS(_updEvent.results));

			return true;
		});
	},
	onSave: function() {
		this.clearBackupPerformanceDate();
		this.submitIndividualPerformance(this.getEvent())
			.then(() => {
				return this.updateEventResultsFromServer();
			})
			.then(() => {
				this.changeViewMode();

				return true;
			});
	},
	onCancel: function() {
		this.restorePerformanceData();
		this.clearBackupPerformanceDate().then(() => {
			this.changeViewMode();
		});
	},
	render: function() {
		switch (true) {
			// Isn't sync
			case !this.isSync():
				return null;
			// Is edit mode
			case this.getDefaultBinding().get('isEditMode'):
				return (
					<PerformanceEdit	binding			= {this.getPlayerPerformanceBinding()}
										activeSchoolId	= {this.props.activeSchoolId}
										onSave			= {this.onSave}
										onCancel		= {this.onCancel}
					/>
				);
			// Is view mode
			case !this.getDefaultBinding().get('isEditMode'):
				return (
					<PerformanceView	binding					= {this.getPlayerPerformanceBinding()}
										activeSchoolId			= {this.props.activeSchoolId}
										handleClickChangeMode	= {this.handleClickChangeMode}
					/>
				);
		}
	}
});

module.exports = Performance;