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
						<Route path="/ /school /school/:subPage" binding={binding.sub('schoolProfile')} component="module/as_main/pages/school/school_page"  />
						<Route path="/fixtures" binding={binding.sub('schoolFixtures')} component="module/as_main/pages/fixtures/fixtures_page"  />
						<Route path="/calendar" binding={binding.sub('schoolCalendar')} component="module/as_main/pages/calendar/calendar_page"  />
                    </RouterView>

				</div>
			</div>
		)
	}
});


module.exports = Center;
