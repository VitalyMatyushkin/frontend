/**
 * Created by bridark on 24/06/15.
 */
var ConsoleList,
    SVG = require('module/ui/svg');
ConsoleList = React.createClass({
    mixins:[Morearty.Mixin],
    _renderListData:function(data){
        var self = this,
            binding = self.getDefaultBinding();
        var splitName = function(key, locData){
            var n = locData.role[key][0].name.split(" ");
            return n = n[0]+' ' + n[1];
        };
        return data.map(function(data){
            var roles = [],
                atSchool = [],
                childAtSch = [],
                deleteEntry = function (entryId, entryName) {
                    var del = confirm("Do you want to delete "+entryName+" ?");
                    if(del){
                        window.Server.user.delete({id:entryId})
                            .then(function (res) {
                                console.log(res);
                                alert('User Deleted Successfully');
                                document.location.hash = 'admin_schools/admin_views/permissions';
                            });
                    }
                },
                gotoUser = function(userId){
                    document.location.hash = '/admin_schools/admin_views/user?id='+userId;
                };
            if(typeof data !== 'undefined'){
                if(typeof data.role !== 'undefined' && data.role !== null){
                    if(data.role.admin.length >=1){
                        roles.push('Admin');
                        atSchool.push(splitName('admin', data));
                    }
                    if(data.role.coach.length >=1){
                        roles.push('Coach');
                        atSchool.push(splitName('coach', data));
                    }
                    if(data.role.manager.length >=1){
                        roles.push('Manager');
                        atSchool.push(splitName('manager',data));
                    }
                    if(data.role.parent.length >=1){
                        roles.push('Parent');
                        for(var i= 0; i<data.role.parent.length; i++){
                            var childName = data.role.parent[i].firstName+" "+data.role.parent[i].lastName,
                                formName = data.role.parent[i].school.form.name,
                                schoolName = data.role.parent[i].school.details.name.split(" ");
                            atSchool.push(schoolName[0]+" "+schoolName[1]);
                            childName += "("+formName+")";
                            childAtSch.push(childName);
                        }
                    }
                    if(data.role.teacher.length >=1){
                        roles.push('Teacher');
                        atSchool.push(splitName('teacher', data));
                    }
                    if(roles.length >=1){
                        roles = roles.map(function(r){
                            return(
                                <div style={{paddingTop: 10+'px'}}>{r}</div>
                            )
                        });
                        atSchool = atSchool.map(function(s){
                            return(
                                <div style={{paddingTop: 10+'px'}}>{s}</div>
                            )
                        });
                        if(childAtSch.length >=1){
                            childAtSch = childAtSch.map(function(c){
                                return(
                                    <div style={{paddingTop: 10+'px'}}>{c}</div>
                                )
                            });
                        }
                    }
                }
                return (
                    <div className="eDataList_listItem" onClick={gotoUser.bind(null,data.id)}>
                        <div className="eDataList_listItemCell">{data.firstName+" "+data.lastName}</div>
                        <div className="eDataList_listItemCell">{data.email}</div>
                        <div className="eDataList_listItemCell">{data.phone}</div>
                        <div className="eDataList_listItemCell">{atSchool}</div>
                        <div className="eDataList_listItemCell">{roles}</div>
                        <div className="eDataList_listItemCell">{childAtSch}</div>
                        <div className="eDataList_listItemCell mActions">
                            <span><SVG classes="bIcon-mod" icon="icon_plus"/></span>
                            <span onClick={deleteEntry.bind(null,data.id, data.lastName)} style={{marginLeft: 10+'px'}}><SVG classes="bIcon-mod" icon="icon_trash" /></span>
                        </div>
                    </div>
                )
            }
        });
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            permList; //console.log(binding.toJS('permissionData'));
        if(typeof binding.toJS('allUsers') !== 'undefined'){permList = self._renderListData(binding.toJS('allUsers'));}
        return (
            <div className="eDataList_console">{permList}</div>);
    }
});
module.exports = ConsoleList;