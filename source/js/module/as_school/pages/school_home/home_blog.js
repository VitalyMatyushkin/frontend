/**
 * Created by bridark on 03/08/15.
 */
var HomeBlog,
    BlogCarousel = require('./blog_carousel');
HomeBlog = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this;
        self.itemWidth = 0;
    },
    handleChevronClick:function(targetStr){
        var self = this,
            carousel = React.findDOMNode(self.refs.carousel),
            target = React.findDOMNode(self.refs[targetStr]),
            carouselItemWidth = 958;
        if(targetStr === 'panLeft' && self.itemWidth < 1916){
            self.itemWidth +=958;
            carousel.style.marginLeft = -self.itemWidth+'px';
        }else if(targetStr ==='panRight'){
            if(self.itemWidth >= 1916){
                self.itemWidth = 958;
                carousel.style.marginLeft = -self.itemWidth+'px';
            }else{
                self.itemWidth = 0;
                carousel.style.marginLeft = self.itemWidth+'px';
            }
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div className="eSchoolBlog">
                <div ref="carousel" className="carouselContainer">
                    <div className="testChildren">1</div>
                    <div className="testChildren">2</div>
                    <div className="testChildren">3</div>
                </div>
                <span onClick={function(){self.handleChevronClick('panLeft')}} ref="panLeft" className="carouselChevron chevLeft">Prev</span>
                <span onClick={function(){self.handleChevronClick('panRight')}} ref="panRight" className="carouselChevron chevRight">Next</span>
            </div>
        );
    }
});
module.exports = HomeBlog;