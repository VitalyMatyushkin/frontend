const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const	AppForm		= require('module/as_admin/pages/apps/app_form');

const	Helper		= require('module/as_admin/pages/apps/helper');
const	Consts		= require('module/as_admin/pages/apps/const');

const AppAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	componentWillMount: function () {
		this.getDefaultBinding().set(
			'appForm.platform',
			Immutable.fromJS(Consts.PLATFORM_CLIENT_ARRAY[0])
		);
	},
	submitAdd: function(data) {
		Helper.convertClientDataToServer(data);

		window.Server.apps.post(data).then(() => document.location.hash = 'apps');
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<AppForm
				title			= "Add application"
				activeSchoolId	= { this.props.activeSchoolId }
				onFormSubmit	= { this.submitAdd }
				binding			= { binding }
			/>
		)
	}
});

module.exports = AppAddPage;