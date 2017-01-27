const	React			= require('react'),
		Morearty		= require('morearty'),
		Actions			= require('./users-actions'),
		Grid			= require('module/ui/grid/grid'),
		GrantRole		= require('module/as_manager/pages/school_console/grant_role/grant_role'),
		ConfirmPopup	= require('../../../ui/confirm_popup');

const Users = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		grantRole: 				React.PropTypes.func,
		permissionServiceName: 	React.PropTypes.string,
		blockService: 			React.PropTypes.object,
		addButton:				React.PropTypes.func
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
	handleSuccess: function() {
		this.closePopup();
		this.actions.reloadData();
	},
	closePopup: function () {
		const binding = this.getDefaultBinding();

		binding.set('popup', false);
	},

	renderPopup: function() {
		const	binding		= this.getDefaultBinding(),
				GrantRole	= this.props.grantRole;

		if(binding.get('popup')) {
			return (
				<ConfirmPopup isShowButtons={false}>
					<GrantRole	binding				= {binding.sub('grantRole')}
								userIdsBinding		= {binding.sub('groupIds')}
								onSuccess			= {this.handleSuccess}
								handleClickCancel	= {this.closePopup}
					/>
				</ConfirmPopup>
			);
		} else {
			return null;
		}
	},
	render: function () {
		return (
			<div className="eTable_view">
				<Grid model={this.actions.grid}/>
				{this.renderPopup()}
			</div>
		);
	}
});

module.exports = Users;