/**
 * Created by bridark on 27/07/15.
 */
var GroupAction,
    GrantRole = require('module/as_admin/pages/admin_schools/admin_comps/grant_role'),
    requestName,
    Popup = require('module/ui/popup');
GroupAction = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        actionList:React.PropTypes.array.isRequired,
        serviceName:React.PropTypes.string.isRequired
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
            return listArray.map(function(item){
                return (
                    <div onClick={function(){self.handleActionItemClick(item)}}>{item}</div>
                );
            });
        }
    },
    handleActionItemClick:function(selectedName){
        var self = this,
            el = React.findDOMNode(self.refs.selectedAction);
        el.innerText = selectedName;
        self.toggleActionList();
    },
    toggleCheckBoxes:function(){
        var self = this;
        for(var i=0; i<self.checkBoxCollections.length; i++)self.checkBoxCollections.item(i).checked = self.checkBoxCollections.item(i).checked === false;
    },
    handleApplyActionClick:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            el = React.findDOMNode(self.refs.selectedAction);
        if(el.innerText !== ''){
            var selectedBoxesId = [];
            for(var x=0; x<self.checkBoxCollections.length; x++)if(self.checkBoxCollections.item(x).checked===true)selectedBoxesId.push(self.checkBoxCollections.item(x).dataset.id);
            switch (el.innerText){
                case 'Add Role':
                    if(selectedBoxesId.length >=1){
                        binding.set('popup',true);
                        binding.set('groupIds',selectedBoxesId);
                        self.forceUpdate();
                    }else{
                        alert("Please Select at least 1 row");
                    }
                    break;
                case 'Revoke All Roles':
                    self._revokeAllRoles(selectedBoxesId);
                    break;
                case 'Unblock':
                    self._accessRestriction(selectedBoxesId,0);
                    break;
                case 'Block':
                    self._accessRestriction(selectedBoxesId,1);
                    break;
                default :
                    break;
            }
        }else{
            alert('Please select an action to Apply');
        }
    },
    _revokeAllRoles:function(ids){
        var self = this;
        if(ids !== undefined && ids.length >= 1){
            ids.forEach(function(id){
                window.Server.Permissions.get({filter:{where:{principalId:id}}})
                    .then(function (res) {
                        res.forEach(function(p){
                            window.Server.Permission.delete({id:p.id}).then(function(response){
                                console.log(response);
                                window.location.reload(true);
                            });
                        });
                });
            });
            binding.set('popup',false);
        }
    },
    _accessRestriction:function(ids,action){
        var self = this;
        if(ids !== undefined && ids.length >= 1){
            switch(action){
                case 0:
                    ids.forEach(function(id){
                        window.Server.user.put({id:id},{blocked:false}).then(function(res){
                            //console.log(res);
                            window.location.reload(true);
                        });
                    });
                    break;
                case 1:
                    ids.forEach(function(id){
                        window.Server.user.put({id:id},{blocked:true}).then(function(res){
                            //console.log(res);
                            window.location.reload(true);
                        });
                    });
                    break;
                default :
                    break;
            }
        }else{
            alert('Please select a row');
        }
    },
    _closePopup:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('popup',false);
        self.forceUpdate();
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
                                    <span ref="selectedAction"></span>
                                    <span className="caret" onClick={self.toggleActionList.bind(null, this)}></span>
                                    <div className={groupListClasses}>
                                        {groupActionList}
                                    </div>
                                </span>
                </div>
                <div className="groupAction_item">
                    <span className="applyAction" onClick={self.handleApplyActionClick.bind(null,this)}>Apply</span>
                </div>
                <Popup binding={binding} stateProperty={'popup'} onRequestClose={function(){self._closePopup()}} otherClass="bPopupGrant">
                    <GrantRole  binding={binding} />
                </Popup>
            </div>
        );
    }
});
module.exports = GroupAction;