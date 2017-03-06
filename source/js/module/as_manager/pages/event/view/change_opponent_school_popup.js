const	EventHelper					= require('module/helpers/eventHelper'),
		If							= require('../../../../ui/if/if'),
		TeamHelper					= require('./../../../../ui/managers/helpers/team_helper'),
		PencilButton				= require('./../../../../ui/pencil_button'),
		Sport						= require('module/ui/icons/sport_icon'),
		Score						= require('./../../../../ui/score/score'),
		Autocomplete				= require('./../../../../ui/autocomplete2/OldAutocompleteWrapper'),
		Morearty					= require('morearty'),
		MoreartyHelper				= require('module/helpers/morearty_helper'),
		Immutable					= require('immutable'),
		React						= require('react'),
		ConfirmPopup				= require('./../../../../ui/confirm_popup'),

		classNames					= require('classnames');

const ChangeOpponentSchoolPopup = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	handleClickOkButton: function() {
		const binding = this.getDefaultBinding();

		const	event		= binding.toJS('model'),
				newSchool	= binding.toJS('autocompleteChangeOpponentSchool.school');

		// change school in event
		event.invitedSchools = [newSchool];
		event.invitedSchoolIds = [newSchool.id];

		binding.set('model', Immutable.fromJS(event));

		// change school on server
		window.Server.schoolEventChangeOpponent.post(
			{
				schoolId	: this.props.activeSchoolId,
				eventId		: event.id
			}, {
				invitedSchoolIds: event.invitedSchoolIds
			}
		)
		.then(() => this.closeSavingChangesModePopup());
	},
	closeSavingChangesModePopup: function() {
		const binding = this.getDefaultBinding();

		binding.set('isChangeOpponentSchoolPopupOpen', false);
	},
	handleChangeOpponentSchool: function(id, model) {
		const binding = this.getDefaultBinding();

		binding.set('autocompleteChangeOpponentSchool.school', Immutable.fromJS(model));
	},
	serviceSchoolFilter: function(schoolName) {
		const   self        = this,
				binding     = self.getDefaultBinding();

		const	event		= binding.toJS('model');

		let schools;

		const filter = {
			filter: {
				where: {
					id: {
						$nin: [this.props.activeSchoolId, event.invitedSchoolIds[0]]
					},
					name: { like: schoolName }
				},
				order:"name ASC",
				limit: 400
			}
		};

		return window.Server.publicSchools.get(filter);
	},
	getTBDSchool: function() {
		const filter = {
			filter: {
				where: {
					name: { like: "TBD" }
				}
			}
		};
		return window.Server.publicSchools.get(filter);
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<ConfirmPopup	okButtonText			= "Change opponent"
							cancelButtonText		= "Back"
							isOkButtonDisabled		= {false}
							handleClickOkButton		= {this.handleClickOkButton}
							handleClickCancelButton	= {this.closeSavingChangesModePopup}
			>
				<div>
					Change opponent
					<Autocomplete	defaultItem		= {binding.toJS('autocompleteChangeOpponentSchool.school')}
									serviceFilter	= {this.serviceSchoolFilter}
									serverField		= "name"
									placeholder		= "enter school name"
									onSelect		= {this.handleChangeOpponentSchool}
									binding			= {binding.sub('autocompleteChangeOpponentSchool')}
									extraCssStyle	= "ePopup mBigSize"
					/>
				</div>
			</ConfirmPopup>
		);
	}
});

module.exports = ChangeOpponentSchoolPopup;