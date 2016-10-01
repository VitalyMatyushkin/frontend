const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		FixtureListItem		= require('./../school_home/fixture_item'),
		TeamHelper			= require('./../../../ui/managers/helpers/team_helper'),
		EventResultHelper	= require('./../../../helpers/event_result_helper'),
		PublicEventTeams	= require('./public_event_teams'),
		PublicMatchReport 	= require('./public_match_report');

const PublicEvent = React.createClass({
	mixins: [Morearty.Mixin],

	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			model:		{},
			report:		{},	// actually it should be part of model, but too much complex things happen in EventResultHelper.initializeEventResults(event);
			albums:		[],
			sync:		false,
			mode:		'general',
			activeTab:	'teams'
		});
	},
	_getEventTeamsBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return {
			default:	binding.sub('eventTeams'),
			activeTab:	binding.sub('activeTab'),
			event:		binding.sub('model'),
			mode:		binding.sub('mode')
		};
	},
	componentWillMount: function() {
		const	rootBinding	= this.getMoreartyContext().getBinding(),
				binding		= this.getDefaultBinding();


		window.Server.publicSchoolEvent.get({
			schoolId:	this.props.activeSchoolId,
			eventId:	rootBinding.get('routing.pathParameters.0')
		}).then(event => {
			event.schoolsData = TeamHelper.getSchoolsData(event);
			event.teamsData = event.teamsData.sort((t1, t2) => {
				if(t1.name < t2.name) {
					return -1;
				}
				if(t1.name > t2.name) {
					return 1;
				}
				if(t1.name === t2.name) {
					return 0;
				}
			});
			event.housesData = event.housesData.sort((h1, h2) => {
				if(h1.name < h2.name) {
					return -1;
				}
				if(h1.name > h2.name) {
					return 1;
				}
				if(h1.name === h2.name) {
					return 0;
				}
			});
			// FUNCTION MODIFY EVENT OBJECT!!
			EventResultHelper.initializeEventResults(event);

			return window.Server.publicSchoolEventReport.get({
				schoolId: this.props.activeSchoolId,
				eventId: event.id
			}).then(report => {
				binding
					.atomically()
					.set('model',	Immutable.fromJS(event))
					.set('report',	Immutable.fromJS(report))
					.set('sync',	Immutable.fromJS(true))
					.commit();
				return event;
			});
		});
	},
	handleClickGoBack: function() {
		document.location.hash = 'home';
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				report	= binding.toJS('report');

		if(this.getDefaultBinding().toJS('sync')) {
			const isReporting = report && report.content && report.content.length > 0;
			return (
				<div className="bPublicEvent">
					<div onClick={ this.handleClickGoBack } className	="bBigButton">Go Back</div>
					<FixtureListItem	event			= { binding.toJS('model') }
										activeSchoolId	= { this.props.activeSchoolId }
					/>
					<PublicEventTeams binding={ this._getEventTeamsBinding() } />
					{isReporting ? <PublicMatchReport report={binding.toJS('report')} activeSchoolId={this.props.activeSchoolId} /> : null }
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = PublicEvent;
