/**
 * Created by Anatoly on 25.07.2016.
 */

const   React 		= require('react'),
		Morearty	= require('morearty'),
		Actions 	= require('module/ui/grid/test-pages/users-actions'),
		Grid 		= require('module/ui/grid/grid'),
		GrantRole   = require('module/as_manager/pages/school_console/grant_role/grant_role'),
		Popup 		= require('module/ui/popup');

const Users = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		grantRole: React.PropTypes.func,
		permissionServiceName: React.PropTypes.string,
		blockService: React.PropTypes.object
	},
	getDefaultProps: function () {
		return {
			grantRole: GrantRole,
			permissionServiceName: 'schoolUserPermission'
		};
	},
	componentWillMount: function () {
		this.actions = new Actions(this);
	},
	_closePopup: function () {
		var self = this,
			binding = self.getDefaultBinding();
		binding.set('popup', false);
		self.actions.reloadData();
	},
	render: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			GrantRole = self.props.grantRole;

		return (
			<div className="eTable_view">
				<Grid model={this.actions.grid}/>
				<Popup binding={binding} stateProperty={'popup'} onRequestClose={self._closePopup}
					   otherClass="bPopupGrant">
					<GrantRole binding={binding.sub('grantRole')} userIdsBinding={binding.sub('groupIds')}
							   onSuccess={self._closePopup}/>
				</Popup>
			</div>
		);
	}
});

module.exports = Users;