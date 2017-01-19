/**
 * Created by Anatoly on 08.10.2016.
 */

const	React				= require('react'),
		Immutable 			= require('immutable'),

		Header 				= require('./header'),
		SchoolChallenges 	= require('./school_challenges'),
		NoResultItem		= require('../../../../../../ui/challenges/no_result_item');

const AllSchoolChallenges = React.createClass({
	propTypes: {
		onClick:		React.PropTypes.func,
		isSync:			React.PropTypes.bool,
		isDaySelected:	React.PropTypes.bool,
		school:			React.PropTypes.instanceOf(Immutable.List).isRequired,
		events:			React.PropTypes.instanceOf(Immutable.List)			// Immutable map events
	},
	getDefaultProps: function () {
		return {
			isDaySelected: true
		};
	},
	getEvents: function () {
		const 	isSync			= this.props.isSync,
				isDaySelected	= this.props.isDaySelected,
				events			= this.props.events,
				school			= this.props.school,
				onEventClick	= this.props.onClick;

		switch (true) {
			/* when no day selected */
			case isDaySelected !== true:
				return <NoResultItem text="Please select day"/>;
			/* when data is still loading */
			case isSync !== true:
				return <NoResultItem text="Loading..."/>;
			/* when there are some events */
			case school && school.count() > 0 && events && events.count() > 0:
				return school.map( sch =>  {
					return <SchoolChallenges key={sch.get('id')} school={sch} events={events} onClick={onEventClick}/>;
				});
			default:
				return <NoResultItem text="There are no events for selected day"/>;
		}
	},
	render: function() {
		return (
			<div className="eEvents_challenges mChildrenNames">
				<Header />
				{this.getEvents()}
			</div>
		);
	}
});

module.exports = AllSchoolChallenges;