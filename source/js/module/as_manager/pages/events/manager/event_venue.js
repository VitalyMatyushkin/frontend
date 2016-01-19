/**
 * Created by Bright on 19/01/2016.
 */
const React = require('react'),
    Map = require('module/ui/map/map'),
    Immutable = require('immutable'),
    ReactDOM = require('reactDom');
const EventVenue = React.createClass({
    mixins:[Morearty.Mixin],
    displayName:'EventVenue',
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        window.Server.findPostCodeById.get({postCode:binding.get('rivals.0.postcodeId')})
            .then(function(postcode){
                self.currentPostcode = postcode;
                ReactDOM.findDOMNode(self.refs.home).checked = true;
                binding.set('venue',postcode);
                self.forceUpdate();
                return postcode;
            })
            .catch(function(er){
                console.log(er);
            });
    },
    onRadioButtonChange:function(reference){
        var self = this,
            binding = self.getDefaultBinding();
        switch (reference){
            case 'home':
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
            default:
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
                    self.forceUpdate();
                    return postcode;
                })
                .catch(function(er){
                    console.log(er);
                });
        }else{
            binding.set('venue',self.currentPostcode);
            self.forceUpdate();
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            venuePoint = binding.get('venue'),
            point = venuePoint!== undefined ? venuePoint.point : {"lat": 50.832949, "lng": -0.246722};
        return(
            <div>
                <span>Change Venue</span>
                <div style={{marginBottom:10+'px',marginTop:10+'px'}}>
                    <label style={{marginRight:4+'px'}}>Home</label><input ref="home" type="checkbox" onChange={function(){self.onRadioButtonChange('home')}}/>
                    <label style={{marginRight:4+'px'}}>Away</label><input ref="away" type="checkbox" onChange={function(){self.onRadioButtonChange('away')}}/>
                </div>
                <div>
                    <Map binding={binding} point={point} customStylingClass="eEvents_venue_map"/>
                </div>
            </div>
        )
    }
});
module.exports = EventVenue;
