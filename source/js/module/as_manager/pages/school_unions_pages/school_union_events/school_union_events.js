const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const	RouterView	= require('module/core/router'),
		Route		= require('module/core/route');

const	CalendarWrapper	= require('module/as_manager/pages/school_unions_pages/school_union_events/calendar/calendar_wrapper');

const SchoolUnionEvents = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			schoolUnionEventsRouting:	{},
			calendar:					{}
		});
	},
	render: function() {
		const	binding		= this.getDefaultBinding(),
				rootBinging	= this.getMoreartyContext().getBinding();

		return (
			<div>
				<div className='bSchoolMaster'>
					<RouterView
						routes	= { binding.sub('schoolUnionEventsRouting') }
						binding	= { rootBinging }
					>
						<Route
							path			= '/events/calendar'
							binding			= { binding.sub('calendar') }
							component		= { CalendarWrapper }
							activeSchoolId	= { this.props.activeSchoolId }
						/>
					</RouterView>
				</div>
			</div>
		);
	}
});

module.exports = SchoolUnionEvents;