/**
 * Created by wert on 06.09.16.
 */

const	React						= require('react'),
		FixtureItem					= require('./fixture_item'),
		FixtureShowAllItemsButton	= require('./fixture_show_all_item_button');

const FixtureList = React.createClass({
	propTypes: {
		title:			React.PropTypes.string.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired,
		isDaySelected:	React.PropTypes.bool.isRequired,
		isSync:			React.PropTypes.bool.isRequired,
		events:			React.PropTypes.any
	},
	// this is count of showing event for case when state.isShowAllItems === false
	EVENTS_COUNT: 3,

	getInitialState: function() {
		return {
			isShowAllItems: false
		};
	},
	handleClickShowAllItemsButton: function() {
		this.setState( {isShowAllItems: !this.state.isShowAllItems} );
	},
	getFixtureListByEvents: function(events) {
		return events.map( e => <FixtureItem key={ e.id } event={ e } activeSchoolId={ this.props.activeSchoolId } /> );
	},
	renderFixtureList: function(){
		const	events			= this.props.events,
				isDaySelected	= this.props.isDaySelected,
				isSync			= this.props.isSync;

		switch(true) {
			case isDaySelected !== true:
				return <div className="bFixtureMessage">{"Please select day."}</div>;
			case isSync && Array.isArray(events) && events.length === 0:
				return <div className="bFixtureMessage">{"There aren't fixtures for current date"}</div>;
			// if  0 < events count <= 5
			case isSync && Array.isArray(events) && (events.length > 0 && events.length <= this.EVENTS_COUNT):
				return this.getFixtureListByEvents(events);
			// if events count > EVENTS_COUNT and isShowAllItems === true
			case isSync && Array.isArray(events) && this.state.isShowAllItems:
				return this.getFixtureListByEvents(events);
			// if events count > EVENTS_COUNT and isShowAllItems === false
			case isSync && Array.isArray(events) && !this.state.isShowAllItems:
				return this.getFixtureListByEvents(events.slice(0, this.EVENTS_COUNT));
			default:
				return <div className="bFixtureMessage">{"Loading..."}</div>;
		}
	},
	renderShowAllItemsButton: function() {
		const	events = this.props.events,
				isSync = this.props.isSync;

		// show when events counts more then five
		if(isSync && Array.isArray(events) && events.length > this.EVENTS_COUNT) {
			return (
				<FixtureShowAllItemsButton	isShowAllItems={this.state.isShowAllItems}
											handleClick={this.handleClickShowAllItemsButton}
				/>
			);
		} else {
			return null;
		}
	},
	render: function(){
		return (
			<div className="eSchoolFixtures">
				<div className="eSchoolFixtureTab">
					<h1>{ this.props.title }</h1><hr/>
				</div>
				{ this.renderFixtureList() }
				{ this.renderShowAllItemsButton() }
			</div>
		);
	}
});


module.exports = FixtureList;