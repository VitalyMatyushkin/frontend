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
    componentDidMount:function(){
        var self = this;
        setTimeout(function(){
            self._getAuthorForComments();
        },1000);
    },
    _getAuthorForComments:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            fixtures = binding.toJS('fixtures'),
            blogArray = [];
        if(fixtures !== undefined){
            //console.log(fixtures[2].id);
            window.Server.addToBlog.get({id:fixtures[2].id, filter:{order:'meta.created DESC',limit:4}}).then(function(fix){
                //console.log(fix);
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
        if(contents !== undefined){
            return contents.map(function(content){
                return(
                    <div key={content.id}>
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
        }
    },
    render:function(){
        var self  = this,
            binding = self.getDefaultBinding(),
            contentForCarousel = self._renderCommentsWithAuthors(binding.toJS('commentsWithAuthor'));
        //console.log(contentForCarousel);
        return (
            <div className="testChildren carouselUpScroll">
                {contentForCarousel}
            </div>
        );
    }
});
module.exports = BlogCarousel;