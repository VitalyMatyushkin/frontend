const 	React		= require('react'),
		Morearty	= require('morearty');

const	Calendar		= require('module/as_manager/pages/school_unions_pages/school_union_events/calendar/calendar'),
		Challenges		= require('module/ui/challenges/challenges'),
		AddEventButton	= require('module/as_manager/pages/events/calendar/add_event_button');

const	EventsStyles	= require('styles/pages/events/b_events.scss');

const CalendarWrapper = React.createClass({
	mixins:[Morearty.Mixin ],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired
	},
	redirectToManagerPage: function () {
		document.location.hash = 'events/manager';
	},
	handleClickAddButton: function () {
		this.redirectToManagerPage();
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<div className="bEvents">
				<div className="eEvents_container">
					<div className="eEvents_row">
						<div className="eEvents_leftSideContainer">
							<Calendar
								binding	= { binding }
							/>
						</div>
						<div className="eEvents_rightSideContainer">
							<Challenges
								activeSchoolId 		= { this.props.activeSchoolId }
								isSync				= { true }
								events				= { [] }
								onClick				= { () => {} }
								onClickDeleteEvent	= { () => {} }
								isUserSchoolWorker	= { true }
							/>
							<AddEventButton
								handleClick	= { this.handleClickAddButton }
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = CalendarWrapper;