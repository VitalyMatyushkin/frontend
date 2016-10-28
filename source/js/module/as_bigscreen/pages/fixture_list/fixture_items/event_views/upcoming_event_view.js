const React = require('react');

const UpcomingEventView = React.createClass({
	propTypes: {
		model: React.PropTypes.object.isRequired
	},

	render: function() {
		const model = this.props.model;

		return (
			<div className="bUpcomingEventView">
				<div className="eUpcomingEventView_bodyLeftSide">
					<div className="eUpcomingEventView_mainInfoBlock">
						{ `${model.rivals[0].value} vs ${model.rivals[1].value}` }
					</div>
				</div>
				<div className="eUpcomingEventView_bodyRightSide mRight">
					{ `${model.date} - ${model.time}` }
				</div>
			</div>
		)
	}
});

module.exports = UpcomingEventView;