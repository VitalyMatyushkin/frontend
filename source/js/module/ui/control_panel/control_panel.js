const	React					= require('react'),

		ControlPanelStyles		= require('./../../../../styles/ui/b_control_panel.scss');

const ControlPanel = React.createClass({
	propTypes: {
		// array with control react elements, like input, button, radio button or anything else
		controlArray:	React.PropTypes.array.isRequired
	},

	renderControlElements: function() {
		return this.props.controlArray.map(control => {
			return (
				<div className="eControlPanel_section">
					{control}
				</div>
			);
		});
	},

	render: function(){
		return (
			<div className="bControlPanel">
				{this.renderControlElements()}
			</div>
		);
	}
});

module.exports = ControlPanel;