const React = require('react');

const BigEventResultView = React.createClass({
	propTypes: {
		model: React.PropTypes.object.isRequired
	},

	render: function() {
		const model = this.props.model;

		return (
			<div className="bBigEventResultView">
				<div className="bBigEventResultView_bodyLeftSide">
					<div className="eBigEventResultView_mainInfoBlock">
						{ model.rivals[0].value }
					</div>
					<div className="bBigEventResultView_score">
						{ model.scoreAr[0] }
					</div>
				</div>
				<div className="bBigEventResultView_bodyRightSide">
					<div className="bBigEventResultView_score">
						{ model.scoreAr[1] }
					</div>
					<div className="bBigEventResultView_mainInfoBlock mRight">
						{ model.rivals[1].value }
					</div>
				</div>
			</div>
		);
	}
});

module.exports = BigEventResultView;