const 	RouterView 		= require('module/core/router'),
		Route 			= require('module/core/route'),
		LoginRoute 		= require('module/core/routes/login_route'),
		LogoutRoute 	= require('module/core/routes/logout_route'),
		RegisterRoute 	= require('module/core/routes/register_route'),
		VerifyRoute 	= require('module/core/routes/verify_route'),
		SettingsRoute 	= require('module/core/routes/settings_route'),
		React 			= require('react');

const Center = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	render: function() {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				currentPage =  binding.get('routing.currentPageName') || '',
				mainClass 	= 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

		return (
			<div className={mainClass}>
				<div className="bPageWrap">

					<RouterView routes={ binding.sub('routing') } binding={binding}>
						<RegisterRoute binding={binding.sub('form.register')}  />
						<LoginRoute binding={binding.sub('userData')}  />
						<LogoutRoute binding={binding.sub('userData')}  />
						<VerifyRoute binding={binding.sub('userData')} />
						<SettingsRoute binding={binding.sub('userData')} />
					</RouterView>

				</div>
			</div>
		)
	}
});


module.exports = Center;
