/**
 * Created by bridark on 03/08/15.
 */
var HomeBlog,
    SVG = require('module/ui/svg');
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
            carouselItemWidth = 959;
        if(targetStr === 'panLeft' && self.itemWidth < 1918){
            self.itemWidth +=959;
            carousel.style.marginLeft = -self.itemWidth+'px';
        }else if(targetStr ==='panRight'){
            if(self.itemWidth >= 1918){
                self.itemWidth = 959;
                carousel.style.marginLeft = -self.itemWidth+'px';
            }else{
                self.itemWidth = 0;
                carousel.style.marginLeft = self.itemWidth+'px';
            }
        }
    },
    renderCarouselItems:function(){
        return(
            <div className="testChildren">
                <div className="blogAuthorPicCarousel">
                    <div className="authorPic">
                        <img src="http://footballnews.ge/wp-content/uploads/2014/10/Enrique.jpg"/>
                    </div>
                </div>
                <div className="blogCommentCarousel">
                    <blockquote>&quot;The sporting program encourages active participation, fitness and fun over a comprehensive range of summer and winter sports&hellip; &quot;</blockquote>
                    <span>Jeremy McKay</span>
                    <span>Coach</span>
                </div>
            </div>
        )
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            oneOfItems = self.renderCarouselItems();
        return (
            <div className="eSchoolBlog">
                <div ref="carousel" className="carouselContainer">
                    {oneOfItems}
                    <div className="testChildren">2</div>
                    <div className="testChildren">3</div>
                </div>
                <span onClick={function(){self.handleChevronClick('panLeft')}} ref="panLeft" className="carouselChevron chevLeft">
                   <SVG icon="icon_chevron-left" classes="chevronMod"></SVG>
                </span>
                <span onClick={function(){self.handleChevronClick('panRight')}} ref="panRight" className="carouselChevron chevRight">
                    <SVG icon="icon_chevron-right" classes="chevronMod"></SVG>
                </span>
            </div>
        );
    }
});
module.exports = HomeBlog;