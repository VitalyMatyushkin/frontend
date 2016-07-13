const 	RouterView 		= require('module/core/router'),
		Route 			= require('module/core/route'),
		PublicLogin 	= require('module/ui/menu/public_login'),
		Morearty        = require('morearty'),
		React 			= require('react');

const Center = React.createClass({
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
					<PublicLogin binding={binding} />
					<RouterView routes={binding.sub('routing')} binding={binding}>
						<Route path="/ /school /school/:subPage"
							   binding={binding.sub('schoolProfile')}
							   component="module/as_school/pages/school/school_page"/>

						<Route path="/fixtures"
							   binding={binding.sub('schoolFixtures')}
							   component="module/as_school/pages/fixtures/fixtures_page"/>

						<Route path="/event"
							   binding={binding.sub('schoolEvent')}
							   component="module/as_school/pages/event/event_page"/>

						<Route path="/calendar"
							   binding={binding.sub('schoolCalendar')}
							   component="module/as_school/pages/calendar/calendar_page"/>

						<Route path="/opponents/:subPage"
							   binding={binding.sub('opponentsList')}
							   component="module/as_school/pages/opponents/opponents_page"/>

						<Route path="/albums /albums/:albumId"
							   binding={binding.sub('albums')}
							   component="module/ui/gallery/albums"/>

                        <Route path="/ /home"
							   binding={binding.sub('schoolHomePage')}
							   component="module/as_school/pages/school_home/home"/>
                    </RouterView>
				</div>
			</div>
		)
	}
});

module.exports = Center;