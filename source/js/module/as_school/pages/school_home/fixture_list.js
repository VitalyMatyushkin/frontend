/**
 * Created by wert on 06.09.16.
 */

const 	React		= require('react'),
		FixtureItem = require('./fixture_item');


const FixtureList = React.createClass({
	propTypes: {
		title:			React.PropTypes.string.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired,
		isDaySelected:	React.PropTypes.bool.isRequired,
		isSync:			React.PropTypes.bool.isRequired,
		events:			React.PropTypes.any
	},

	fixtureLists: function(){
		const	events			= this.props.events,
				isDaySelected	= this.props.isDaySelected,
				isSync			= this.props.isSync,
				activeSchoolId	= this.props.activeSchoolId;

		switch(true) {
			case isDaySelected !== true:
				return <div className="bFixtureMessage">{"Please select day."}</div>;
			case isSync && Array.isArray(events) && events.length > 0:
				return events.map( e => <FixtureItem key={e.id} event={e} activeSchoolId={activeSchoolId} />);
			case isSync && Array.isArray(events) && events.length === 0:
				return <div className="bFixtureMessage">{"There aren't fixtures for current date"}</div>;
			default:
				return <div className="bFixtureMessage">{"Loading..."}</div>;
		}
	},

	render: function(){
		const fixtures	= this.fixtureLists();

		return (
			<div className="eSchoolFixtures">
				<div className="eSchoolFixtureTab">
					<h1>{this.props.title}</h1><hr/>
				</div>
				{fixtures}
			</div>
		);
	}
});


module.exports = FixtureList;