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
	getInitialState: function() {
		return {
			isShowAllItems: false
		};
	},
	handleClickShowAllItemsButton: function() {
		this.setState( {isShowAllItems: !this.state.isShowAllItems} );
	},
	renderFixtureList: function(){
		const	events			= this.props.events,
				isDaySelected	= this.props.isDaySelected,
				isSync			= this.props.isSync,
				activeSchoolId	= this.props.activeSchoolId;

		switch(true) {
			case isDaySelected !== true:
				return <div className="bFixtureMessage">{"Please select day."}</div>;
			case isSync && Array.isArray(events) && events.length > 0:
				let _events;
				// just copy all events
				// 1) when events count less or equal 5
				// 2) when this.state.isShowAllItems is TRUE and events count more then 5
				if(
					events.length <= 5 ||
					(
						this.state.isShowAllItems &&
						events.length > 5
					)
				) {
					_events = events;
				} else {
					// show first five events
					_events = events.slice(0, 5);
				}

				return _events.map( e => <FixtureItem key={e.id} event={e} activeSchoolId={activeSchoolId} />);
			case isSync && Array.isArray(events) && events.length === 0:
				return <div className="bFixtureMessage">{"There aren't fixtures for current date"}</div>;
			default:
				return <div className="bFixtureMessage">{"Loading..."}</div>;
		}
	},
	renderShowAllItemsButton: function() {
		const	events = this.props.events,
				isSync = this.props.isSync;

		// show when events counts more then five
		if(isSync && Array.isArray(events) && events.length > 5) {
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