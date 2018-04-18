/**
 * Created by Anatoly on 08.10.2016.
 */

const	React				= require('react'),
		Immutable 			= require('immutable'),

		Header 				= require('./header'),
		SchoolChallenges 	= require('./school_challenges'),
		{NoResultItem}		= require('../../../../../../ui/challenges/no_result_item');

const AllSchoolChallenges = React.createClass({
	propTypes: {
		onClick:		React.PropTypes.func,
		isSync:			React.PropTypes.bool,
		isDaySelected:	React.PropTypes.bool,
		schools:		React.PropTypes.instanceOf(Immutable.List).isRequired,
		events:			React.PropTypes.instanceOf(Immutable.List)
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
				schools			= this.props.schools,
				onEventClick	= this.props.onClick;

		switch (true) {
			/* when no day selected */
			case isDaySelected !== true:
				return <NoResultItem text="Please select day"/>;
			/* when data is still loading */
			case isSync !== true:
				return <NoResultItem text="Loading..."/>;
			/* when there are some events */
			case schools && schools.count() > 0 && events && events.count() > 0:
				return schools.map(school =>  {
					return (
						<SchoolChallenges
							key		= { school.get('id') }
							school	= { school }
							events	= { events }
							onClick	= { onEventClick }
						/>
					);
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