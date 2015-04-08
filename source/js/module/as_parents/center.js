var RouterView = require('module/core/router'),
	Route = require('module/core/route'),
	Center;

Center = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			currentPage =  binding.get('routing.currentPageName') || '',
			mainClass = 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

		return (
			<div className={mainClass}>
				<div className="bPageWrap">

					<RouterView routes={ binding.sub('routing') } binding={binding}>
						<Route path="/ /school" binding={binding.sub('schoolProfile')} component="module/as_parents/pages/school/school_page"  />
						<Route path="/test" binding={binding.sub('schoolProfile')} component="module/as_parents/pages/school/school_page"  />
                    </RouterView>

				</div>
			</div>
		)
	}
});


module.exports = Center;
