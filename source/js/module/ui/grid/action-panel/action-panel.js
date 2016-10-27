/**
 * Created by Anatoly on 24.07.2016.
 */
const   React 	= require('react'),
		SVG		= require('module/ui/svg'),
		If 		= require('module/ui/if/if');

const ActionPanel = React.createClass({
	propTypes: {
		model: React.PropTypes.object.isRequired
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
			</div>
		);
	}
});

module.exports = ActionPanel;