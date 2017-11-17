const	React	= require('react'),
		SVG		= require('module/ui/svg');

const CSVExportConsts = require('module/ui/grid/csv_export/consts');

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
				className	= "bButtonAdd"
				onClick		= { this.handleClick }
			>
				<SVG icon="icon_pencil" />
			</div>
		);
	}
});

module.exports = CSVExportButton
;