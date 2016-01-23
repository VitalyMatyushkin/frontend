/**
 * Created by Bright on 19/01/2016.
 */
const React = require('react'),
    Map = require('module/ui/map/map'),
    Immutable = require('immutable'),
    If = require('module/ui/if/if'),
    ReactDOM = require('reactDom');
const EventVenue = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        sportType:React.PropTypes.string
    },
    displayName:'EventVenue',
    componentWillMount:function(){
        var self = this;
        self.componentSetupCalls();
    },
    componentWillReceiveProps:function(nextProps){
        var self = this;
        if(nextProps.sportType !== this.props.sportType){
            self.componentSetupCalls(nextProps.sportType);
        }
    },
    componentSetupCalls:function(prop){
        var self = this,
            binding = self.getDefaultBinding(),
            currentProp = prop !== undefined?prop:self.props.sportType;
        if(currentProp === 'inter-schools'){
            window.Server.findPostCodeById.get({postCode:binding.get('rivals.0.postcodeId')})
                .then(function(postcode){
                    window.Server.postCode.get()
                        .then(function(postcodes){
                            self.currentPostcode = postcode;
                            ReactDOM.findDOMNode(self.refs.home).checked = true;
                            binding.set('venue',postcode);
                            binding.set('venueList',postcodes);
                            self.forceUpdate();
                        })
                        .catch(function(er){
                            console.log(er.errorThrown);
                        });
                    return postcode;
                })
                .catch(function(er){
                    console.log(er);
                });
            self.neutralVenue = false;
        }else{
            window.Server.postCode.get().then(function(postcodes){
                binding.set('venue',postcodes[0]);
                binding.set('venueList',postcodes);
                self.forceUpdate();
            }).catch(function(er){
                console.log(er.errorThrown);
            });
            self.neutralVenue = true;
        }
    },
    onRadioButtonChange:function(reference){
        var self = this,
            binding = self.getDefaultBinding();
        switch (reference){
            case 'home':
                self.neutralVenue = false;
                ReactDOM.findDOMNode(self.refs.neutral).checked = false;
                let buttonState = self.checkStatus('home');
                if(buttonState){
                    ReactDOM.findDOMNode(self.refs.away).checked = false;
                    self.callService('home');
                }else{
                    let otherButtonState = ReactDOM.findDOMNode(self.refs.away).checked;
                    if(!otherButtonState){
                        ReactDOM.findDOMNode(self.refs.home).checked = true;
                    }
                }
                break;
            case 'away':
                self.neutralVenue = false;
                ReactDOM.findDOMNode(self.refs.neutral).checked = false;
                let awayButtonState = self.checkStatus('away');
                if(awayButtonState){
                    if(binding.get('rivals.1')!== undefined){
                        ReactDOM.findDOMNode(self.refs.home).checked = false;
                        self.callService('away');
                    }else{
                        alert('Please select rival school');
                        ReactDOM.findDOMNode(self.refs.away).checked = false;
                    }
                }else{
                    let otherState = ReactDOM.findDOMNode(self.refs.home).checked;
                    if(!otherState){
                        ReactDOM.findDOMNode(self.refs.home).checked = true;
                        self.callService('home');
                    }
                }
                break;
            case 'neutral':
                self.neutralVenue = true;
                let neutralState = ReactDOM.findDOMNode(self.refs.neutral).checked;
                if(neutralState){
                    ReactDOM.findDOMNode(self.refs.home).checked = false;
                    ReactDOM.findDOMNode(self.refs.away).checked = false;
                    self.forceUpdate();
                }else{
                    ReactDOM.findDOMNode(self.refs.home).checked = true;
                    self.neutralVenue = false;
                    ReactDOM.findDOMNode(self.refs.away).checked = false;
                    self.callService('home');
                }
                break;
            default:
                self.neutralVenue = false;
                ReactDOM.findDOMNode(self.refs.home).checked = true;
                self.callService('home');
                break;
        }
    },
    checkStatus:function(el){
        var self = this;
        return ReactDOM.findDOMNode(self.refs[el]).checked;
    },
    callService:function(param){
        var self = this,
            binding = self.getDefaultBinding();
        if(param === 'away'){
            window.Server.findPostCodeById.get({postCode:binding.get('rivals.1.postcodeId')})
                .then(function(postcode){
                    binding.set('venue',postcode);
                    binding.set('model.venue.postcode',postcode.id);
                    self.forceUpdate();
                    return postcode;
                })
                .catch(function(er){
                    console.log(er);
                });
        }else{
            binding.set('venue',self.currentPostcode);
            binding.set('model.venue.postcode',self.currentPostcode.id);
            self.forceUpdate();
        }
    },
    getPostcodes:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            venueList = binding.get('venueList');
        if(venueList !== undefined){
            return venueList.map(function(venue,venueId){
                return (
                    <option key={venueId} value={venue.id}>{venue.id}</option>
                )
            });
        }
    },
    postcodeSelectionChange:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            selectElement = ReactDOM.findDOMNode(self.refs.postcodes),
            selectedVal = binding.get('venueList').filter(function(cp){
                return cp.id === selectElement.value;
            });
        binding.set('venue',selectedVal[0]);
        binding.set('model.venue.postcode',selectedVal[0].id);
        self.forceUpdate();

    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            venuePoint = binding.get('venue'),
            point = venuePoint!== undefined ? venuePoint.point : {"lat": 50.832949, "lng": -0.246722};
        return(
            <div>
                <span>Change Venue</span>
                <If condition={self.props.sportType === 'inter-schools'}>
                    <div style={{marginBottom:10+'px',marginTop:10+'px'}}>
                        <label style={{marginRight:4+'px'}}>Home</label><input ref="home" type="checkbox" onChange={function(){self.onRadioButtonChange('home')}}/>
                        <label style={{marginRight:4+'px'}}>Away</label><input ref="away" type="checkbox" onChange={function(){self.onRadioButtonChange('away')}}/>
                        <label style={{marginRight:4+'px'}}>Neutral</label><input ref="neutral" type="checkbox" onChange={function(){self.onRadioButtonChange('neutral')}}/>
                    </div>
                </If>
                <If condition={self.neutralVenue === true}>
                    <div style={{marginTop:10+'px', marginBottom:10+'px'}}>
                        <select ref="postcodes" onChange={self.postcodeSelectionChange}>
                            {self.getPostcodes()}
                        </select>
                    </div>
                </If>
                <div>
                    <Map binding={binding} point={point} customStylingClass="eEvents_venue_map"/>
                </div>
            </div>
        )
    }
});
module.exports = EventVenue;
