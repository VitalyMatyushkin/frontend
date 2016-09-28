const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		FixtureListItem		= require('./../school_home/fixture_item'),
		TeamHelper			= require('./../../../ui/managers/helpers/team_helper'),
		EventResultHelper	= require('./../../../helpers/event_result_helper'),
		PublicEventTeams	= require('./public_event_teams');

const PublicEvent = React.createClass({
	mixins: [Morearty.Mixin],

	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			model:		{},
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

			binding
				.atomically()
				.set('model',	Immutable.fromJS(event))
				.set('sync',	Immutable.fromJS(true))
				.commit();

			return event;
		})
	},
	handleClickGoBack: function() {
		document.location.hash = 'home';
	},
	render: function() {
		if(this.getDefaultBinding().toJS('sync')) {
			return (
				<div className="bPublicEvent">
					<div	onClick		={ this.handleClickGoBack }
							className	="bBigButton"
					>
						Go Back
					</div>
					<FixtureListItem	event			= { this.getDefaultBinding().toJS('model') }
										activeSchoolId	= { this.props.activeSchoolId }
					/>
					<PublicEventTeams binding={ this._getEventTeamsBinding() } />
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = PublicEvent;
