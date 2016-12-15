const	React					= require('react'),
		Morearty				= require('morearty'),
		Immutable				= require('immutable'),
		Promise					= require('bluebird'),

		MoreartyHelper			= require('../../../../../helpers/morearty_helper'),

		Form					= require('module/ui/form/form'),
		FormField				= require('module/ui/form/form_field'),

		ModerationPageStyles	= require('../../../../../../../styles/ui/bModerationPage.scss');

const ModerationPage = React.createClass({
	mixins: [Morearty.Mixin],

	componentWillMount: function() {
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);
		this.setSettings();
	},
	setSettings: function() {
		const binding = this.getDefaultBinding();

		window.Server.schoolSettings.get({
			schoolId: this.activeSchoolId
		}).then((data) => {
			binding.atomically()
				.set('moderationForm.commentsEnabled',	data.commentsEnabled)
				.set('moderationForm.photosEnabled',	data.photosEnabled)
				.commit();
		});
	},
	handleSubmit: function(data) {
		window.Server.schoolSettings.put(
			{
				schoolId: this.activeSchoolId
			},
			{
				commentsEnabled	: data.commentsEnabled,
				photosEnabled	: data.photosEnabled
			}
		);
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
					<FormField	type	= "checkbox"
								field	= "commentsEnabled"
					>
						User can upload photos to event
					</FormField>
					<FormField	type	= "checkbox"
								field	= "photosEnabled"
					>
						User comment event
					</FormField>
				</Form>
			</div>
		);
	}
});

module.exports = ModerationPage;