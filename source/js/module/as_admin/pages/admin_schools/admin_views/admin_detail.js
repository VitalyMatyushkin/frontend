/**
 * Created by bridark on 09/06/15.
 */
var SchoolDetail,
    SVG = require('module/ui/svg'),
    Map = require('module/ui/map/map'),
    If = require('module/ui/if/if'),
    managerList;

SchoolDetail = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('routing.parameters.id');

        self.activeSchoolId = activeSchoolId;
        self.request = window.Server.schoolsFindOne.get({
            filter: {
                where: {
                    id: activeSchoolId
                },
                include: 'postcode'
            }
        }).then(function(data) {
            binding.set(Immutable.fromJS(data));
            window.Server.users.get({
                filter:{
                    where:{
                        id:binding.get('ownerId')
                    }
                }
            }).then(
                function(managers){
                    binding.set('schoolAdmins',Immutable.fromJS(managers));
                    self._updateManagerListData(binding.get('schoolAdmins').toJS());
                }
            );
            //window.Server.schoolAdmins.get({id:activeSchoolId}).then(function(admins){
            //    binding.set('schoolAdmins',Immutable.fromJS(admins));
            //    window.Server.schoolCoaches.get({id:activeSchoolId}).then(function(coaches){
            //        binding.set('schoolCoaches',Immutable.fromJS(coaches));
            //        self.isMounted() && self.forceUpdate(); console.log(binding.get('schoolAdmins').toJS()); console.log(binding.get('schoolCoaches').toJS());
            //        self._updateManagerListData(binding.get('schoolAdmins').toJS());
            //    });
            //});
        });
    },
    componentWillUnmount: function() {
        var self = this;

        self.request && self.request.abort();
    },
    _updateManagerListData:function(listData){
        var self = this,
            binding = self.getDefaultBinding(),
            deleteManager = function(value){
                return function (event){
                    //window.Server.school.delete({id:value}).then(function(result){
                    //        window.Server.schools.get().then(function(data){
                    //            binding.set('schoolList',Immutable.fromJS(data));
                    //            self._updateListData(binding.get('schoolList').toJS());
                    //        });
                    //    }
                    //);
                    console.log('delete');
                    event.stopPropagation();
                }
            },
            addRole = function(value){
                return function(event){
                    alert('Adds a new role to this user');
                    event.stopPropagation();
                }
            },
            removeRole = function(value){
                return function(event){
                    alert("removes a role from this user");
                    event.stopPropagation();
                }
            },
            editRole = function(value){
                return function(event){
                    alert('This will allow us to swap a role instead of removing or adding');
                }
            };
        managerList = listData.map(function(manager){
            return(
                <div className="eDataList_listItem">
                    <div className="eDataList_listItemCell"><span className="eChallenge_rivalPic"><img src={manager.avatar}/></span></div>
                    <div className="eDataList_listItemCell">{manager.username}</div>
                    <div className="eDataList_listItemCell">{manager.firstName}</div>
                    <div className="eDataList_listItemCell">{manager.lastName}</div>
                    <div className="eDataList_listItemCell">{manager.gender}</div>
                    <div className="eDataList_listItemCell">{typeof manager.status === 'undefined'? 'N/A': manager.status }</div>
                    <div className="eDataList_listItemCell mActions" style={{textAlign:'left', paddingLeft:0+'px'}}>
                        <span  onClick={addRole(manager.id)} className="bLinkLike">Add</span>
                        <span  onClick={removeRole(manager.id)} className="bLinkLike">Remove</span>
                        <span  onClick={editRole(manager.id)} className="bLinkLike">Edit</span>
                    </div>
                </div>
            )
        });
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            schoolPicture = binding.get('pic'),
            siteLink = binding.get('domain') + '.squadintouch.com',
            geoPoint = binding.toJS('postcode.point');


        return (
            <div>
                <h1 className="eSchoolMaster_title">
                    {schoolPicture ? <div className="eSchoolMaster_flag"><img src={schoolPicture}/></div> : ''}
                    {binding.get('name')}
                    <div className="eSchoolMaster_buttons">
                        <a href={'/#admin_schools/admin_views/edit?id=' + self.activeSchoolId} className="bButton">Edit...</a>
                    </div>
                </h1>
                <p>PostCode: {binding.get('postcodeId')}</p>

                <p>Address: {binding.get('address')}</p>

                <p>Description: {binding.get('description')}</p>

                <p>Site: <a href={'//' + siteLink} target="blank" title="binding.get('name') homepage">http://{siteLink}</a></p>

                <If condition={geoPoint}>
                    <Map binding={binding} point={binding.toJS('postcode.point')}/>
                </If>
                <div style={{marginTop:10+"px"}}>
                    <h1 className="eSchoolMaster_title"><span>Managers</span>
                        <div className="eSchoolMaster_buttons">
                            <div className="eDataList_listItemCell">
                                <div className="eDataList_filter">
                                    <input className="eDataList_filterInput" onChange={self.onChange}  placeholder={'filter by name'} />
                                </div>
                            </div>
                        </div>
                    </h1>
                    <div className="bDataList">
                        <div className="eDataList_list mTable">
                            <div className="eDataList_listItem mHead">
                                <div className="eDataList_listItemCell" style={{width:5+'%'}}>Avatar</div>
                                <div className="eDataList_listItemCell" style={{width:12+'%'}}>Username</div>
                                <div className="eDataList_listItemCell" style={{width:15+'%'}}>First Name</div>
                                <div className="eDataList_listItemCell" style={{width:15+'%'}}>Last Name</div>
                                <div className="eDataList_listItemCell" style={{width:10+'%'}}>Gender</div>
                                <div className="eDataList_listItemCell" style={{width:20+'%'}}>Status</div>
                                <div className="eDataList_listItemCell" style={{width:23+'%'}}>Role Actions</div>
                            </div>
                            {managerList}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});


module.exports = SchoolDetail;
