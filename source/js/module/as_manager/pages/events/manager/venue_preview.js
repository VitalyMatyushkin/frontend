/**
 * Created by Bright on 02/02/2016.
 */
const React = require('react'),
    Map = require('module/ui/map/map'),
    ReactDOM = require('reactDom');

const VenuePreview = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        if(binding.get('model.venue')){
            window.Server.findPostCodeById.get({postCode:binding.get('model.venue.postcode')})
                .then(function(venue){
                    binding.set('venuePreviewPoint', venue);
                    return venue;
                });
        }

    },
    componentDidMount:function(){
      var self = this;
        setTimeout(function(){
          self.forceUpdate();
        },500);
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            point = binding.get('venuePreviewPoint')!== undefined?binding.get('venuePreviewPoint').point:{"lat": 50.832949, "lng": -0.246722};
        return (
            <div style={{height:250+'px', width:100+'%'}}>
                <Map binding={binding} point={point} customStylingClass="bEvents_venue_preview"/>
            </div>
            )
    }
});
module.exports = VenuePreview;
