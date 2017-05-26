const	React					= require('react'),
		SmallCheckboxBlockStyle	= require('../../../../../../styles/ui/b_small_checkbox_block.scss');

const RememberrMeCheckbox = React.createClass({
	propTypes: {
		isChecked:	React.PropTypes.bool.isRequired,
		onChange:	React.PropTypes.func.isRequired
	},
	render: function() {
		return (
			<div className="bSmallCheckboxBlock">
				<div className="eForm_fieldInput mInline">
					<input
						className	= "eSwitch"
						type		= "checkbox"
						checked		= { this.props.isChecked }
						onChange	= { this.props.onChange }
					/>
					<label/>
				</div>
				<div className="eSmallCheckboxBlock_label">
					Remember me
				</div>
			</div>
		);
	}
});

module.exports = RememberrMeCheckbox;