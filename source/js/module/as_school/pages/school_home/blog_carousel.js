/**
 * Created by bridark on 03/08/15.
 */
var BlogCarousel;
BlogCarousel = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
    },
    componentWillMount:function(){
        var self  = this,
            binding = self.getDefaultBinding();
    },
    render:function(){
        var self  = this,
            binding = self.getDefaultBinding();
        return (
            <div ref="carousel" className = "carouselContainer">
                {self.props.children}
            </div>
        );
    }
});
module.exports = BlogCarousel;