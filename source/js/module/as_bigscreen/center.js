const	Morearty				= require('morearty'),
		React					= require('react'),
		RouterView				= require('module/core/router'),
		Route					= require('module/core/route'),
		BigScreenMainPage		= require("./pages/big_screen_main_page");

const Center = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	render: function() {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				currentPage	= binding.get('routing.currentPageName') || '',
				mainClass	= 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

		return (
			<div className={mainClass}>
				<div className="bPageWrap">
					<RouterView routes={binding.sub('routing')} binding={binding}>
						<Route	path		= "/ /home /loginPublicSchool"
								binding		= {binding.sub('bigScreenMainPage')}
								component	= {BigScreenMainPage}
						/>
					</RouterView>
				</div>
			</div>
		)
	}
});

module.exports = Center;