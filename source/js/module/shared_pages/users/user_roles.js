/**
 * Created by bridark on 30/06/15.
 */
const 	{SVG} 		= require('module/ui/svg'),
		Morearty    = require('morearty'),
    	React 		= require('react');

const UserRole = React.createClass({
    mixins:[Morearty.Mixin],
	revokeRole: function (permissionId) {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				userId 			= binding.toJS('userWithPermissionDetail.id'),
				subPermissions 	= binding.sub('userWithPermissionDetail.permissions'),
				newPermissions 	= subPermissions.toJS().filter(p => (p.id || p._id) !== permissionId),
				permission 		= subPermissions.toJS().find(p => (p.id || p._id) === permissionId);

		if(permission.preset === 'STUDENT') {
			window.simpleAlert(
				"It is impossible to remove the role of student!",
				'Ok',
				() => {}
			);
			return;
		}
		window.confirmAlert(
			"Are you sure you want to revoke this permission?",
			"Ok",
			"Cancel",
			() => {
				window.Server.userPermission.delete({userId:userId, permissionId:permissionId})
					.then(function(){
						subPermissions.set(newPermissions);
					});
			},
			() => {}
		);
	},
    getRoleData:function(){
        const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				permissions = binding.toJS('userWithPermissionDetail.permissions');

        var tempArray;
        if(typeof permissions !== 'undefined'){
            tempArray = permissions.map(function(permission){
                return(
                    <div key={permission.id || permission._id} className="bPopupEdit_row bRole">
                        <div className="bPopupEdit_role" style={{width:240+'px'}}>{permission.school ? permission.school.name:''}</div>
						<div className="bPopupEdit_role" style={{width:180+'px'}}>{permission.preset}</div>
						<div className="bPopupEdit_role" style={{width:180+'px'}}>{permission.comment}</div>
                        <span onClick={self.revokeRole.bind(null, permission.id || permission._id)}><SVG classes="bIcon-mod" icon="icon_trash" /></span>
                    </div>
                )
            });
            return tempArray;
        }
    },
    render:function(){
        const 	self  	= this,
            	binding = self.getDefaultBinding();

        return <div>
                    <div className="bPopupEdit_row" style={{marginTop:20+'px', borderTop: 2+'px solid black',borderBottom: 2+'px solid black'}}>
                        <div className="bPopupEdit_roleHead" style={{width:240+'px'}}>School</div>
                        <div className="bPopupEdit_roleHead" style={{width:180+'px'}}>Role</div>
                        <div className="bPopupEdit_roleHead">Details</div>
                        <div className="bPopupEdit_roleHead" style={{width:30+'px'}}>Actions</div>
                    </div>
                {self.getRoleData()}
            </div>;
    }
});


module.exports = UserRole;