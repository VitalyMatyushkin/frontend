const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const	AppForm		= require('module/as_admin/pages/apps/app_form');

const	Loader		= require('module/ui/loader');
const	Helper		= require('module/as_admin/pages/apps/helper');

const	LoaderStyle	= require('styles/ui/loader.scss');

const AppEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired
	},
	componentWillMount: function () {
		const binding = this.getDefaultBinding();

		const appId = this.getMoreartyContext().getBinding().sub('routing.parameters').toJS().id;
		this.appId = appId;

		binding.set('isSync', false);
		if (typeof appId !== 'undefined') {
			window.Server.app.get(appId)
			.then(app => {
				Helper.convertServerDataToClient(app);

				binding.set('appForm', Immutable.fromJS(app));
				binding.set('isSync', true);
			})
		}
	},
	submitEdit: function(data) {
		Helper.convertClientDataToServer(data);

		window.Server.app.put(this.appId, data).then(() => document.location.hash = 'apps');
	},
	render: function() {
		const binding = this.getDefaultBinding();

		let appForm = null;
		if(binding.toJS('isSync')) {
			appForm = (
				<AppForm
					title			= "Edit app..."
					activeSchoolId	= { this.props.activeSchoolId }
					onFormSubmit	= { this.submitEdit }
					binding			= { binding }
				/>
			)
		} else {
			appForm = (
				<div className='bLoaderWrapper'>
					<Loader
						condition = { true }
					/>
				</div>
			);
		}

		return appForm;
	}
});

module.exports = AppEditPage;