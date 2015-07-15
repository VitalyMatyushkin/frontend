/**
 * Created by bridark on 14/07/15.
 */
var BlogReplyBox,
    If = require('module/ui/if/if');
BlogReplyBox = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        onRequestCancel: React.PropTypes.func,
        onRequestClick: React.PropTypes.func,
        replyParentId: React.PropTypes.string.isRequired
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
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            blogModel = {
                eventId:binding.get('eventId'),
                ownerId:globalBinding.get('userData.authorizationInfo.userId'),
                message:React.findDOMNode(self.refs.replyTextArea).value,
                parentId:self.props.replyParentId,
                hidden:false
            };
        window.Server.addToBlog.post({id:binding.get('eventId')},blogModel).then(function (blog) {
            var filteredBag = binding.get('blogs').toJS(),
                filteredChild = binding.get('filteredChild').toJS();
            window.Server.user.get({id:blog.ownerId}).then(function (blogger) {
                blog.commentor = blogger;
                filteredChild.push(blog);
                filteredBag.forEach(function(par,index){
                    par.replies = filteredChild.filter(function(child){
                        return child.parentId === par.id;
                    });
                    filteredBag[index]=par;
                });
                binding.set('blogs',Immutable.fromJS(filteredBag));
                self._toggleReplyBox();
            });
        });
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