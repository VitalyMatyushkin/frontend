/**
 * Created by bridark on 09/06/15.
 */
var List = require('module/ui/list/list'),
    ListField = require('module/ui/list/list_field'),
    Table = require('module/ui/list/table'),
    TableField = require('module/ui/list/table_field'),
    DateTimeMixin = require('module/mixins/datetime'),
    SVG = require('module/ui/svg'),
    ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
    SchoolListPage,
    theList;

SchoolListPage = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        window.Server.schools.get().then(function(data){
             binding.set('schoolList',Immutable.fromJS(data));
            self._updateListData(binding.get('schoolList').toJS());
        });
    },
    _updateListData:function(listData){
        var self = this,
            binding = self.getDefaultBinding(),
            deleteSchool = function(value){
                return function (event){
                    var confirmDelete = confirm("Do you want to delete school ?");
                    if(confirmDelete){
                        window.Server.school.delete({id:value}).then(function(result){
                                window.Server.schools.get().then(function(data){
                                    binding.set('schoolList',Immutable.fromJS(data));
                                    self._updateListData(binding.get('schoolList').toJS());
                                });
                            }
                        );
                    }
                    event.stopPropagation();
                }
            };
        theList = listData.map(function(school){
            return(
                <div className="eDataList_listItem" onClick={self.onSchoolClick.bind(null,school.id)}>
                    <div className="eDataList_listItemCell"><span className="eChallenge_rivalPic"><img src={school.pic}/></span></div>
                    <div className="eDataList_listItemCell">{school.name}</div>
                    <div className="eDataList_listItemCell">{school.phone}</div>
                    <div className="eDataList_listItemCell">{school.address}</div>
                    <div className="eDataList_listItemCell">{school.domain}</div>
                    <div className="eDataList_listItemCell">{typeof school.status === 'undefined'? 'N/A': school.status}</div>
                    <div className="eDataList_listItemCell mActions">
                        <span  onClick={deleteSchool(school.id)} className="bLinkLike">Delete</span>
                    </div>
                </div>
            )
        });
    },
    onSchoolClick:function(value){
        console.log('click'+value);
        document.location.hash = '/admin_schools/admin_views/detail?id='+value
    },
    onChange:function(event){
        var self = this,
            binding = self.getDefaultBinding();
            window.Server.schools.get({
                filter: {
                    where: {
                        name: {
                            like: event.currentTarget.value,
                            options: 'i'
                        }
                    }
                }
            }).then(function(filtered){
                binding.set('schoolList',Immutable.fromJS(filtered));
                self._updateListData(binding.get('schoolList').toJS());
            });
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
           <div>
               <h1 className="eSchoolMaster_title">
                   <span>List of Schools on SquadInTouch</span>
                   <div className="eSchoolMaster_buttons">
                       <div className="eDataList_listItemCell">
                           <div className="eDataList_filter">
                               <input className="eDataList_filterInput" onChange={self.onChange}  placeholder={'filter by school name'} />
                           </div>
                       </div>
                   </div>
               </h1>
               <div className="bDataList">
                   <div className="eDataList_list mTable">
                       <div className="eDataList_listItem mHead">
                           <div className="eDataList_listItemCell" style={{width:3+'%'}}>Logo</div>
                           <div className="eDataList_listItemCell" style={{width:20+'%'}}>
                               Name
                           </div>
                           <div className="eDataList_listItemCell" style={{width:15+'%'}}>Telephone</div>
                           <div className="eDataList_listItemCell" style={{width:37+'%'}}>Address</div>
                           <div className="eDataList_listItemCell" style={{width:20+'%'}}>Domain</div>
                           <div className="eDataList_listItemCell" style={{width:10+'%'}}>Status</div>
                           <div className="eDataList_listItemCell" style={{width:10+'%'}}>Actions</div>
                       </div>
                       {theList}
                   </div>
               </div>
           </div>
        )
    }
});


module.exports = SchoolListPage;