/**
 * Created by bridark on 24/06/15.
 */
var AdminArchive,
    DateTimeMixin = require('module/mixins/datetime');
AdminArchive = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        window.Server.Permissions.get({
            filter:{
                include:['principal','school'],
                where:{
                    or:[
                        {accepted:true},{accepted:false}
                    ]
                },
                order:'meta.created ASC'
            }
        }).then(function(results){
            binding
                .atomically()
                .set('requestsArchive', Immutable.fromJS(results))
                .set('sync',true)
                .commit();
            console.log(binding.get('requestsArchive').toJS());
        });
    },
    _renderArchiveList:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            archives = binding.get('requestsArchive');
        if(archives !== undefined){
            return archives.toJS().map(function(archItem){
                var response = archItem.accepted === true ? 'Accepted' :'Declined';
                return(
                    <div className="eDataList_listItem">
                        <div className="eDataList_listItemCell">{self.getDateFromIso(archItem.meta.created)}</div>
                        <div className="eDataList_listItemCell">{archItem.preset}</div>
                        <div className="eDataList_listItemCell">{archItem.principal.email}</div>
                        <div className="eDataList_listItemCell">{archItem.school.name}</div>
                        <div className="eDataList_listItemCell">{response}</div>
                    </div>
                )
            });
        }
    },
    render:function(){
        var self = this,
            archiveList = self._renderArchiveList();
        return(
            <div className="bDataList">
                <div className="eDataList_list mTable">
                    <div className="eDataList_listItem mHead">
                        <div className="eDataList_listItemCell" style={{width:10+'%'}}>Date</div>
                        <div className="eDataList_listItemCell" style={{width:10+'%'}}>Request</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>From</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>For</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>Response</div>
                    </div>
                    {archiveList}
                </div>
            </div>
        );
    }
});
module.exports = AdminArchive;