/**
 * Created by bridark on 24/06/15.
 */
var ConsoleList,
    SVG = require('module/ui/svg');
ConsoleList = React.createClass({
    mixins:[Morearty.Mixin],
    _renderListData:function(data){
        var self = this,
            binding = self.getDefaultBinding(),
            allPermissions = data.coaches.concat(data.admins).concat(data.teachers).concat(data.managers);
        var duplicates = [],
            nonDupes =[];
        allPermissions.forEach(function(ar,arInd){
            var key = ar.id;
            duplicates[key] = ar;
            allPermissions.forEach(function (arIn, arrId) {
                var inSideKey = arIn.id;
                if(inSideKey in duplicates){
                    //console.log('found');
                }else{
                    duplicates[inSideKey] = arIn;
                    nonDupes.push(arIn);
                }
            });
        });
        nonDupes.push(allPermissions[0]);
        //Find roles
        if(typeof nonDupes !== 'undefined' && nonDupes.length >=1 && nonDupes[0] !== 'undefined'){
            var modes = nonDupes.map(function(n){
                n.role = [];
                var coachCount = data.coaches.filter(function(c){
                        return c.id === n.id;
                    }),
                    teacherCount = data.teachers.filter(function (t) {
                        return t.id === n.id;
                    }),
                    adminCount = data.admins.filter(function(a){
                        return a.id === n.id;
                    }),
                    managerCount = data.managers.filter(function(m){
                        return m.id === n.id;
                    });
                if(coachCount.length >=1){n.role.push('Coach')}
                if(teacherCount.length >= 1){n.role.push('Teacher')}
                if(adminCount.length >=1){n.role.push('Admin')}
                if(managerCount.length >=1){n.role.push('Manager')}
                return n;
            });
        }
        return nonDupes.map(function(data){
            var roles,
                deleteEntry = function (entryId, entryName) {
                    var del = confirm("Do you want to delete "+entryName+" ?");
                    if(del){
                        window.Server.user.delete({id:entryId})
                            .then(function (res) {
                               console.log(res);
                                alert('User Deleted Successfully');
                                document.location.hash = 'school_console/permissions';
                            });
                    }
                };
            if(typeof data.role !== 'undefined' && data.role !== null){
                if(data.role.length >=1){
                    roles = data.role.map(function(r){
                        return(
                            <div style={{paddingTop: 10+'px'}}>{r}</div>
                        )
                    });
                }
            }
            return (
                <div className="eDataList_listItem">
                    <div className="eDataList_listItemCell">{data.firstName+" "+data.lastName}</div>
                    <div className="eDataList_listItemCell">{data.email}</div>
                    <div className="eDataList_listItemCell">{data.phone}</div>
                    <div className="eDataList_listItemCell">{roles}</div>
                    <div className="eDataList_listItemCell">{"No connection to child from user yet"}</div>
                    <div className="eDataList_listItemCell mActions">
                        <span onClick={deleteEntry.bind(null,data.id, data.lastName)} className="bLinkLike"><SVG classes="bIcon-mod" icon="icon_trash" /></span>
                    </div>
                </div>
            )
        });
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            permList; //console.log(binding.toJS('permissionData'));
        if(typeof binding.toJS('permissionData') !== 'undefined'){permList = self._renderListData(binding.toJS('permissionData'));}
        return (
            <div className="eDataList_console">{permList}</div>);
    }
});
module.exports = ConsoleList;