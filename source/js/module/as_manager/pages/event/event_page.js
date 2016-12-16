const	React			= require('react'),
		Morearty		= require('morearty'),

		MoreartyHelper	= require('../../../helpers/morearty_helper'),

		Event			= require('./event');

const EventPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);
	},

	render: function() {
		const	self						= this,
				binding						= self.getDefaultBinding();

		return (
			<Event	binding			= {binding}
					activeSchoolId	= {this.activeSchoolId}
			/>
		);
	}
});

module.exports = EventPage;