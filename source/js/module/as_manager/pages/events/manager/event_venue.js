const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),

		Promise				= require('bluebird'),
		Map					= require('module/ui/map/map'),
		Autocomplete		= require('../../../../../../js/module/ui/autocomplete2/OldAutocompleteWrapper'),

		InputWrapperStyles	= require('./../../../../../../styles/ui/b_input_wrapper.scss'),
		InputLabelStyles	= require('./../../../../../../styles/ui/b_input_label.scss'),
		TextInputStyles		= require('./../../../../../../styles/ui/b_text_input.scss'),
		DropdownStyles		= require('./../../../../../../styles/ui/b_dropdown.scss');

const EventVenue = React.createClass({
	mixins: [Morearty.Mixin],

	DEFAULT_VENUE_POINT: { "lat": 50.832949, "lng": -0.246722 },

	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		// It's auto generated key for postcode input.
		// It exists because we must have opportunity to reset state of this component by hand.
		binding.set('postcodeInputKey', Immutable.fromJS(this.generatePostcodeInputKey()));

		// Listen changes of event type.
		// This component doesn't contain eventType field,
		// so we should listen changes of this field.
		// Because view of this component depends of eventType.
		this.getDefaultBinding().addListener('model.type', this.clearVenueData);
	},
	generatePostcodeInputKey: function() {
		// just current date in timestamp view
		return + new Date();
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
		const binding = this.getDefaultBinding();

		const postcode = binding.toJS('schoolInfo.postcode');
		postcode.tooltip = ' (your school)';

		return postcode;
	},
	/**
	 * Get home school postcode
	 * @returns {*}
	 * @private
	 */
	getOpponentSchoolPostCode: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const postcode = binding.toJS('rivals.1.postcode');
		typeof postcode !== 'undefined' && (postcode.tooltip = ' (opponent school)');

		return postcode;
	},
	getTBDPostcode: function() {
		return {
			id			: "TBD",
			postcode	: "TBD"
		};
	},
	getResultForEmptySearchString: function() {
		const	binding		= this.getDefaultBinding(),
				gameType	= binding.toJS('model.type');

		const promises = [this.getHomeSchoolPostCode()];
		if(gameType === 'inter-schools') {
			promises.push(this.getOpponentSchoolPostCode());
		}
		promises.push(this.getTBDPostcode());

		return Promise.resolve(promises);
	},
	getResultForNotEmptySearchString: function(postcode) {
		const	binding		= this.getDefaultBinding(),
				gameType	= binding.toJS('model.type');

		const	homePostcode	= this.getHomeSchoolPostCode(),
				tbd				= {id:"TBD",postcode:"TBD"};

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
			if(gameType === 'inter-schools') {
				const	awayPostcode	= this.getOpponentSchoolPostCode(),
						foundAwayPostcodeIndex = postcodes.findIndex(p => p.id === awayPostcode.id);

				if(foundAwayPostcodeIndex !== -1) {
					postcodes[foundAwayPostcodeIndex].tooltip = '(opponent school)';
					// Function modify args!!!
					postcodes = this.upPostcodeToStart(foundAwayPostcodeIndex, postcodes);
				}
			}

			// home
			const homePostcodeIndex = postcodes.findIndex(p => p.id === homePostcode.id);
			if(homePostcodeIndex !== -1) {
				postcodes[homePostcodeIndex].tooltip = '(your school)';
				// Function modify args!!!
				postcodes = this.upPostcodeToStart(homePostcodeIndex, postcodes);
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
		const	homePostcodeId	= this.getHomeSchoolPostCode().id,
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
	handleSelectPostcode: function(id, value) {
		this.getDefaultBinding().atomically()
			.set('model.venue.venueType',	Immutable.fromJS(this.getVenueTypeByPostcode(value)))
			.set('model.venue.postcode',	Immutable.fromJS(value))
			.commit();
	},
	handleClickPostcodeInput: function(eventDescriptor) {
		if(this.isPostcodeInputBlocked()) {
			window.simpleAlert(
				'Please, enter opponent school, at first.',
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
		const binding = this.getDefaultBinding();

		const	venueType	= binding.toJS('model.venue.venueType'),
				venuePoint	= binding.toJS('model.venue.postcode');

		switch (true) {
			case typeof venuePoint === 'undefined':
				return this.DEFAULT_VENUE_POINT;
			case typeof venuePoint !== 'undefined' && venueType === "TBD":
				return this.DEFAULT_VENUE_POINT;
			case typeof venuePoint !== 'undefined':
				return venuePoint.point;
		};
	},
	isPostcodeInputBlocked: function() {
		const binding = this.getDefaultBinding();

		const	gameType	= binding.toJS('model.type'),
				secondRival	= binding.toJS('rivals.1'); // opponent school for inter-schools event

		return gameType === 'inter-schools' && typeof secondRival === 'undefined';
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
									serviceFilter	= {this.postcodeService}
									onSelect		= {this.handleSelectPostcode}
									placeholder		= {'Select Postcode'}
									isBlocked		= {this.isPostcodeInputBlocked()}
									extraCssStyle	= {'mBigSize'}
					/>
				</div>
				<Map	binding				= {binding}
						point				= {this.getPoint()}
						customStylingClass	= "eEvents_venue_map"
				/>
			</div>
		);
	}
});

module.exports = EventVenue;