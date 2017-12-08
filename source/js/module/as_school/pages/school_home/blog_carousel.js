/**
 * Created by bridark on 03/08/15.
 */
const   {SVG}       = require('module/ui/svg'),
        Immutable 	= require('immutable'),
        Morearty    = require('morearty'),
        React       = require('react');

const BlogCarousel = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
    },
    getInitialState:function(){
        return{updateBlogContents:false}
    },
    componentWillMount:function(){
        var self  = this,
            binding = self.getDefaultBinding();
        self.itemHeight = 0;
    },
    componentDidMount:function(){
        var self = this;
        setTimeout(function(){
            self._getAuthorForComments();
        },2000);
    },
    _getAuthorForComments:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            fixtures = binding.toJS('fixtures'),
            blogArray = [];
        if(typeof fixtures !== 'undefined'){
            window.Server.addToBlog.get({id:fixtures[2].id, filter:{order:'meta.created DESC',limit:3}}).then(function(fix){
                fix.forEach(function(fixture){
                    window.Server.user.get({id:fixture.ownerId}).then(function(author){
                        fixture.author = author;
                        blogArray.push(fixture);
                        binding.set('commentsWithAuthor',Immutable.fromJS(blogArray));
                    });
                });
            });
        }
    },
    _renderCommentsWithAuthors:function(contents){
        var self = this,
            binding = self.getDefaultBinding();
        if(contents !== undefined){
            return contents.map(function(content){
                return(
                    <div key={content.id} style={{position:'relative', width:100+'%', height:248+'px', float:'left'}}>
                        <div className="blogAuthorPicCarousel">
                            <div className="authorPic">
                                <img src={content.author.avatar}/>
                            </div>
                        </div>
                        <div className="blogCommentCarousel">
                            <blockquote>{' "'+content.message+'" ...'}</blockquote>
                            <span>{content.author.firstName+" "+content.author.lastName}</span>
                            <span>Coach</span>
                        </div>
                    </div>
                )
            });
        }else{
            return (
                <div>{'no contents'}</div>
            )
        }
    },
    handleChevronClick:function(param){
        var self = this,
            carousel = React.findDOMNode(self.refs.blogScroll);
        if(param === 'panUp' && self.itemHeight < 744){
            self.itemHeight += 248;
            carousel.style.marginTop = self.itemHeight+'px';
        }
        //    carouselItemHeight = 248;
        //if(param === 'panUp' && self.itemHeight < 744){
        //    self.itemHeight +=248;
        //    carousel.style.marginTop = -self.itemHeight+'px';
        //}else if(param ==='panDown'){
        //    if(self.itemHeight >= 744){
        //        self.itemHeight = 248;
        //        carousel.style.marginTop = -self.itemHeight+'px';
        //    }else{
        //        self.itemHeight = 0;
        //        carousel.style.marginTop = self.itemHeight+'px';
        //    }
        //}
    },
    render:function(){
        var self  = this,
            binding = self.getDefaultBinding(),
            contentForCarousel = self._renderCommentsWithAuthors(binding.toJS('commentsWithAuthor'));
        return (
            <div className="testChildren carouselUpScroll">
                <div ref="blogScroll" style={{position:'relative', width:100+'%', height:248+'px', float:'left', overflow:'scroll'}}>
                    {contentForCarousel}
                </div>
                <span ref="panUp" onClick={function(){self.handleChevronClick('panUp')}} className="carouselChevron chevUp">
                   <SVG icon="icon_chevron-up" classes="chevronMod-1"></SVG>
                </span>
                <span ref="panDown" onClick={function(){self.handleChevronClick('panDown')}} className="carouselChevron chevDown">
                    <SVG icon="icon_chevron-down" classes="chevronMod-2"></SVG>
                </span>
            </div>
        );
    }
});
module.exports = BlogCarousel;