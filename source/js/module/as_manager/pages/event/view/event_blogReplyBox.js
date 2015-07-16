/**
 * Created by bridark on 14/07/15.
 */
var BlogReplyBox,
    If = require('module/ui/if/if');
BlogReplyBox = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        parentCheckBool: React.PropTypes.bool,
        replyParentId: React.PropTypes.string.isRequired,
        replyParentName: React.PropTypes.string
    },
    getInitialState:function(){
        return{showReplyBox:false};
    },
    _toggleReplyBox:function(){
        var self = this,
            currentState = self.state.showReplyBox;
        if(currentState === true){
            self.setState({showReplyBox:false});
            self.forceUpdate();
        }else{
            self.setState({showReplyBox:true});
            self.forceUpdate();
        }
    },
    _replyToSubmit:function(){
        console.log('called even');
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            blogModel = {
                eventId:binding.get('eventId'),
                ownerId:globalBinding.get('userData.authorizationInfo.userId'),
                postId:binding.get('blogCount')+1,
                message:React.findDOMNode(self.refs.replyTextArea).value + '/'+self.props.replyParentName, //TODO: Ideally we want a field in database for reply username reference
                parentId:self.props.replyParentId,
                hidden:false
            };
        if(globalBinding.get('userData.authorizationInfo.userId') !== undefined || self.props.parentCheckBool === true){
            window.Server.addToBlog.post({id:binding.get('eventId')},blogModel).then(function (blog) {
                var filteredBag = [],
                    filteredChild =[];
                window.Server.addToBlog.get({id:binding.get('eventId'),filter:{order:'postId ASC'}})
                    .then(function(comments){
                        comments.forEach(function(comment){
                            window.Server.user.get({id:comment.ownerId})
                                .then(function(author){
                                    comment.commentor = author;
                                    //commentsBag.push(comment);
                                    if(comment.parentId == 1){filteredBag.push(comment)}else{filteredChild.push(comment)}
                                    filteredBag.forEach(function(par,index){
                                        if(filteredChild !== undefined){
                                            par.replies = filteredChild.filter(function(child){
                                                return child.parentId === par.id;
                                            });
                                            if(par.replies.length >=1){par.replies.reverse();filteredBag[index] = par}
                                            binding.set('blogs',Immutable.fromJS(filteredBag));
                                        }
                                    });
                                });
                        });
                        self._toggleReplyBox();
                    });
                window.Server.getCommentCount.get({id:binding.get('eventId')}).then(function(res){
                    binding.set('blogCount', res.count);
                });
            });
        }else{
            alert("You cannot comment on this forum");
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div>
                <span onClick={self._toggleReplyBox.bind(null,this)} className="bLinkLike bBlog_replyButton_reply">Reply</span>
                <If condition={self.state.showReplyBox}>
                    <div className="bBlog_textArea_container">
                        <Morearty.DOM.textarea ref="replyTextArea"  className="eEvent_comment eEvent_commentBlog eBlog_replyTextArea"/>
                        <span onClick={self._replyToSubmit.bind(null,this)} className="bButton bReplyButton">Reply</span>
                        <span onClick={self._toggleReplyBox.bind(null,this)} className="bButton bReplyButton cancel">Cancel</span>
                    </div>
                </If>
            </div>
        )
    }
});
module.exports = BlogReplyBox;