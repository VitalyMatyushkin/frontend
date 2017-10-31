const	React		= require('react'),

		DateHelper	= require('./../../../../../helpers/date_helper');

const UpcomingEventView = React.createClass({
	propTypes: {
		model: React.PropTypes.object.isRequired
	},

	getDate: function(model) {
		switch (true) {
			case DateHelper.isToday(model.dateUTC):
				return model.time;
			case DateHelper.isTomorrow(model.dateUTC):
				return `Tomorrow ${model.time}`;
			default:
				return `${DateHelper.getShortDateString(new Date(model.dateUTC))} ${model.time}`;
		}
	},

	render: function() {
		const model = this.props.model,
			leftOpponent = model.rivals[0].value,
			rightOpponent = model.rivals[1].value,
			classes  = leftOpponent.length > 25 || rightOpponent.length > 25 ? "mSmall" : "";

		return (
			<div className="bUpcomingEventView">
				<div className="eUpcomingEventView_bodyLeftSide">
					<div className="eUpcomingEventView_mainInfoBlock">
						<div className={classes}>
							{model.name}
						</div>
					</div>
				</div>
				<div className="eUpcomingEventView_bodyRightSide mRight">
					{ this.getDate(model) }
				</div>
			</div>
		)
	}
});

module.exports = UpcomingEventView;