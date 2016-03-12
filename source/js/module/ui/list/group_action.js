/**
 * Created by bridark on 27/07/15.
 */
var GroupAction,
    requestName,
    React = require('react'),
    ReactDOM = require('reactDom');
GroupAction = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        actionList:React.PropTypes.array,
        serviceName:React.PropTypes.string.isRequired,
        groupActionFactory:React.PropTypes.func
    },
    getInitialState:function(){
        return{
            dropList:false
        };
    },
    getDefaultProps:function(){
        return {popup:false};
    },
    componentWillMount:function(){
        var self = this,
            binding  = self.getDefaultBinding();
        binding.set('popup', false);
        requestName = self.props.serviceName;
    },
    componentDidMount:function(){
        var self = this;
        self.checkBoxCollections =document.getElementsByClassName('tickBoxGroup');
    },
    toggleActionList:function(){
        var self = this,
            currentState = self.state.dropList;
        if(currentState === true){
            self.setState({dropList:false});
            self.forceUpdate();
        }else{
            self.setState({dropList:true});
            self.forceUpdate();
        }
    },
    renderGroupActionListItems:function(listArray){
        var self = this;
        if(listArray !== undefined){
            return listArray.map(function(item,i){
                return (
                    <div key={i} onClick={function(){self.handleActionItemClick(item)}}>{item}</div>
                );
            });
        }
    },
    handleActionItemClick:function(selectedName){
        var self = this,
            el = ReactDOM.findDOMNode(self.refs.selectedAction);
        el.innerText = selectedName;
        self.toggleActionList();
    },
    toggleCheckBoxes:function(){
        var self = this;
        for(var i=0; i<self.checkBoxCollections.length; i++)self.checkBoxCollections.item(i).checked = self.checkBoxCollections.item(i).checked === false;
    },
    _renderApplyButton:function(){
        var self = this,
            handleApplyClick = function(){return (evt)=>{self.props.groupActionFactory(ReactDOM.findDOMNode(self.refs.selectedAction),self.checkBoxCollections); evt.stopPropagation();}};
        return (
            <span className="applyAction" onClick={handleApplyClick()}>Apply</span>
        )
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            groupActionList = self.renderGroupActionListItems(self.props.actionList),
            groupListClasses = self.state.dropList === true ? 'groupActionList groupActionList_show' : 'groupActionList groupActionList_hide';
        return (
            <div className="groupAction">
                <div className="groupAction_item">
                    <input onClick={self.toggleCheckBoxes.bind(null,this)} type="checkbox"/> Check All</div>
                <div className="groupAction_item">
                    <span className="groupMenu">
                        <span ref="selectedAction"/>
                        <span className="caret" onClick={self.toggleActionList.bind(null, this)}/>
                        <div className={groupListClasses}>
                            {groupActionList}
                        </div>
                    </span>
                </div>
                <div className="groupAction_item">
                    {self._renderApplyButton()}
                </div>
            </div>
        );
    }
});
module.exports = GroupAction;