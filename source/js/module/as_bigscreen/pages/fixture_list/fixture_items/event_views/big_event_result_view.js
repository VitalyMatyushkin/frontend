const React = require('react');

const BigEventResultView = React.createClass({
	propTypes: {
		model: React.PropTypes.object.isRequired
	},

	render: function() {
		const model = this.props.model;

		return (
			<div className="bEventResultView mBig">
				<div className="bBigEventResultView_bodyLeftSide">
					<div className="eEventResultView_mainInfoBlock">
						{ model.rivals[0].value }
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
						{ model.rivals[1].value }
					</div>
				</div>
			</div>
		);
	}
});

module.exports = BigEventResultView;