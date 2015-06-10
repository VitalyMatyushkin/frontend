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
            activeSchoolId = globalBinding.get('routing.parameters.id'); console.log(activeSchoolId);

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
            window.Server.schoolAdmins.get({id:activeSchoolId}).then(function(admins){
                binding.set('schoolAdmins',Immutable.fromJS(admins));
                window.Server.schoolCoaches.get({id:activeSchoolId}).then(function(coaches){
                    binding.set('schoolCoaches',Immutable.fromJS(coaches));
                    self.isMounted() && self.forceUpdate(); console.log(binding.get('schoolAdmins').toJS()); console.log(binding.get('schoolCoaches').toJS());
                    self._updateManagerListData(binding.get('schoolAdmins').toJS());
                });
            });
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
            };
        managerList = listData.map(function(manager){
            return(
                <div className="eDataList_listItem">
                    <div className="eDataList_listItemCell"><span className="eChallenge_rivalPic"><img src={manager.gender}/></span></div>
                    <div className="eDataList_listItemCell">{manager.firstName}</div>
                    <div className="eDataList_listItemCell">{manager.lastName}</div>
                    <div className="eDataList_listItemCell">{manager.status}</div>
                    <div className="eDataList_listItemCell mActions">
                        <span  onClick={deleteManager(manager.id)} className="bLinkLike">Delete</span>
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
                    <h1 className="eSchoolMaster_title">Managers</h1>
                    <div className="bDataList">
                        <div className="eDataList_list mTable">
                            <div className="eDataList_listItem mHead">
                                <div className="eDataList_listItemCell" style={{width:3+'%'}}>Gender</div>
                                <div className="eDataList_listItemCell" style={{width:20+'%'}}>
                                    First Name
                                    <div className="eDataList_filter">
                                        <input className="eDataList_filterInput" onChange={self.onChange}  placeholder={'filter'} />
                                    </div>
                                </div>
                                <div className="eDataList_listItemCell" style={{width:15+'%'}}>Last Name</div>
                                <div className="eDataList_listItemCell" style={{width:10+'%'}}>Status</div>
                                <div className="eDataList_listItemCell" style={{width:10+'%'}}>Actions</div>
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
