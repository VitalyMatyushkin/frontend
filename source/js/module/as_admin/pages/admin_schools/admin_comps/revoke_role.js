/**
 * Created by bridark on 29/06/15.
 */
var RevokeAccess;
RevokeAccess = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            currentUser = binding.get('selectedUser').userName;
        return (
            <div>
                <h1 className="eSchoolMaster_title">
                    Revoke Permissions for {currentUser} <br/>
                    <span>Role can be removed from edit and role tab - do we want it here too?</span>
                </h1>
                <div className="bDataList">
                    <div className="eDataList_list mTable">
                        <div className="eDataList_listItem mHead">
                            <div className="eDataList_listItemCell" style={{width:30+'%'}}>School</div>
                            <div className="eDataList_listItemCell" style={{width:8+'%'}}>Roles</div>
                            <div className="eDataList_listItemCell" style={{width:30+'%'}}>Additional Information</div>
                            <div className="eDataList_listItemCell" style={{width:20+'%'}}>Actions</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = RevokeAccess;