const	React			= require('react'),
		Morearty		= require('morearty'),

		Event			= require('../../event/event');

const EventFormConsts = require('module/as_manager/pages/events/manager/event_form/consts/consts');

const EventPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.activeSchoolId = this.getActiveSchoolId();
	},
	getDefaultProps: function() {
		return {
			mode: EventFormConsts.EVENT_FORM_MODE.SCHOOL
		};
	},
	getActiveSchoolId: function() {
		return this.getMoreartyContext().getBinding().get('routing.parameters.schoolId');
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<Event	binding					= { binding }
					isShowControlButtons	= { false }
					activeSchoolId			= { this.activeSchoolId }
					mode					= { this.props.mode }
			/>
		);
	}
});

module.exports = EventPage;