const React = require('react');

const BigEventResultView = React.createClass({
	propTypes: {
		model: React.PropTypes.object.isRequired
	},

	render: function() {
		const model = this.props.model,
			leftOpponent = model.rivals[0].value,
			rightOpponent = model.rivals[1].value,
			leftSideClasses  = leftOpponent.length > 25 ? "mSmall" : "",
			rightSideClasses  = rightOpponent.length > 25 ? "mSmall" : "";

		return (
			<div className="bEventResultView mBig">
				<div className="bBigEventResultView_bodyLeftSide">
					<div className="eEventResultView_mainInfoBlock">
						<div className={leftSideClasses}>{ model.rivals[0].value }</div>
					</div>
					<div className="eEventResultView_score mRight">
						{ model.scoreAr[0] }
					</div>
				</div>
				<span className="eSeparator"></span>
				<div className="bBigEventResultView_bodyRightSide">
					<div className="eEventResultView_score">
						{ model.scoreAr[1] }
					</div>
					<div className="eEventResultView_mainInfoBlock mRight">
						<div className={rightSideClasses}>{ model.rivals[1].value }</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = BigEventResultView;