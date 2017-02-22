const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable');

const	If					= require('../../../../ui/if/if'),
		propz				= require('propz'),
		Promise				= require('bluebird'),
		Map					= require('module/ui/map/map2'),
		Autocomplete		= require('../../../../../../js/module/ui/autocomplete2/OldAutocompleteWrapper');

const	InputWrapperStyles	= require('./../../../../../../styles/ui/b_input_wrapper.scss'),
		InputLabelStyles	= require('./../../../../../../styles/ui/b_input_label.scss'),
		TextInputStyles		= require('./../../../../../../styles/ui/b_text_input.scss'),
		DropdownStyles		= require('./../../../../../../styles/ui/b_dropdown.scss');

const EventVenue = React.createClass({
	mixins: [Morearty.Mixin],

	DEFAULT_VENUE_POINT: { "lat": 50.832949, "lng": -0.246722 },

	propTypes: {
		eventType			: React.PropTypes.string.isRequired,
		activeSchoolInfo	: React.PropTypes.object.isRequired,
		isCopyMode			: React.PropTypes.bool,
		opponentSchoolInfo	: React.PropTypes.object
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
	getOpponentSchoolPostCode: function() {
		let postcode = undefined;

		if(
			typeof this.props.opponentSchoolInfo !== 'undefined' &&
			typeof this.props.opponentSchoolInfo.postcode !== 'undefined'
		) {
			postcode = this.props.opponentSchoolInfo.postcode;
			postcode.tooltip = ' (opponent school)';
		}

		return postcode;
	},
	getTBDPostcode: function() {
		return {
			id			: "TBD",
			postcode	: "TBD"
		};
	},
	getResultForEmptySearchString: function() {
		const	gameType	= this.props.eventType;

		const promises = [];

		// set home postcode
		const homePostCode = this.getHomeSchoolPostCode();
		typeof homePostCode !== "undefined" && promises.push(homePostCode);

		// set opponent postcode
		if(gameType === 'inter-schools') {
			const opponentSchoolPostCode = this.getOpponentSchoolPostCode();
			typeof opponentSchoolPostCode !== "undefined" && promises.push(opponentSchoolPostCode);
		}

		// set TBD plug - it's fake postcode
		promises.push(this.getTBDPostcode());

		return Promise.resolve(promises);
	},
	getResultForNotEmptySearchString: function(postcode) {
		const	gameType	= this.props.eventType;

		const	homePostcode		= this.getHomeSchoolPostCode(),
				opponentPostcode	= this.getOpponentSchoolPostCode(),
				tbd					= {id:"TBD",postcode:"TBD"};

		const postCodeFilter = {
			where: {
				postcode: {
					like	: postcode,
					options	: 'i'
				}
			},
			limit: 10
		};

		return window.Server.postCodes.get({ filter: postCodeFilter }).then(postcodes => {
			// away
			if(gameType === 'inter-schools' && typeof opponentPostcode !== 'undefined') {
				const foundAwayPostcodeIndex = postcodes.findIndex(p => p.id === opponentPostcode.id);

				if(foundAwayPostcodeIndex !== -1) {
					postcodes[foundAwayPostcodeIndex].tooltip = ' (opponent school)';
					// Function modify args!!!
					postcodes = this.upPostcodeToStart(foundAwayPostcodeIndex, postcodes);
				}
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
		const	homePostcode	= this.getHomeSchoolPostCode(),
				homePostcodeId	= typeof homePostcode !== 'undefined' ? homePostcode.id : undefined,
				// away postcode can be undefined, so - check it
				awayPostcode	= this.getOpponentSchoolPostCode(),
				awayPostcodeId	= typeof awayPostcode !== 'undefined' ? awayPostcode.id : undefined;


		switch (true) {
			case homePostcodeId === value.id:
				return 'HOME';
			case awayPostcodeId === value.id:
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
	handleSelectPostcode: function(id, value) {
		this.setPostcode(value);
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
		const	gameType		= this.props.eventType,
				opponentSchool	= this.props.opponentSchoolInfo;	// opponent school for inter-schools event

		return gameType === 'inter-schools' && typeof opponentSchool === 'undefined';
	},
	/**
	 * Show map when venue isn't equal TBD
	 */
	isShowMap: function() {
		return this.getVenueType() !== "TBD";
	},
	getDefaultPostcode: function() {
		const	homePostcode	= this.getHomeSchoolPostCode(),
				awayPostcode	= this.getOpponentSchoolPostCode();

		let defPostcode = this.getDefaultBinding().toJS('model.venue.postcodeData');

		switch(true) {
			case typeof homePostcode !== "undefined" && typeof defPostcode !== "undefined" && homePostcode.id === defPostcode._id:
				defPostcode.tooltip = ' (your school)';
				break;
			case typeof awayPostcode !== "undefined" && typeof defPostcode !== "undefined" && awayPostcode.id === defPostcode._id:
				defPostcode.tooltip = ' (opponent school)';
				break;
			case this.props.isCopyMode && typeof defPostcode === 'undefined':
				defPostcode = {
					id: "TBD",
					postcode: "TBD"
				};
				break;
		};

		return defPostcode;
	},
	render: function() {
		const binding = this.getDefaultBinding();

		// Note. Pls look at Autocomplete component.
		// You can see generated key.
		// We must have opportunity to reset state of this component by hand.
		return (
			<div>
				<div	className	= "bInputWrapper"
						onClick		= {this.handleClickPostcodeInput}
				>
					<div className="bInputLabel">
						Postcode
					</div>
					<Autocomplete	key				= {binding.toJS('postcodeInputKey')}
									serverField		= "postcode"
									binding			= {binding}
									defaultItem		= {this.getDefaultPostcode()}
									serviceFilter	= {this.postcodeService}
									onSelect		= {this.handleSelectPostcode}
									placeholder		= {'Select Postcode'}
									isBlocked		= {this.isPostcodeInputBlocked()}
									extraCssStyle	= {'mBigSize'}
					/>
				</div>
				<If condition={this.isShowMap()}>
					<Map 	point				= {this.getPoint()}
							customStylingClass	= "eEvents_venue_map"
					/>
				</If>
			</div>
		);
	}
});

module.exports = EventVenue;