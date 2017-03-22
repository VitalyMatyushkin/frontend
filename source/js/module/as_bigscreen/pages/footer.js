const	React			= require('react'),

		ChallengeModel	= require('./../../ui/challenges/challenge_model');

const Footer = React.createClass({
	propTypes: {
		event:			React.PropTypes.object,
		activeSchoolId:	React.PropTypes.string.isRequired
	},

	render: function() {
		if (typeof this.props.event !== 'undefined') {
			const model = new ChallengeModel(
				this.props.event,
				this.props.activeSchoolId
			);
			
			return (
				<div className="bFooter">
					{`Upcoming: ${model.time} / ${model.sport} / ${model.rivals[0].value} vs. ${model.rivals[1].value}`}
				</div>
			);
		} else {
			return null
		}

	}
});

module.exports = Footer;