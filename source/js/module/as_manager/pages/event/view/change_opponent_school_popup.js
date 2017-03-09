const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		Autocomplete	= require('./../../../../ui/autocomplete2/OldAutocompleteWrapper'),
		ConfirmPopup	= require('./../../../../ui/confirm_popup'),
		classNames		= require('classnames'),
		propz			= require('propz');

const ChangeOpponentSchoolPopup = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		onReload:		React.PropTypes.func.isRequired
	},
	handleClickOkButton: function() {
		const	binding				= this.getDefaultBinding(),
				activeSchoolId		= this.props.activeSchoolId,
				activeSchoolInfo	= binding.toJS('activeSchoolInfo'),
				event				= binding.toJS('model'),
				newSchool			= binding.toJS('autocompleteChangeOpponentSchool.school');

		// change school in event
		event.invitedSchools = [newSchool];
		event.invitedSchoolIds = [newSchool.id];

		binding.set('model', Immutable.fromJS(event));

		// change school on server
		window.Server.schoolEventChangeOpponent.post(
			{
				schoolId	: activeSchoolId,
				eventId		: event.id
			}, {
				invitedSchoolIds: event.invitedSchoolIds
			}
		)
		.then(() => {
			const	venueType				= this.getVenueType(),
					newSchoolPostcodeId		= propz.get(newSchool, ['postcodeId']),
					activeSchoolPostcodeId	= propz.get(activeSchoolInfo, ['postcodeId']);

			switch (true) {
				case venueType === 'AWAY' && typeof newSchoolPostcodeId === 'undefined' && typeof activeSchoolPostcodeId === 'undefined':
					return this.updateEventVenuePostcode(activeSchoolId, event.id, 'TBD');
				case venueType === 'AWAY' && typeof newSchoolPostcodeId !== 'undefined':
					return this.updateEventVenuePostcode(activeSchoolId, event.id, 'AWAY', newSchoolPostcodeId);
				case venueType === 'AWAY' && typeof newSchoolPostcodeId === 'undefined':
					return this.updateEventVenuePostcode(activeSchoolId, event.id, 'HOME', activeSchoolPostcodeId);
				default:
					return true;
			}
		})
		.then(() => {
			this.closeSavingChangesModePopup();
			this.props.onReload();
		});
	},
	/**
	 * Server side.
	 * Function update event venue.
	 * @param activeSchoolId
	 * @param eventId
	 * @param venueType
	 * @param postcodeId - can be undefined
	 */
	updateEventVenuePostcode: function(activeSchoolId, eventId, venueType, postcodeId) {
		const body = {
			venue: {
				venueType: venueType
			}
		};

		if(venueType !== 'TBD') {
			body.venue.postcodeId = postcodeId;
		}

		window.Server.schoolEvent.put(
			{
				schoolId	: activeSchoolId,
				eventId		: eventId
			},
			body
		)
	},
	getVenueType: function() {
		const	binding	= this.getDefaultBinding(),
				model	= binding.toJS('model');

		return propz.get(model, ['venue', 'venueType']);
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
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event	= binding.toJS('model');

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