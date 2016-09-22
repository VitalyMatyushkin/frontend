/**
 * Created by Anatoly on 22.09.2016.
 */

const 	React 		= require('react'),
		DateHelper 	= require('module/helpers/date_helper'),
		FixtureItem = require('./fixture_item');

const FixtureList = function(props) {
	function sameDay(d1, d2) {
		d1 = d1 instanceof Date ? d1 : new Date(d1);
		d2 = d2 instanceof Date ? d2 : new Date(d2);

		return d1.getUTCFullYear() === d2.getUTCFullYear() &&
			d1.getUTCMonth() === d2.getUTCMonth() &&
			d1.getUTCDate() === d2.getUTCDate();
	}
	function getEvents(date) {
		const eventsByDate = props.events.filter(event => {
			return sameDay(
				new Date(event.startTime),
				new Date(date));
		});

		const result = eventsByDate.map(event => {
			return (
				<FixtureItem key={'item-'+event.id} event={event} activeSchoolId={props.activeSchoolId} />
			);
		});

		return result;
	}

	let result = null;

	const dates = props.events.reduce(function (memo, val) {
		var date = Date.parse(val.startTime),
			any = memo.some(function (d) {
				return sameDay(date, d);
			});

		if (!any) {
			memo.push(date);
		}

		return memo;
	}, []);

	if (dates.length === 0) {
		result = (
			<div className="eUserFullInfo_block">No fixtures to report on this child</div>
		);
	} else {
		result = dates.sort().map((datetime, dtIndex) => {
			const date = DateHelper.getDate(datetime);

			return (
				<div key={dtIndex} className="bChallengeDate">
					<div className="eChallengeDate_wrap">
						<div className="eChallengeDate_date">{date}</div>
						<div className="eChallengeDate_list">{getEvents(datetime)}</div>
					</div>
				</div>
			);
		});
	}

	return <div>{result}</div>;
};
FixtureList.propTypes = {
	events: React.PropTypes.array,
	activeSchoolId: React.PropTypes.string
};

module.exports = FixtureList;