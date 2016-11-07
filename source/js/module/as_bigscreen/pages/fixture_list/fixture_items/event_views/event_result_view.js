const React = require('react');

const EventResultView = React.createClass({
	propTypes: {
		model: React.PropTypes.object.isRequired
	},

	render: function() {
		const model = this.props.model,
		leftOpponent = model.rivals[0].value.replace(/\s+/g, ' '),
		rightOpponent = model.rivals[1].value.replace(/\s+/g, ' '),
		leftSideClasses  = leftOpponent.length > 25 ? "mSmall" : "",
		rightSideClasses  = rightOpponent.length > 25 ? "mSmall" : "";


		return (
			<div className="bEventResultView">
				<div className="eEventResultView_bodyLeftSide">
					<div className="eEventResultView_mainInfoBlock">
						<div className={leftSideClasses}>{ leftOpponent }</div>
					</div>
					<div className="eEventResultView_score mRight">
						{ model.scoreAr[0] }
					</div>
				</div>
				<span className="eSeparator"></span>
				<div className="eEventResultView_bodyRightSide">
					<div className="eEventResultView_score">
						{ model.scoreAr[1] }
					</div>
					<div className="eEventResultView_mainInfoBlock mRight">
						<div className={rightSideClasses}>{ rightOpponent }</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = EventResultView;