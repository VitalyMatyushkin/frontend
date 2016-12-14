const	React					= require('react'),
		Morearty				= require('morearty'),
		Immutable				= require('immutable'),

		Form					= require('module/ui/form/form'),
		FormField 				= require('module/ui/form/form_field'),

		Promise 				= require('bluebird'),

		ModerationPageStyles	= require('../../../../../../../styles/ui/bModerationPage.scss');

const ModerationPage = React.createClass({
	mixins: [Morearty.Mixin],

	componentWillMount: function() {
		// TODO should be init data by upload from server
	},

	handleSubmit: function(data) {
		// TODO should be submit
		console.log(data);
	},

	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<div className="bModerationPage">
				<Form	binding				= {binding.sub('moderationForm')}
						onSubmit			= {this.handleSubmit}
						submitOnEnter		= {false}
						defaultButton		= {'Save'}
				>
					<FormField type="checkbox" field="isUserCanUploadPhotos" >User can upload photos to event</FormField>
					<FormField type="checkbox" field="isUserCanWritesComments" >User comment event</FormField>
				</Form>
			</div>
		);
	}
});

module.exports = ModerationPage;