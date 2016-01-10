/**
 * Created by bridark on 29/06/15.
 */
const   UserRole    = require('./user_roles'),
        React       = require('react'),
        If          = require('module/ui/if/if'),
        Immutable   = require('immutable'),
        $           = require('jquery');

let userDetails, Roles, persistentId;

const EditUser = React.createClass({
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
            self.getUserData();
        });
    },
    componentDidMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            registered;
        setTimeout(function(){
            registered = document.getElementById('statusSelector');
            if(binding.get('form') !== undefined){
                if(binding.get('form').toJS().verified.email === false && binding.get('form').toJS().verified.phone === false){
                    var option = document.createElement('option');
                    option.text = "Registered";
                    registered.add(option,registered[0]); registered.selectedIndex = 0;
                }
            }
        },500);
    },
    getUserData:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            userNameCheck = function(){
                if(document.getElementById('nameCheck').checked === true){
                    document.getElementById('username').value = document.getElementById('firstName').value+document.getElementById('lastName').value;
                }else{
                    document.getElementById('username').value = binding.get('form').toJS().username;
                }
            },
            verificationCheck = function(field){
                var toCheck,
                    checkConfirm;
                toCheck = binding.get('form').toJS().verified.email;
                return function(evt){
                    checkConfirm = window.confirm("This will change user verification status, you sure you want to proceed?");
                    if(checkConfirm === true){
                        if(field === 'email'){
                            if(toCheck === false){
                                self.verifiedEmail = true; console.log(document.getElementById('emNotify'));
                                document.getElementById('emNotify').innerText = 'v';
                                document.getElementById('emNotify').style.color = 'Green';
                            }else{
                                self.verifiedEmail = false;
                                document.getElementById('emNotify').innerText = '?';
                                document.getElementById('emNotify').style.color = 'orangered';
                            }
                        }else{
                            toCheck = binding.get('form').toJS().verified.email;
                            if(toCheck === false){
                                self.verifiedPhone = true;
                                document.getElementById('phNotify').innerText = 'v';
                                document.getElementById('phNotify').style.color = 'Green';
                            }else{
                                self.verifiedPhone = false;
                                document.getElementById('phNotify').innerText = '?';
                                document.getElementById('phNotify').style.color = 'orangered';
                            }
                        }
                    }
                    evt.stopPropagation();
                }
            },
            uploadImage = function(){
                return function(evt){
                   // console.log('changed');
                    //console.log(evt.target.files[0]);
                    var file = evt.target.files[0],
                        uri,
                        fileName,
                        formData;
                    window.Server.addAlbum.post(
                        {name:binding.get('form').toJS().lastName,
                            ownerId:binding.get('selectedUser').userId,
                            description:'avatar',
                            eventId:binding.get('selectedUser').userId
                        }).then(function(album) {
                            //console.log(album);
                            uri = window.apiBase +'/storage/'+album.storageId;
                            formData = new FormData();
                            fileName = Math.random().toString(12).substring(7) + '.' + file.name.split('.')[1];
                            formData.append('file', file, fileName);
                            $.ajax({
                                url: uri + '/upload',
                                type: 'POST',
                                success: function(res) {
                                    var uploadedFile = res.result.files.file[0],
                                        model = {
                                            name: uploadedFile.name,
                                            albumId: album.id,
                                            description: uploadedFile.name,
                                            authorId:album.ownerId,
                                            pic: uri + '/files/' + uploadedFile.name
                                        };
                                    window.Server.photos.post(album.id, model).then(function(data){
                                        console.log(data);
                                        document.getElementById('pic').value = 'http:'+uri+'/files/'+fileName;
                                        document.getElementById('editAvatar').src = 'http:'+uri+'/files/'+fileName;
                                    });
                                },
                                // Form data
                                data: formData,
                                //Options to tell jQuery not to process data or worry about content-type.
                                cache: false,
                                contentType: false,
                                processData: false
                            });
                    });
                    evt.stopPropagation();
                }
            },
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
                                <img id="editAvatar" style={{width:128+'px', height: 128+'px'}} src={binding.get('form').toJS().avatar} />
                            </div>
                            <div>
                                <span>
                                    <input type="file" onChange={uploadImage()}  />
                                </span>
                                <input type="hidden" id="pic" />
                            </div>
                        </div>
                    </div>
                    <div className="bPopupEdit_row"><div className="bPopupEdit_field"><div>First Name</div></div>
                        <div className="bPopupEdit_fieldSet"><input id="firstName" placeholder="First name" value={binding.get('form').toJS().firstName} /></div>
                    </div>
                    <div className="bPopupEdit_row"><div className="bPopupEdit_field"><div>Surname</div></div>
                        <div className="bPopupEdit_fieldSet"><input id="lastName" placeholder="Surname" value={binding.get('form').toJS().lastName} />
                        </div>
                    </div>
                    <div className="bPopupEdit_row">
                        <div className="bPopupEdit_field">
                            <div>Nickname</div>
                        </div>
                        <div className="bPopupEdit_fieldSet">
                            <input id="username" placeholder="nickname" value={binding.get('form').toJS().username}/>
                            <div>
                                <input id="nameCheck" onClick={function(){userNameCheck();}} type="checkbox" /> <span>Use the real name</span>
                            </div>
                        </div>
                    </div>
                    <div className="bPopupEdit_row">
                        <div className="bPopupEdit_field">
                            <div>Email</div>
                        </div>
                        <div className="bPopupEdit_fieldSet_verified">
                            <input id="email" placeholder="email" value={binding.get('form').toJS().email}/>
                        </div>
                        <div className="bPopupEdit_notify">
                            <span id="emNotify" onClick={verificationCheck('email')} className={binding.get('form').toJS().verified.email === true? 'bPopup_verified':'bPopup_unverified'}>{binding.get('form').toJS().verified.email === true? 'v':'?'}</span>
                        </div>
                    </div>
                    <div className="bPopupEdit_row">
                        <div className="bPopupEdit_field">
                            <div>Phone</div>
                        </div>
                        <div className="bPopupEdit_fieldSet_verified">
                            <input id="phone" placeholder="phone" value={binding.get('form').toJS().phone}/>
                        </div>
                        <div className="bPopupEdit_notify">
                            <span id="phNotify" onClick={verificationCheck('phone')} className={binding.get('form').toJS().verified.phone === true? 'bPopup_verified':'bPopup_unverified'}>{binding.get('form').toJS().verified.phone === true? 'v':'?'}</span>
                        </div>
                    </div>
                    <div className="bPopupEdit_row">
                        <div className="bPopupEdit_field">
                            <div>Status</div>
                        </div>
                        <div className="bPopupEdit_fieldSet">
                            <select id="statusSelector">
                                <option value={binding.get('form').toJS().blocked}>{binding.get('form').toJS().blocked === false ? 'Active' :'Blocked'}</option>
                                <option value={!binding.get('form').toJS().blocked}>{!binding.get('form').toJS().blocked === true ? 'Blocked' :'Active'}</option>
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
    },
    editTabClick:function(active){
        var self = this;
        if(active !== self.state.tabState){
            self.setState({tabState:active});
        }
    },
    _saveButtonClick:function(){
        var self, binding, userModel,verifiedMail, verifiedPhone;
        self = this;
        binding = self.getDefaultBinding();
        verifiedMail = typeof self.verifiedEmail !=='undefined'? self.verifiedEmail:false;
        verifiedPhone = typeof self.verifiedPhone !=='undefined'? self.verifiedPhone:false;
        userModel = {
            avatar:document.getElementById('editAvatar').src,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            blocked: document.getElementById('statusSelector').options[document.getElementById('statusSelector').selectedIndex].value !== 'false',
            verified:{
                email:verifiedMail,
                phone:verifiedPhone
            }
        };
        var confirmChanges = confirm('Are you sure you want to make these changes?');
        if(confirmChanges === true){
            window.Server.user.put({id:binding.get('selectedUser').userId},userModel).then(function(){
                alert("Changes successfully made");
                //TODO: reloading page to affect re-fetching data to match selected user
                location.reload(true);
            });
        }
    },
    _cancelButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('popup',false);
        //TODO: reloading page to affect re-fetching data to match selected user
        location.reload(true);
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        //if(typeof binding.get('form') !== 'undefined'){
        //    if(binding.get('popup') === true)self.getUserData();
        //}
        return (
            <div className="bPopupEdit_container">
                <div className="bPopupEdit_row eTab">
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
                            <span onClick={function(){alert('Not yet implemented')}} className="bPopupEdit_link">Create an email link for changing password</span>
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