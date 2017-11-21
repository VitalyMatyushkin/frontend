const	React			= require('react'),
		Style			= require('styles/ui/admin_buttons.scss'),
		CSVExportConsts	= require('module/ui/grid/csv_export/consts');

const CSVExportButton = React.createClass({
	propTypes: {
		handleClick: React.PropTypes.func.isRequired
	},
	handleClick: function (e) {
		this.props.handleClick(e, CSVExportConsts.gridTypes.SUPERADMIN_USERS);
	},
	render: function() {
		return (
			<div
				className	= "bCSVDownloadButton"
				onClick		= { this.handleClick }
			>
			</div>
		);
	}
});

module.exports = CSVExportButton
;