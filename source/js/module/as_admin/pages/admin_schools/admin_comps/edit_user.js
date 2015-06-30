/**
 * Created by bridark on 29/06/15.
 */
var EditUser,
    userDetails,
    UserRole = require('./user_roles'),
    Roles,
    persistentId,
    If = require('module/ui/if/if');
EditUser = React.createClass({
    mixins:[Morearty.Mixin],
    getInitialState:function(){
        return {tabState:'detail'};
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            userId = binding.get('selectedUser').userId;
        window.Server.user.get(userId).then(function (data) {
            binding.set('form',Immutable.fromJS(data));
        });
    },
    getUserData:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            userId = binding.get('selectedUser').userId;
        window.Server.user.get(userId).then(function (data) {
            binding.set('form',Immutable.fromJS(data));
            userDetails = (<div className="bPopupEdit_in">
                    <div className="bPopupEdit_row">
                        <div className="bPopupEdit_field">
                            <div>Avatar</div>
                        </div>
                        <div className="bPopupEdit_fieldSet">
                            <div className="bPopupEdit_avatar">
                                <img style={{width:128+'px', height: 128+'px'}} src={binding.get('form').toJS().avatar} />
                            </div>
                        </div>
                    </div>
                    <div className="bPopupEdit_row"><div className="bPopupEdit_field"><div>First Name</div></div>
                        <div className="bPopupEdit_fieldSet"><input placeholder="First name" value={binding.get('form').toJS().firstName} /></div>
                    </div>
                    <div className="bPopupEdit_row"><div className="bPopupEdit_field"><div>Surname</div></div>
                        <div className="bPopupEdit_fieldSet"><input placeholder="Surname" value={binding.get('form').toJS().lastName} />
                        </div>
                    </div>
                    <div className="bPopupEdit_row">
                        <div className="bPopupEdit_field">
                            <div>Nickname</div>
                        </div>
                        <div className="bPopupEdit_fieldSet">
                            <input placeholder="nickname" value={binding.get('form').toJS().username}/>
                            <div>
                                <input type="checkbox" /> <span>Use the real name</span>
                            </div>
                        </div>
                    </div>
                    <div className="bPopupEdit_row">
                        <div className="bPopupEdit_field">
                            <div>Email</div>
                        </div>
                        <div className="bPopupEdit_fieldSet_verified">
                            <input placeholder="email" value={binding.get('form').toJS().email}/>
                        </div>
                        <div className="bPopupEdit_notify">
                            <span>v</span>
                        </div>
                    </div>
                    <div className="bPopupEdit_row">
                        <div className="bPopupEdit_field">
                            <div>Phone</div>
                        </div>
                        <div className="bPopupEdit_fieldSet_verified">
                            <input placeholder="phone" value={binding.get('form').toJS().phone}/>
                        </div>
                        <div className="bPopupEdit_notify">
                            <span>?</span>
                        </div>
                    </div>
                    <div className="bPopupEdit_row">
                        <div className="bPopupEdit_field">
                            <div>Status</div>
                        </div>
                        <div className="bPopupEdit_fieldSet">
                            <select>
                                <option value="registered">Registered</option>
                                <option value="unverified">Unverified</option>
                            </select>
                        </div>
                    </div>
                </div>);
            Roles = binding.get('selectedUser').role;
        });
    },
    submitEdit: function(data) {
        var self = this;
        data.id = self.userId;
        self.userId && window.Server.user.put(self.userId, data).then(function() {
            alert('user updated');
        });
    },
    componentWillUnmount:function(){
        var self = this;
        console.log('unmounted');
    },
    editTabClick:function(active){
        var self = this;
        if(active !== self.state.tabState){
            self.setState({tabState:active});
        }
        console.log(active);
    },
    _saveButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding();

    },
    _cancelButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('popup',false);
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        if(typeof binding.get('form') !== 'undefined'){
            if(binding.get('popup') === true)self.getUserData();
        }
        return (
            <div className="bPopupEdit_container">
                <div className="bPopupEdit_row">
                    <span onClick={function(){self.editTabClick('detail')}} className={self.state.tabState === 'detail'? 'bPopupEdit_tab bPopupEdit_active' :'bPopupEdit_tab'}>
                        User Details
                    </span>
                    <span onClick={function(){self.editTabClick('permission')}}  className={self.state.tabState === 'permission'? 'bPopupEdit_tab bPopupEdit_active' :'bPopupEdit_tab'}>
                        User Roles/Permissions
                    </span>
                </div>
                <If condition={self.state.tabState === 'detail'}>
                    <div>
                        {userDetails}
                        <div className="bPopupEdit_row">
                            <span className="bPopupEdit_link">Create an email link for changing password</span>
                        </div>
                        <div className="bPopupEdit_row">
                            <input type="button" onClick={function(){self._saveButtonClick()}} className="bButton bGrantButton" value="Save"/>
                            <input type="button" onClick={function(){self._cancelButtonClick()}} className="bButton bGrantButton" value="Cancel"/>
                        </div>
                    </div>
                </If>
                <If condition={self.state.tabState === 'permission'}>
                    <div>
                        <UserRole binding={binding} />
                    </div>
                </If>
            </div>
        )
    }
});
module.exports = EditUser;