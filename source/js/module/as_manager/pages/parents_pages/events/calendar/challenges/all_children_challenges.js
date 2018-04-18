/**
 * Created by Anatoly on 08.10.2016.
 */

const	React			= require('react'),
		Immutable 		= require('immutable'),

		Header 			= require('./header'),
		ChildChallenges = require('./child_challenges'),
		{NoResultItem}	= require('../../../../../../ui/challenges/no_result_item');

const AllChildrenChallenges = React.createClass({
	propTypes: {
		onClick:		React.PropTypes.func,
		isSync:			React.PropTypes.bool,
		isDaySelected:	React.PropTypes.bool,
		children:		React.PropTypes.instanceOf(Immutable.List).isRequired,
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
				children		= this.props.children,
				onEventClick	= this.props.onClick;

		switch (true) {
			/* when no day selected */
			case !isDaySelected: {
				return <NoResultItem text="Please select day"/>;
			}
			/* when data is still loading */
			case !isSync: {
				return <NoResultItem text="Loading..."/>;
			}
			/* when there are some events */
			case (
				typeof children !== 'undefined' &&
				children.count() > 0 &&
				typeof events !== 'undefined' &&
				events.count() > 0
			): {
				return children.map(child =>
					<ChildChallenges
						key		= { child.get('id') }
						child	= { child }
						events	= { events }
						onClick	= { onEventClick }
					/>
				);
			}
			default: {
				return <NoResultItem text="There are no events for selected day"/>;
			}
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

module.exports = AllChildrenChallenges;