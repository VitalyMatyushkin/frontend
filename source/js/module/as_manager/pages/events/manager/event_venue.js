const   React           = require('react'),
        Map             = require('module/ui/map/map'),
        Autocomplete    = require('module/ui/autocomplete2/OldAutocompleteWrapper'),
        Immutable       = require('immutable'),
        Morearty		= require('morearty'),
        If              = require('module/ui/if/if'),
        SimpleAlert     = require('./../../../../ui/simple_alert/simple_alert');

const EventVenue = React.createClass({
    displayName:            'EventVenue',
    mixins:                 [Morearty.Mixin],
    DEFAULT_VENUE_POINT:    { "lat": 50.832949, "lng": -0.246722 },
    componentWillMount:function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        self._initData(binding.toJS('model.type'));

        // Listen changes of event type.
        // This component doesn't contain eventType field,
        // so we should listen changes of this field.
        // Because view of this component depends of eventType.
        binding.addListener('model.type', self._onChangeEventType);
    },
    /*HELPERS*/
	/**
     * Init venue type and postcode by event type.
     * @private
     */
    _initData: function(eventType) {
        const self = this;

        self._initVenueType(eventType);
        self._initPostCode(eventType);
        self._initAlerts();
    },
    _initVenueType: function(eventType) {
        const   self = this,
            binding = self.getDefaultBinding(),
			value = binding.toJS('radio');

		if(!value)
			switch (eventType) {
				case 'inter-schools':
					binding.atomically()
						.set('radio',                   Immutable.fromJS('home'))
						.set('model.venue.venueType',   Immutable.fromJS('home'))
						.commit();
					break;
				default:
					binding.atomically()
						.set('radio',                   Immutable.fromJS(undefined))
						.set('model.venue.venueType',   Immutable.fromJS('home'))
						.commit();
					break;
			}
    },
    _initPostCode: function() {
        const   self = this,
                binding = self.getDefaultBinding(),
				value = binding.toJS('venue'),
				postcode = self._getHomeSchoolPostCode();

        if(!value && postcode) {
			binding.atomically()
				.set('venue',                Immutable.fromJS(postcode))
				.set('model.venue.postcode', Immutable.fromJS(postcode.id))
				.commit();
		}
    },
    _initAlerts: function() {
        const   self = this,
                binding = self.getDefaultBinding();

        binding.set('isRivalSchoolAlertOpen',   false);
    },
    /**
     * Function set default postcode by venue type.
     * Summary, function set postcode and venue type to binding.
     * @param venueType
     * @private
     */
    _setPostCodeAndVenueType: function(venueType) {
        const   self    = this,
                binding = self.getDefaultBinding();

        const postcode = self._getPostCodeByVenueType(venueType);

        if(postcode) {
            binding.atomically()
                .set('radio',                   Immutable.fromJS(venueType))
                .set('venue',                   Immutable.fromJS(postcode))
                .set('model.venue.postcode',    Immutable.fromJS(postcode.id))
                .set('model.venue.venueType',   Immutable.fromJS(venueType))
                .commit();
        } else {
            binding.atomically()
                .set('radio',                   Immutable.fromJS(venueType))
                .set('venue',                   Immutable.fromJS(undefined))
                .set('model.venue.postcode',    Immutable.fromJS(undefined))
                .set('model.venue.venueType',   Immutable.fromJS(venueType))
                .commit();
        }
    },
    _getPostCodeByVenueType: function(venueType) {
        const   self = this;

        let postcode;

        switch (venueType) {
            case 'tbd':
                postcode = undefined;
                break;
            case 'home':
                postcode = self._getHomeSchoolPostCode();
                break;
            case 'away':
                postcode = self._getOpponentSchoolPostCode();
                break;
            case 'custom':
                postcode = self._getHomeSchoolPostCode();
                break;
            default:
                postcode = undefined;
                break;
        }

        return postcode;
    },
    _isShowVenueTypeRadioButtons: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        return binding.toJS('model.type') === 'inter-schools';
    },
    _isShowPostcodeField: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        return !(binding.toJS('model.type') === 'inter-schools' && binding.toJS('radio') === 'tbd');
    },
	/**
     * Get home school postcode
     * @returns {*}
     * @private
     */
    _getHomeSchoolPostCode: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        return binding.toJS('schoolInfo.postcode');
    },
    /**
     * Get home school postcode
     * @returns {*}
     * @private
     */
    _getOpponentSchoolPostCode: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        return binding.toJS('rivals.1.postcode');
    },
    _postcodeService: function (postcode) {
        const	postCodeFilter = {
            where: {
                postcode: {
                    like: postcode,
                    options: 'i'
                }
            },
            limit: 10
        };

        return window.Server.postCode.get({ filter: postCodeFilter });
    },
    /*LISTENERS*/
    _onSelectPostcode: function(id, value) {
        const   self        = this,
                binding     = self.getDefaultBinding();

        binding.atomically()
            .set('venue',                Immutable.fromJS(value))
            .set('model.venue.postcode', Immutable.fromJS(value.id))
            .commit();
    },
    _onVenueTypeChange: function(venueType) {
        const   self    = this,
                binding = self.getDefaultBinding();

        switch(venueType) {
            case 'away':
                if(binding.toJS('rivals.1')) {
                    self._setPostCodeAndVenueType(venueType);
                } else  {
                    window.simpleAlert(
                        'Please select rival school',
                        'Ok',
                        () => {}
                    );
                }
                break;
            default:
                self._setPostCodeAndVenueType(venueType);
                break;
        }
    },
    _onChangeEventType: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        self._initData(binding.toJS('model.type'));
    },
    /*RENDER FUNCTIONS*/
    _renderVenueTypeRadioButton: function(venueTypeRadioButtonValue) {
        const self = this;

        return (
            <div className="eVenue_venue_type_radio_buttons">
                <div className="eVenue_venue_type_radio_buttons_header">
                    Change Venue
                </div>

                <div className="eVenue_venue_type_radio_buttons_container">
                    <input type="checkbox"
                           checked={venueTypeRadioButtonValue === 'tbd'}
                           onChange={() => self._onVenueTypeChange('tbd')}
                    />
                    <label className="eVenue_venue_type_radio_button_label">
                        TBD
                    </label>

                    <input type="checkbox"
                           checked={venueTypeRadioButtonValue === 'home'}
                           onChange={() => self._onVenueTypeChange('home')}
                    />
                    <label className="eVenue_venue_type_radio_button_label">
                        Home
                    </label>

                    <input type="checkbox"
                           checked={venueTypeRadioButtonValue === 'away'}
                           onChange={() => self._onVenueTypeChange('away')}
                    />
                    <label className="eVenue_venue_type_radio_button_label">
                        Away
                    </label>

                    <input type="checkbox"
                           checked={venueTypeRadioButtonValue === 'custom'}
                           onChange={() => self._onVenueTypeChange('custom')}
                    />
                    <label className="eVenue_venue_type_radio_button_label">
                        Custom
                    </label>
                </div>
            </div>
        );
    },
    render: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        const   venueType   = binding.toJS('radio'),
                venuePoint  = binding.toJS('venue'),
                point       = venuePoint ? venuePoint.point : self.DEFAULT_VENUE_POINT;

        return (
            <div>
                <If condition={self._isShowVenueTypeRadioButtons()}>
                    {self._renderVenueTypeRadioButton(venueType)}
                </If>
                <If condition={self._isShowPostcodeField()}>
                    <div className="eVenue_postcode">
                        <span className="eVenue_postcodeLabel">Change Postcode</span>
                        <Autocomplete
                            serverField="postcode"
                            defaultItem={binding.toJS('venue')}
                            binding={binding.sub('postcode')}
                            serviceFilter={self._postcodeService}
                            onSelect={self._onSelectPostcode}
                            placeholderText={'Select Postcode'}
                        />
                    </div>
                </If>
                <If condition={venueType !== 'tbd'}>
                    <Map binding={binding}
                         point={point}
                         customStylingClass="eEvents_venue_map"
                    />
                </If>
            </div>
        );
    }
});

module.exports = EventVenue;