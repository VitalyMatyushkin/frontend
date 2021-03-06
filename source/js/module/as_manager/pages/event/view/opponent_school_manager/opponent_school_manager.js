const	React						= require('react'),
		Morearty					= require('morearty'),
		Immutable					= require('immutable'),
		{Autocomplete}				= require('../../../../../ui/autocomplete2/OldAutocompleteWrapper'),
		{ConfirmPopup}				= require('module/ui/confirm_popup'),
		GeoSearchHelper				= require('../../../../../helpers/geo_search_helper'),
		{SchoolListItem}			= require('../../../../../ui/autocomplete2/custom_list_items/school_list_item/school_list_item'),
		{LocalEventHelper}          = require('module/as_manager/pages/events/eventHelper'),
		{If}						= require('../../../../../ui/if/if'),
		propz						= require('propz'),
		EventFormConsts 			= require('module/as_manager/pages/events/manager/event_form/consts/consts'),
		ChangeOpponentSchoolStyle	= require('../../../../../../../styles/ui/b_change_opponent_school_popup.scss');

const OpponentSchoolManager = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:		React.PropTypes.string.isRequired,
		opponentSchoolId:	React.PropTypes.string,
		mode:				React.PropTypes.string.isRequired,
		schoolType:			React.PropTypes.string.isRequired,
		onReload:			React.PropTypes.func.isRequired
	},
	componentWillMount: function() {
		this.getDefaultBinding().atomically()
			.set('distance',			Immutable.fromJS(LocalEventHelper.distanceItems[0].id))
			.set('schoolSelectorKey',	Immutable.fromJS(this.getRandomString()))
			.commit();
	},
	componentWillUnmount: function() {
		this.getDefaultBinding().sub('opponentSchoolManager').clear();
	},
	getHeaderText: function() {
		switch (this.props.mode) {
			case 'REPLACE':
				return 'Change Opponent';
			case 'ADD':
				return 'Add School';
		}
	},
	getRandomString: function() {
		// just current date in timestamp view
		return + new Date();
	},
	handleClickOkButton: function() {
		const	binding				= this.getDefaultBinding(),
				activeSchoolId		= this.props.activeSchoolId,
				activeSchoolInfo	= binding.toJS('activeSchoolInfo'),
				opponentSchoolId	= this.props.opponentSchoolId,
				event				= binding.toJS('model'),
				newSchool			= binding.toJS('opponentSchoolManager.opponentSchoolInput.school');

		let promises = [];
		if(this.props.mode === 'REPLACE') {
			promises.push(
				window.Server.schoolEventOpponents
					.delete(
						{
							schoolId	: activeSchoolId,
							eventId		: event.id
						}, {
							invitedSchoolIds: [opponentSchoolId]
						}
					)
					.then(() =>
						window.Server.schoolEventOpponents.post(
						{
							schoolId	: activeSchoolId,
							eventId		: event.id
						}, {
							invitedSchoolIds: [newSchool.id]
						}
					))
			);
		} else {
			// just add new school
			promises.push(
				window.Server.schoolEventOpponents.post(
					{
						schoolId	: activeSchoolId,
						eventId		: event.id
					}, {
						invitedSchoolIds: [newSchool.id]
					}
				)
			);
		}

		// change school on server
		Promise
			.all(promises)
			.then(() => {
				if(this.props.mode === 'REPLACE') {
					const	venueType				= this.getVenueType(),
							newSchoolPostcodeId		= propz.get(newSchool, ['postcodeId']),
							activeSchoolPostcodeId	= propz.get(activeSchoolInfo, ['postcodeId']);

					switch (true) {
						case (
							venueType === 'AWAY' &&
							typeof newSchoolPostcodeId === 'undefined' &&
							typeof activeSchoolPostcodeId === 'undefined'
						):
							return this.updateEventVenuePostcode(activeSchoolId, event.id, 'TBD');
						case venueType === 'AWAY' && typeof newSchoolPostcodeId !== 'undefined':
							return this.updateEventVenuePostcode(activeSchoolId, event.id, 'AWAY', newSchoolPostcodeId);
						case venueType === 'AWAY' && typeof newSchoolPostcodeId === 'undefined':
							return this.updateEventVenuePostcode(activeSchoolId, event.id, 'HOME', activeSchoolPostcodeId);
						default:
							return true;
					}
				} else {
					return Promise.resolve(true);
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

		binding.set('opponentSchoolManager.isOpen', false);
	},
	handleChangeOpponentSchool: function(id, model) {
		const binding = this.getDefaultBinding();

		binding.set('opponentSchoolManager.opponentSchoolInput.school', Immutable.fromJS(model));
	},
	serviceSchoolFilter: function(schoolName) {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				activeSchoolInfo	= binding.toJS('activeSchoolInfo'),
				postcode			= activeSchoolInfo.postcode,
				distance			= binding.toJS('distance'),
				region				= activeSchoolInfo.region,
				event				= binding.toJS('model');

		const nin = event.invitedSchoolIds.concat(this.props.activeSchoolId);

		const filter = {
			filter: {
				where: {
					id: {
						$nin: nin
					},
					name: {
						like: schoolName,
						options: 'i'
					}
				},
				limit: 20
			}
		};

		// user geo search or not
		if(typeof postcode !== 'undefined') {
			filter.filter.where['postcode.point'] = GeoSearchHelper.getMainGeoSchoolFilterByParams(distance, postcode.point)
		} else {
			filter.filter.order = "name ASC";
		}

		if(typeof region !== 'undefined') {
			filter.filter.where['region'] = region;
		}

		if (this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION) {
			return window.Server.schoolUnionSchools.get({schoolUnionId: activeSchoolInfo.id}, filter);
		} else {
			return window.Server.publicSchools.get(filter);
		}
	},
	isShowDistanceSelector: function() {
		const	binding				= this.getDefaultBinding(),
				activeSchoolInfo	= binding.toJS('activeSchoolInfo'),
				postcode			= activeSchoolInfo.postcode;

		return typeof postcode !== 'undefined';
	},
	isOkButtonDisabled: function() {
		return typeof this.getDefaultBinding().toJS('opponentSchoolManager.opponentSchoolInput.school') === 'undefined';
	},
	getDistanceItems: function() {
		return LocalEventHelper.distanceItems.map(item => {
			return (
				<option	value	= { item.id }
						key		= { item.id }
				>
					{item.text}
				</option>
			);
		});
	},
	getOkButtonText: function() {
		switch (this.props.mode) {
			case 'ADD':
				return "Add school";
			case 'REPLACE':
				return "Change opponent";
		}
	},
	handleChangeDistance: function(eventDescriptor) {
		const binding = this.getDefaultBinding();

		binding.atomically()
			.set('opponentSchoolManager.opponentSchoolInput.school',	undefined)
			.set('schoolSelectorKey',									Immutable.fromJS(this.getRandomString()))
			.set('distance',											eventDescriptor.target.value)
			.commit();
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const distance = binding.toJS('distance');

		return (
			<ConfirmPopup	okButtonText			= {this.getOkButtonText()}
							cancelButtonText		= "Back"
							isOkButtonDisabled		= {this.isOkButtonDisabled()}
							handleClickOkButton		= {this.handleClickOkButton}
							handleClickCancelButton	= {this.closeSavingChangesModePopup}
							customStyle				= {'contentWidth'}
			>
				<div className='bChangeOpponentSchoolPopup'>
					<h1 className="eChangeOpponentSchoolPopup_header">
						{this.getHeaderText()}
					</h1>
					<If condition={this.isShowDistanceSelector()}>
						<div className="bInputWrapper mZeroHorizontalMargin">
							<div className="bInputLabel">
								Maximum distance
							</div>
							<select	className		= "bDropdown"
									defaultValue	= {LocalEventHelper.distanceItems[0].id}
									value			= {distance}
									onChange		= {self.handleChangeDistance}
							>
								{self.getDistanceItems()}
							</select>
						</div>
					</If>
					<div className="bInputWrapper mZeroHorizontalMargin">
						<div className="bInputLabel">
							Opponent school
						</div>
						<Autocomplete	key				= {binding.toJS('schoolSelectorKey')}
										defaultItem		= {binding.toJS('opponentSchoolManager.school')}
										customListItem	= {SchoolListItem}
										serviceFilter	= {this.serviceSchoolFilter}
										serverField		= "name"
										placeholder		= "enter school name"
										onSelect		= {this.handleChangeOpponentSchool}
										extraCssStyle	= "ePopup mBigSize mWhiteBG"
						/>
					</div>
				</div>
			</ConfirmPopup>
		);
	}
});

module.exports = OpponentSchoolManager;