const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),

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
	isSync: function() {
		return this.getBinding('eventTeams').toJS('isSync');
	},
	isEditMode: function() {
		return this.getDefaultBinding().get('isEditMode');
	},
	getEvent: function() {
		return this.getBinding('event').toJS();
	},
	submitIndividualPerformance: function(event) {
		const activeSchoolId = this.props.activeSchoolId;

		return Promise.all(
			event.results.individualPerformance.map(
				individualPerformanceData => window.Server.schoolEventIndividualPerformance.post(
					{
						schoolId:	activeSchoolId,
						eventId:	event.id
					},
					individualPerformanceData
				)
			)
		);
	},
	handleClickChangeMode: function() {
		this.getDefaultBinding().set(
			'isEditMode',
			!this.isEditMode()
		);
		// if user change tab to view mode
		if(!this.isEditMode()) {
			this.submitIndividualPerformance(this.getEvent())
		}
	},
	render: function() {
		switch (true) {
			// Isn't sync
			case !this.isSync():
				return null;
			// Is edit mode
			case this.getDefaultBinding().get('isEditMode'):
				return (
					<PerformanceEdit	binding					= {this.getPlayerPerformanceBinding()}
										handleClickChangeMode	= {this.handleClickChangeMode}
					/>
				);
			// Is view mode
			case !this.getDefaultBinding().get('isEditMode'):
				return (
					<PerformanceView	binding					= {this.getPlayerPerformanceBinding()}
										handleClickChangeMode	= {this.handleClickChangeMode}
					/>
				);
		}
	}
});

module.exports = Performance;