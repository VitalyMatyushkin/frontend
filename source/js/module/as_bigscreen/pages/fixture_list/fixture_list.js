const	React				= require('react'),

		DefaultHeader		= require('./../default_header'),
		FixtureItem			= require('./fixture_items/fixture_item'),
		UpcomingFixtureItem	= require('./fixture_items/upcoming_fixture_item'),
		BigScreenConsts		= require('./../consts/consts');

const FixtureList = React.createClass({
	propTypes: {
		mode:			React.PropTypes.string.isRequired,
		title:			React.PropTypes.string.isRequired,
		logo:			React.PropTypes.string.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired,
		events:			React.PropTypes.array.isRequired
	},

	getFixtureListByEvents: function(events) {
		switch (this.props.mode) {
			case BigScreenConsts.FIXTURE_LIST_MODE.UPCOMING:
				return events.map( event =>
					<UpcomingFixtureItem key={event.id} event={event} activeSchoolId={this.props.activeSchoolId}/>
				);
			case BigScreenConsts.FIXTURE_LIST_MODE.RECENT:
				return events.map( event =>
					<FixtureItem key={event.id} event={event} activeSchoolId={this.props.activeSchoolId}/>
				);
		}
	},
	render: function() {
		const events = this.props.events;

		return (
			<div className="bBigScreenFixtures">
				<DefaultHeader title={this.props.title} logo={this.props.logo}/>
				<div className="eBigScreenFixtures_body">
					{ this.getFixtureListByEvents(events) }
				</div>
			</div>
		);
	}
});

module.exports = FixtureList;