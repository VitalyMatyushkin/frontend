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
				<div className="eIndividualScoreText">
					Individual score available
				</div>
				<Checkbox
					isChecked	= {this.props.value}
					onChange	= {this.props.onChange}
					customCss	= {'mInline'}
				/>
			</div>
		);
	}
});

module.exports = IndividualScoreManager;