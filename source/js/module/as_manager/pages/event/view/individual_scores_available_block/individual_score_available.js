const	React			= require('react'),
		Morearty		= require('morearty'),
		FormField 		= require('module/ui/form/form_field');

const EventIndividualScoreAvailable = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<FormField	binding		= {this.getDefaultBinding()}
						type		= "checkbox"
						field		= "individualScoreAvailable"
						classNames	= {"mIndividualScoreAvailable mSingleLine"}
			>
				Individual score available
			</FormField>
		);
	}
});

module.exports = EventIndividualScoreAvailable;