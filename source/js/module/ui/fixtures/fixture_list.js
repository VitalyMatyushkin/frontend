/**
 * Created by Anatoly on 22.09.2016.
 */

const 	React 		= require('react'),
		{DateHelper} 	= require('module/helpers/date_helper'),
		Lazy 		= require('lazy.js'),
		FixtureItem = require('./fixture_item');

const FixtureList = React.createClass({
	propTypes: {
		events: React.PropTypes.array.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func
	},
	/**
	 * Get event list by date
	 * @param {string} date - date in string format "dd.mm.yyyy"
	 * @returns {array} - array of FixtureItem components
	 * */
	getEvents: function (date) {
		const 	self = this,
				eventsByDate = self.props.events.filter(e => DateHelper.getDate(e.startTime) === date);

		return eventsByDate.map(event => {
			return (
				<FixtureItem	key				= {'item-'+event.id}
								event			= {event}
								activeSchoolId	= {self.props.activeSchoolId}
								onClick			= {this.props.onClick}
				/>
			);
		});
	},
	render: function() {
		let result = null;

		const dates = Lazy(this.props.events).map(e => DateHelper.getDate(e.startTime)).uniq().toArray();

		if (dates.length === 0) {
			result = (
				<div className="eUserFullInfo_block">No fixtures to report</div>
			);
		} else {
			result = dates.sort().map((date, dtIndex) => {
				return (
					<div key={dtIndex} className="bChallengeDate">
						<div className="eChallengeDate_wrap">
							<div className="eChallengeDate_date">{date}</div>
							<div className="eChallengeDate_list">{this.getEvents(date)}</div>
						</div>
					</div>
				);
			});
		}

		return <div>{result}</div>;
	}
});

module.exports = FixtureList;