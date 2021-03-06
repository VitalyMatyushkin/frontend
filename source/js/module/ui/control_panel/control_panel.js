const	React					= require('react'),

		classNames				= require('classnames'),

		ControlPanelStyles		= require('./../../../../styles/ui/b_control_panel.scss');

const ControlPanel = React.createClass({
	propTypes: {
		// array with control react elements, like input, button, radio button or anything else
		controlArray:	React.PropTypes.array.isRequired,
		extraStyle:		React.PropTypes.string
	},

	getStyle: function () {
		return classNames('bControlPanel', this.props.extraStyle);
	},

	renderControlElements: function() {
		return this.props.controlArray.map((control, index) => {
			const sectionStyle = classNames({
				'eControlPanel_section': true,
				'mLast':				index === this.props.controlArray.length - 1
			});
			return (
				<div key={index} className={sectionStyle}>
					{control}
				</div>
			);
		});
	},

	render: function(){
		return (
			<div className={this.getStyle()}>
				{this.renderControlElements()}
			</div>
		);
	}
});

module.exports = ControlPanel;