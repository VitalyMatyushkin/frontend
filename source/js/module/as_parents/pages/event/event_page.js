const	React			= require('react'),
		Morearty		= require('morearty'),

		MoreartyHelper	= require('../../../helpers/morearty_helper'),

		Event			= require('../../../as_manager/pages/event/event');

const EventPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.activeSchoolId = this.getActiveSchoolId();
	},
	getActiveSchoolId: function() {
		return this.getMoreartyContext().getBinding().get('routing.parameters.schoolId');
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<Event	binding			= {binding}
					activeSchoolId	= {this.activeSchoolId}
			/>
		);
	}
});

module.exports = EventPage;