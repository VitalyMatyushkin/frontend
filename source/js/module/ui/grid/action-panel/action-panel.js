/**
 * Created by Anatoly on 24.07.2016.
 */
const   React 	= require('react'),
		SVG		= require('module/ui/svg'),
		If 		= require('module/ui/if/if');

const CSVexportButtonWrapper = require('module/ui/grid/action-panel/buttons/csv_export_button_wrapper');

const ActionPanel = React.createClass({
	propTypes: {
		model:						React.PropTypes.object.isRequired,
		handleClickCSVExportButton:	React.PropTypes.func.isRequired
	},
	toggleFilters: function(e) {
		const model = this.props.model;

		model.toggleFilters();
		// TODO Why do you change "isFilterActive" in state?
		// Why isn't it enough change "isFilterActive" only in model?("toggleFilters" function change model.)
		// And where do you use state?
		this.setState({isFilterActive: model.isFilterActive});

		e.stopPropagation();
	},
	isShowCSVButtonExport: function () {
		return typeof this.props.model.btnCSVExport !== 'undefined';
	},
	render: function() {
		const model = this.props.model;

		return (
			<div className="bActionPanel">
				<If condition={!!model.title}>
					<h1 className="eTitle">{model.title}</h1>
				</If>
				<If condition={model.showStrip}>
					<div className="eStrip"></div>
				</If>
				<If condition={!model.hideBtnFilter}>
					<div className="filter_btn bTooltip" data-description="Filter" onClick={this.toggleFilters}>
						<SVG icon="icon_search"/> {model.isFilterActive ? '↑' : '↓'}
					</div>
				</If>
				<If condition={!!model.btnAdd}>
					{model.btnAdd}
				</If>
				<If condition={ this.isShowCSVButtonExport() }>
					<CSVexportButtonWrapper
						model		= { model }
						handleClick	= { this.props.handleClickCSVExportButton }
					/>
				</If>
			</div>
		);
	}
});

module.exports = ActionPanel;