const	React		= require('react'),
		Morearty	= require('morearty');

const	Form		= require('module/ui/form/form'),
		FormField	= require('module/ui/form/form_field');

const	Consts		= require('module/as_admin/pages/apps/const');

const AppForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title:			React.PropTypes.string.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired,
		onFormSubmit:	React.PropTypes.func.isRequired
	},
	componentWillMount: function () {
		const binding = this.getDefaultBinding();

	},
	componentWillUnmount: function () {
		this.getDefaultBinding().clear();
	},
	handleChangePlatform: function (value) {
		this.getDefaultBinding().sub('appForm').meta().set('platform.value', value);
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<div className ="container">
				<Form
					name			= { this.props.title }
					onSubmit		= { this.props.onFormSubmit }
					binding			= { binding.sub('appForm') }
					submitButtonId	= 'app_submit'
				>
					<FormField
						type		= "text"
						field		= "name"
						validation	= "required"
					>
						Name
					</FormField>
					<FormField
						type		= "text"
						field		= "currentVersion"
					>
						Current Version
					</FormField>
					<FormField
						type		= "text"
						field		= "minimalVersion"
					>
						Minimal Version
					</FormField>
					<FormField
						type		= "text"
						field		= "lowerMinimalVersionText"
					>
						Lower Minimal Version Text
					</FormField>
					<FormField
						type		= "text"
						field		= "lowerCurrentVersionText"
					>
						Lower Current Version Text
					</FormField>
					<FormField
						field		= 'platform'
						type		= 'dropdown'
						options		= { Consts.PLATFORM_CLIENT_ARRAY }
						onSelect	= { this.handleChangePlatform }
					>
						Platform
					</FormField>
				</Form>
			</div>
		);
	}
});

module.exports = AppForm;