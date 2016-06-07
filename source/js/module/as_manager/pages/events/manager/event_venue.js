/**
 * Created by Bright on 19/01/2016.
 */
const   React       = require('react'),
        Map         = require('module/ui/map/map'),
        Immutable   = require('immutable'),
        FormField 	= require('module/ui/form/form_field'),
        If          = require('module/ui/if/if'),

EventVenue = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        sportType:React.PropTypes.string
    },
    getDefaultState:function(){
        return Immutable.fromJS({
            radio: 'home'
        });
    },
    displayName:'EventVenue',
    componentWillMount:function(){
        const   self        = this,
            binding     = self.getDefaultBinding();

        self.componentSetupCalls();
        self.addBindingListener(binding, 'postcode.value', self.postcodeSelectionChange);
    },
    componentWillReceiveProps:function(nextProps){
        if(nextProps.sportType !== this.props.sportType){
            this.componentSetupCalls(nextProps.sportType);
        }
    },
    componentSetupCalls:function(prop){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                currentProp = prop !== undefined?prop:self.props.sportType,
                postCode    = binding.toJS('schoolInfo.postcode');

        self.neutralVenue = currentProp !== 'inter-schools';
        self.currentPostcode = postCode;
        binding.set('venue',postCode);
        binding.set('model.venue.postcode', postCode.id);
        self.refs.home && (self.refs.home.checked = true);
    },
    onRadioButtonChange:function(reference){
        var self = this,
            binding = self.getDefaultBinding();

        self.neutralVenue = reference === 'neutral';
        if( reference==='away' && binding.get('rivals.1')=== undefined)
            alert('Please select rival school');
        else
            binding.set('radio', reference);

        self.callService();
    },
    callService:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            radio = binding.get('radio'),
            postcode = radio === 'away' ? binding.toJS('rivals.1.postcode'):self.currentPostcode;

        binding.set('venue',postcode);
        binding.set('model.venue.postcode',postcode.id);
    },
    postcodeSelectionChange:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            selectedVal = binding.get('postcode.fullValue');
        binding.set('venue',selectedVal);
        binding.set('model.venue.postcode',selectedVal.id);

    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            radio = binding.get('radio'),
            venuePoint = binding.get('venue'),
            point = venuePoint ? venuePoint.point : {"lat": 50.832949, "lng": -0.246722};
        return(
            <div>
                <If condition={self.props.sportType === 'inter-schools'}>
                    <div style={{marginBottom:10+'px',marginTop:10+'px'}}>
                        <div style={{marginBottom:10+'px'}}>Change Venue</div>

                        <input type="checkbox" checked={radio === 'tbc'} onChange={function(){self.onRadioButtonChange('tbc')}}/>
						<label style={{marginRight:4+'px'}}>tbc</label>

						<input type="checkbox" checked={radio === 'home'} onChange={function(){self.onRadioButtonChange('home')}}/>
						<label style={{marginRight:4+'px'}}>Home</label>

						<input type="checkbox" checked={radio === 'away'} onChange={function(){self.onRadioButtonChange('away')}}/>
                        <label style={{marginRight:4+'px'}}>Away</label>

                        <input type="checkbox" checked={radio === 'neutral'} onChange={function(){self.onRadioButtonChange('neutral')}}/>
                        <label style={{marginRight:4+'px'}}>Neutral</label>
                    </div>
                </If>
                <If condition={self.neutralVenue === true}>
                    <div style={{marginTop:10+'px', marginBottom:10+'px'}}>
                        <span className="eEvents_venue">Change Venue</span>
                        <FormField type="area" field="postcodeId" defaultItem={self.currentPostcode} binding={binding.sub('postcode')} />
                    </div>
                </If>
                <If condition={radio !== 'tbc'}>
                    <Map binding={binding} point={point} customStylingClass="eEvents_venue_map"/>
                </If>
            </div>
        )
    }
});
module.exports = EventVenue;
