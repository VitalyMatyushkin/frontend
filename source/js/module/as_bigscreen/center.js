const	Morearty					= require('morearty'),
		React						= require('react'),
		RouterView					= require('module/core/router'),
		Route						= require('module/core/route'),
		BigScreenMainPage			= require('./pages/big_screen_main_page'),
		LoginPublicBigscreenPage 	= require('./pages/login_public_bigscreen_page'),
		Page404						= require('module/ui/404_page');

const Center = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	render: function() {
		const	binding		= this.getDefaultBinding(),
				currentPage	= binding.get('routing.currentPageName') || '',
				mainClass	= 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

		return (
			<div className={mainClass}>
				<div className="bPageWrap">
					<RouterView routes={binding.sub('routing')} binding={binding}>
						<Route	path		= "/ /home"
								binding		= {binding.sub('bigScreenMainPage')}
								component	= { BigScreenMainPage }
						/>
						<Route 	path		= "/ /loginPublicBigscreen"
								binding		= { binding.sub('loginPublicBigscreen') }
								component	= { LoginPublicBigscreenPage }/>
						
						<Route 	path		= "/ /404"
								binding		= { binding }
								component	= { Page404 }/>
					</RouterView>
				</div>
			</div>
		)
	}
});

module.exports = Center;