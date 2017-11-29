const	React			= require('react'),
		Morearty		= require('morearty'),
		UserActions		= require('./users-actions-class'),
		{Grid}			= require('module/ui/grid/grid'),
		GrantRole		= require('module/as_manager/pages/school_console/grant_role/grant_role'),
		ConfirmPopup	= require('../../../ui/confirm_popup'),
		Immutable		= require('immutable');

const	CSVExportPopupStyle	= require('styles/ui/b_csv_export_popup/b_csv_export_popup.scss');

const Users = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		grantRole: 					React.PropTypes.func,
		permissionServiceName: 		React.PropTypes.string,
		blockService: 				React.PropTypes.object,
		addButton:					React.PropTypes.func,
		customActionList:			React.PropTypes.array,
		//The function, which will call when user click on <Row> in Grid
		handleClick:				React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			grantRole: GrantRole,
			permissionServiceName: 'schoolUserPermission'
		};
	},
	componentWillMount: function () {
		const	binding	= this.getDefaultBinding(),
				grid	= binding.toJS('grid');

		binding.set('isShowCSVExportPopup', false);

		if (grid) {
			this.model = new UserActions(this).createGridFromExistingData(grid);
		} else {
			this.model = new UserActions(this).createGrid();
		}
	},
	handleSuccess: function() {
		this.closePopup();
		this.model.reloadData();
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
								userPermissionsBinding	= {binding.sub('groupPermissions')}
								onSuccess			= {this.handleSuccess}
								handleClickCancel	= {this.closePopup}
					/>
				</ConfirmPopup>
			);
		} else {
			return null;
		}
	},
	renderCSVExportPopup: function () {
		const binding = this.getDefaultBinding();

		if(binding.get('isShowCSVExportPopup')) {
			return (
				<ConfirmPopup
					isShowButtons = { false }
				>
					<div
						className = 'bCSVExportPopup'
					>
						Loading data. It will take some time.
					</div>
				</ConfirmPopup>
			);
		} else {
			return null;
		}
	},
	render: function () {
		const binding = this.getDefaultBinding();

		binding.set('grid', Immutable.fromJS(this.model.grid));

		return this.model.grid ? (
			<div className="eTable_view">
				<Grid model={this.model.grid}/>
				{ this.renderPopup() }
				{ this.renderCSVExportPopup() }
			</div>
		) : null;
	}

});

module.exports = Users;