const React = require('react');

const EventResultView = React.createClass({
	propTypes: {
		model: React.PropTypes.object.isRequired
	},

	render: function() {
		const model = this.props.model;

		return (
			<div className="bEventResultView">
				<div className="eEventResultView_bodyLeftSide">
					<div className="eEventResultView_mainInfoBlock">
						{ model.rivals[0].value }
					</div>
					<div className="eEventResultView_score">
						{ model.scoreAr[0] }
					</div>
				</div>
				<div className="eEventResultView_bodyRightSide">
					<div className="eEventResultView_score">
						{ model.scoreAr[1] }
					</div>
					<div className="eEventResultView_mainInfoBlock mRight">
						{ model.rivals[1].value }
					</div>
				</div>
			</div>
		)
	}
});

module.exports = EventResultView;