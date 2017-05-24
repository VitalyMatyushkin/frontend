const	React			= require('react'),
		Morearty		= require('morearty'),

		Event			= require('../../event/event');

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
			<Event	binding					= {binding}
					isShowControlButtons	= {false}
					activeSchoolId			= {this.activeSchoolId}
			/>
		);
	}
});

module.exports = EventPage;