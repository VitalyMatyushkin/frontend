const	React		= require('react'),
		Checkbox	= require('module/ui/checkbox/checkbox');

const IndividualScoreManagerStyles = require('styles/ui/individual_score_checkbox/individual-score-checkbox.scss');

const IndividualScoreManager = React.createClass({
	propTypes: {
		value:		React.PropTypes.bool.isRequired,
		onChange:	React.PropTypes.func.isRequired
	},
	render: function() {
		return (
			<div className="eIndividualScoreCheckbox">
				Individual score available
				<Checkbox
					isChecked	= {this.props.value}
					onChange	= {this.props.onChange}
				/>
			</div>
		);
	}
});

module.exports = IndividualScoreManager;