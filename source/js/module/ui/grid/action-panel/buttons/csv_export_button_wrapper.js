const React = require('react');

const CSVExportButtonWrapper = React.createClass({
	propTypes: {
		model:			React.PropTypes.object.isRequired,
		handleClick:	React.PropTypes.func.isRequired
	},
	render: function() {
		const model = this.props.model;

		const CSVExportButton = model.btnCSVExport;

		return (
			<CSVExportButton
				handleClick = { this.props.handleClick }
			/>
		);
	}
});

module.exports = CSVExportButtonWrapper;