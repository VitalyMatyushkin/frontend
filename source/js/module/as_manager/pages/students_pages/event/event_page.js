const	React		= require('react'),
		Morearty	= require('morearty');

const Event = require('module/as_manager/pages/event/event');

const EventFormConsts = require('module/as_manager/pages/events/manager/event_form/consts/consts');

const EventPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultProps: function() {
		return {
			mode: EventFormConsts.EVENT_FORM_MODE.SCHOOL
		};
	},
	componentWillMount: function () {
		this.activeSchoolId = this.getActiveSchoolId();
	},
	getActiveSchoolId: function() {
		return this.getMoreartyContext().getBinding().get('routing.parameters.schoolId');
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<Event
				binding					= { binding }
				activeSchoolId			= { this.activeSchoolId }
				isShowControlButtons	= { false }
				mode					= { this.props.mode }
			/>
		);
	}
});

module.exports = EventPage;