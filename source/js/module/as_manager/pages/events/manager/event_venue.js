const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable');

const	propz				= require('propz'),
		Promise				= require('bluebird'),
		If					= require('../../../../ui/if/if'),
		Map					= require('../../../../ui/map/map2'),
		Autocomplete		= require('../../../../ui/autocomplete2/OldAutocompleteWrapper'),
		PlaceListItem		= require('../../../../ui/autocomplete2/custom_list_items/place_list_item/place_list_item'),
		PlacePopup			= require('./place_popup'),
		StarButton			= require('../../../../ui/star_button');

const	InputWrapperStyles	= require('./../../../../../../styles/ui/b_input_wrapper.scss'),
		InputLabelStyles	= require('./../../../../../../styles/ui/b_input_label.scss'),
		TextInputStyles		= require('./../../../../../../styles/ui/b_text_input.scss'),
		DropdownStyles		= require('./../../../../../../styles/ui/b_dropdown.scss');

const EventVenue = React.createClass({
	mixins: [Morearty.Mixin],

	DEFAULT_VENUE_POINT: { "lat": 50.832949, "lng": -0.246722 },

	propTypes: {
		eventType				: React.PropTypes.string.isRequired,
		activeSchoolInfo		: React.PropTypes.object.isRequired,
		isCopyMode				: React.PropTypes.bool,
		opponentSchoolInfoArray	: React.PropTypes.array
	},
	componentWillReceiveProps:function(nextProps){
		// Listen changes of event type.
		// This component doesn't contain eventType field,
		// so we should listen changes of this field.
		// Because view of this component depends of eventType.
		if(this.props.eventType !== nextProps.eventType) {
			this.handleChangeGameType();
		}
	},

	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		// It's auto generated key for postcode input.
		// It exists because we must have opportunity to reset state of this component by hand.
		binding.set('postcodeInputKey', Immutable.fromJS(this.generatePostcodeInputKey()));
		binding.sub('fartherThen').addListener(() => this.clearVenueData());
	},
	generatePostcodeInputKey: function() {
		// just current date in timestamp view
		return + new Date();
	},
	handleChangeGameType: function() {
		const currentGameType = this.props.eventType;

		const homePostCode = this.getHomeSchoolPostCode();

		switch (currentGameType) {
			case "inter-schools":
				this.clearVenueData();
				break;
			case "houses":
				this.clearVenueData();
				typeof homePostCode !== 'undefined' && this.setPostcode(homePostCode);
				break;
			case "internal":
				this.clearVenueData();
				typeof homePostCode !== 'undefined' && this.setPostcode(homePostCode);
				break;
		}
	},
	/**
	 * Clear all venue data:
	 * 1) venue type
	 * 2) venue postcode
	 *
	 * And generate new key for postcode input. By this operation we can reload state of postcode input
	 */
	clearVenueData: function() {
		this.getDefaultBinding().atomically()
			.set('postcodeInputKey',	Immutable.fromJS(this.generatePostcodeInputKey()))
			.set('model.venue',			Immutable.fromJS({}))
			.commit();
	},
	/**
	 * Get home school postcode
	 * @returns {*}
	 * @private
	 */
	getHomeSchoolPostCode: function() {
		const schoolInfo = this.props.activeSchoolInfo;

		const postcode = schoolInfo.postcode;
		typeof postcode !== 'undefined' && (postcode.tooltip = ' (your school)');

		return postcode;
	},
	/**
	 * Get home school postcode
	 * @returns {*}
	 * @private
	 */
	getOpponentSchoolPostCodes: function() {
		const opponentSchoolInfoArray = this.props.opponentSchoolInfoArray;

		if(typeof opponentSchoolInfoArray !== 'undefined') {
			return opponentSchoolInfoArray
				.filter(school => typeof school.postcode !== 'undefined')
				.map(school => {
					const postcode = school.postcode;
					postcode.tooltip = ` (${school.name})`;

					return postcode;
				});
		} else {
			return [];
		}
	},
	getTBDPostcode: function() {
		return {
			id			: "TBD",
			postcode	: "TBD"
		};
	},
	getResultForEmptySearchString: function() {
		return window.Server.schoolPlaces.get(this.props.activeSchoolInfo.id)
			.then(places => {
				let result = [];

				// set home postcode
				const homePostCode = this.getHomeSchoolPostCode();
				typeof homePostCode !== "undefined" && result.push(homePostCode);

				// set opponent postcode
				if(this.props.eventType === 'inter-schools') {
					const opponentSchoolPostCodes = this.getOpponentSchoolPostCodes();
					if(opponentSchoolPostCodes.length !== 0) {
						result = result.concat(opponentSchoolPostCodes);
					}
				}

				// set TBD plug - it's fake postcode
				result.push(this.getTBDPostcode());
				result = result.concat(places);

				return Promise.resolve(result);
			});
	},
	getResultForNotEmptySearchString: function(postcode) {
		const	gameType	= this.props.eventType;

		const	homePostcode		= this.getHomeSchoolPostCode(),
				opponentPostcodes	= this.getOpponentSchoolPostCodes(),
				tbd					= {id:"TBD",postcode:"TBD"};

		const postCodeFilter = {
			where: {
				text: {
					like	: postcode,
					options	: 'i'
				}
			},
			limit: 10
		};

		return window.Server.schoolPlacesAndPostcodes.get(
			this.props.activeSchoolInfo.id,
			{
				filter: postCodeFilter
			}
		)
		.then(postcodes => {
			// away
			if(gameType === 'inter-schools' && opponentPostcodes.length !== 0) {
				opponentPostcodes.forEach(opponentPostcode => {
					const foundAwayPostcodeIndex = postcodes.findIndex(p => p.id === opponentPostcode.id);

					if(foundAwayPostcodeIndex !== -1) {
						postcodes[foundAwayPostcodeIndex].tooltip = ' (opponent school)';
						// Function modify args!!!
						postcodes = this.upPostcodeToStart(foundAwayPostcodeIndex, postcodes);
					}
				});

			}

			// home
			if(typeof homePostcode !== 'undefined') {
				const homePostcodeIndex = postcodes.findIndex(p => p.id === homePostcode.id);
				if(homePostcodeIndex !== -1) {
					postcodes[homePostcodeIndex].tooltip = ' (your school)';
					// Function modify args!!!
					postcodes = this.upPostcodeToStart(homePostcodeIndex, postcodes);
				}
			}

			// tbd
			postcodes.unshift(tbd);

			return postcodes;
		});
	},
	postcodeService: function (postcode) {
		if(postcode === '') {
			return this.getResultForEmptySearchString();
		} else {
			return this.getResultForNotEmptySearchString(postcode);
		}
	},
	/**
	 * Function modify args
	 * @param currentPostcodeIndex
	 * @param postcodes
	 * @returns {*}
	 */
	upPostcodeToStart: function(currentPostcodeIndex, postcodes) {
		const postcodeElement = postcodes[currentPostcodeIndex];

		postcodes.splice(currentPostcodeIndex, 1);
		postcodes.unshift(postcodeElement);

		return postcodes;
	},
	getVenueTypeByPostcode: function(value) {
				// home postcode can be undefined, so - check it
		const	homePostcode		= this.getHomeSchoolPostCode(),
				homePostcodeId		= typeof homePostcode !== 'undefined' ? homePostcode.id : undefined,
				// away postcode can be undefined, so - check it
				awayPostcodes		= this.getOpponentSchoolPostCodes(),
				foundAwayPostcode	= awayPostcodes.find(p => p.id === value.id);

		switch (true) {
			case homePostcodeId === value.id:
				return 'HOME';
			case Boolean(foundAwayPostcode):
				return 'AWAY';
			case value.id === "TBD":
				return 'TBD';
			default:
				return 'CUSTOM';
		}
	},
	getVenueType: function() {
		return this.getDefaultBinding().get('model.venue.venueType');
	},
	setPostcode: function(postcode) {
		this.getDefaultBinding().atomically()
			.set('model.venue.venueType',		Immutable.fromJS(this.getVenueTypeByPostcode(postcode)))
			.set('model.venue.postcodeData',	Immutable.fromJS(postcode))
			.commit();
	},
	isPlace: function(value) {
		return typeof value.name !== 'undefined';
	},
	/**
	 * Function converts place to postcode and adds name place and placeId to it.
	 * @param place
	 */
	convertPlaceToPostcodeWithPlaceName: function(place) {
		return {
			id:					place.postcodeId,
			placeId:			place.id,
			name:				place.name,
			point:				place.point,
			postcode:			place.postcode,
			postcodeNoSpaces:	place.postcodeNoSpaces
		};
	},
	handleSelectPostcode: function(id, value) {
		let postcode = value;

		if(this.isPlace(postcode)) {
			postcode = this.convertPlaceToPostcodeWithPlaceName(postcode);
		}

		this.setPostcode(postcode);
	},
	handleClickPostcodeInput: function(eventDescriptor) {
		if(this.isPostcodeInputBlocked()) {
			window.simpleAlert(
				'Please, select your opposing school first.',
				'Ok',
				() => {}
			);
			eventDescriptor.stopPropagation();
		}
	},
	/**
	 * Get geo point for map.
	 * Return default geo point when postcode isn't selected.
	 * @returns {*}
	 */
	getPoint: function() {
		const	binding		= this.getDefaultBinding(),
				schoolInfo	= this.props.activeSchoolInfo;

		let point = propz.get(schoolInfo, ['postcode', 'point']);
		if(typeof point === "undefined") {
			point = this.DEFAULT_VENUE_POINT;
		}

		const	venueType	= binding.toJS('model.venue.venueType'),
				venuePoint	= binding.toJS('model.venue.postcodeData');

		switch (true) {
			case typeof venuePoint === 'undefined':
				return point;
			case typeof venuePoint !== 'undefined' && venueType === "TBD":
				return point;
			case typeof venuePoint !== 'undefined':
				return venuePoint.point;
		};
	},
	isPostcodeInputBlocked: function() {
		const	gameType			= this.props.eventType,
				opponentSchoolArray	= this.props.opponentSchoolInfoArray;	// opponent school for inter-schools event

		return (
			gameType === 'inter-schools' &&
			typeof opponentSchoolArray === 'undefined' &&
			opponentSchoolArray.length !== 0
		);
	},
	/**
	 * Show map when venue isn't equal TBD
	 */
	isShowMap: function() {
		return this.getVenueType() !== "TBD";
	},
	getDefaultPostcode: function() {
		const	homePostcode	= this.getHomeSchoolPostCode(),
				awayPostcodes	= this.getOpponentSchoolPostCodes(),
				model			= this.getDefaultBinding().toJS('model'),
				venue			= propz.get(model, ['venue']);
		let		defPostcode		= propz.get(model, ['venue', 'postcodeData']);

		if(typeof venue !== 'undefined') {
			switch(true) {
				case typeof homePostcode !== "undefined" && typeof defPostcode !== "undefined" && homePostcode.id === defPostcode.id:
					defPostcode.tooltip = ' (your school)';
					break;
				case awayPostcodes.length !== 0 && typeof defPostcode !== "undefined":
					const foundPostcode = awayPostcodes.find(p => p.id === defPostcode.id);
					if(typeof foundPostcode !== 'undefined') {
						defPostcode.tooltip = ' (opponent school)';
					}
					break;
				case this.props.isCopyMode && typeof defPostcode === 'undefined':
					defPostcode = {
						id: "TBD",
						postcode: "TBD"
					};
					break;
				case venue.venueType === 'TBD':
					defPostcode = {
						id: "TBD",
						postcode: "TBD"
					};
					break;
			}
		}

		return defPostcode;
	},
	getPostcodeTitle: function(elem) {
		return typeof elem.name !== 'undefined' ? elem.name : elem.postcode;
	},
	isStarButtonEnable: function() {
		const postcode = this.getDefaultBinding().toJS('model.venue.postcodeData');

		return typeof postcode !== 'undefined' ? this.isPlace(postcode) : false;
	},
	isShowPlacePopup: function() {
		return Boolean(this.getDefaultBinding().get('isShowPlacePopup'));
	},
	showPlacePopup: function() {
		this.getDefaultBinding().set('isShowPlacePopup', true);
	},
	closePlacePopup: function() {
		this.getDefaultBinding().set('isShowPlacePopup', false);
	},
	removePlace: function(place) {
		const binding = this.getDefaultBinding();

		window.Server.schoolPlace.delete(
			{
				schoolId: this.props.activeSchoolInfo.id,
				placeId: place.placeId
			}
		).then(() => {
			// just delete name and placeId
			// because in really it's no place, it's postcode with some place data
			const postcode = {
				id:					place.id,
				point:				place.point,
				postcode:			place.postcode,
				postcodeNoSpaces:	place.postcodeNoSpaces
			};

			binding.set('model.venue.postcodeData', Immutable.fromJS(postcode));
		});
	},
	onClickStarButton: function() {
		const	binding		= this.getDefaultBinding(),
				postcode	= binding.toJS('model.venue.postcodeData');

		switch (true) {
			case typeof postcode !== 'undefined' && this.isStarButtonEnable():
				window.confirmAlert(
					"You are going to remove the venue. Are you sure?",
					"Ok",
					"Cancel",
					() => { this.removePlace(postcode) },
					() => {  }
				);
				break;
			case typeof postcode !== 'undefined' && !this.isStarButtonEnable():
				this.showPlacePopup();
				break;
		}
	},
	onSubmit: function(newPlace) {
		const binding =  this.getDefaultBinding();

		const place = this.convertPlaceToPostcodeWithPlaceName(newPlace);

		binding.atomically()
			.set('isShowPlacePopup', false)
			.set('model.venue.postcodeData', Immutable.fromJS(place))
			.commit();
	},
	onCancel: function() {
		this.closePlacePopup();
	},
	render: function() {
		const binding = this.getDefaultBinding();

		// Note. Pls look at Autocomplete component.
		// You can see generated key.
		// In some cases we should reload this component by hand.
		return (
			<div>
				<div	className	= "bInputWrapper"
						onClick		= { this.handleClickPostcodeInput }
				>
					<div className="bInputLabel">
						Postcode
					</div>
					<Autocomplete	key					= { binding.toJS('postcodeInputKey') }
									customListItem		= { PlaceListItem }
									getElementTitle		= { this.getPostcodeTitle }
									serverField			= "postcode"
									binding				= { binding }
									defaultItem			= { this.getDefaultPostcode() }
									serviceFilter		= { this.postcodeService }
									onSelect			= { this.handleSelectPostcode }
									placeholder			= { 'Select Postcode' }
									isBlocked			= { this.isPostcodeInputBlocked() }
									extraCssStyle		= { 'mBigSize mWidth350 mInline mRightMargin mWhiteBG' }
					/>
					<StarButton	handleClick	= { this.onClickStarButton }
								isEnable	= { this.isStarButtonEnable() }
					/>
				</div>
				<If condition={this.isShowMap()}>
					<Map	point				= { this.getPoint() }
							customStylingClass	= "eEvents_venue_map"
					/>
				</If>
				<If condition={this.isShowPlacePopup()}>
					<PlacePopup	binding			= { binding }
								activeSchoolId	= { this.props.activeSchoolInfo.id }
								onSubmit		= { this.onSubmit }
								onCancel		= { this.onCancel }
					/>
				</If>
			</div>
		);
	}
});

module.exports = EventVenue;