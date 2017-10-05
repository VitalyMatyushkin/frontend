const	React						= require('react'),
		Morearty					= require('morearty'),
		Immutable					= require('immutable'),
	
		TeamHelper					= require('./../../../ui/managers/helpers/team_helper'),
		EventResultHelper			= require('./../../../helpers/event_result_helper'),
	
	
		PublicEventTeams			= require('./public_event_teams'),
		PublicMatchReport			= require('./public_match_report'),
		PublicEventGallery			= require('./public_event_gallery'),
		PublicEventHeaderSchool 	= require('./event_header/public_event_header'),
		Rivals						= require('module/as_manager/pages/event/view/rivals/rivals'),
		FixtureListItem				= require('module/as_school/pages/event/fixture_list_item'),
	
		ViewModeConsts				= require('module/ui/view_selector/consts/view_mode_consts');

const PublicEvent = React.createClass({
	mixins: [Morearty.Mixin],

	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			model:		{},
			report:		{},	// actually it should be part of model, but too much complex things happen in EventResultHelper.initializeEventResults(event);
			eventTeams: {},
			gallery:	{
				photos: []
			},
			sync:		false,
			mode:		'general',
			activeTab:	'teams',
			individualScoreAvailable: [
				{
					value: true
				},
				{
					value: true
				}
			]
		});
	},
	_getEventTeamsBinding: function() {
		const binding = this.getDefaultBinding();

		return {
			default						: binding.sub('eventTeams'),
			activeTab					: binding.sub('activeTab'),
			event						: binding.sub('model'),
			mode						: binding.sub('mode'),
			individualScoreAvailable	: binding.sub('individualScoreAvailable')
		};
	},
	componentWillMount: function() {
		const	rootBinding	= this.getMoreartyContext().getBinding(),
				binding		= this.getDefaultBinding();

		let report;

		binding.set('sync', Immutable.fromJS(false));

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
				schoolId:	this.props.activeSchoolId,
				eventId:	event.id
			}).then(_report => {
				report = _report;

				return window.Server.publicSchoolEventPhotos.get({
					schoolId:	this.props.activeSchoolId,
					eventId:	event.id
				});
			}).then(photos => {

				binding.atomically()
					.set('model',			Immutable.fromJS(event))
					.set('report',			Immutable.fromJS(report))
					.set('gallery.photos',	Immutable.fromJS(photos))
					.set('sync',			Immutable.fromJS(true))
					.commit();

				return event;
			});
		});
	},
	onClickViewMode: function(mode){
		const binding = this.getDefaultBinding();
		
		binding.set('viewMode', mode);
	},
	renderMatchReport: function() {
		const	binding	= this.getDefaultBinding(),
				report	= binding.toJS('report');

		const isReporting = report && report.content && report.content.length > 0;

		return isReporting ? <PublicMatchReport report={binding.toJS('report')} activeSchoolId={this.props.activeSchoolId} /> : null;
	},
	renderTeams: function() {
		const	binding		= this.getDefaultBinding(),
				viewMode 	= typeof binding.toJS('viewMode') !== 'undefined' ? binding.toJS('viewMode') : ViewModeConsts.VIEW_MODE.BLOCK_VIEW;

		const event = binding.toJS('model');

		//TODO it's temp. only for event refactoring period.
		if(TeamHelper.isNewEvent(event)) {
			return (
				<Rivals	binding									= { binding }
						viewMode								= { viewMode }
						activeSchoolId							= { this.props.activeSchoolId }
						handleClickOpponentSchoolManagerButton	= { () => {} }
						isShowControlButtons					= { false }
				/>
			);
		} else {
			return (
				<PublicEventTeams	binding			= { this._getEventTeamsBinding() }
									activeSchoolId	= { this.props.activeSchoolId }
				/>
			);
		}
	},
	render: function() {
		const 	binding		= this.getDefaultBinding(),
				isSync		= binding.get('sync'),
				event 		= binding.toJS('model'),
				viewMode 	= binding.toJS('viewMode');

		if(isSync) {
			return (
				<div className="bPublicEvent">
					<PublicEventHeaderSchool
						event			= { event }
						viewMode 		= { viewMode }
						onClickViewMode = { this.onClickViewMode }
					/>
					<FixtureListItem
						event			= { event }
						activeSchoolId	= { this.props.activeSchoolId }
					/>
					{ this.renderTeams() }
					<PublicEventGallery
						binding			= {binding.sub('gallery')}
					/>
					{ this.renderMatchReport() }
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = PublicEvent;
