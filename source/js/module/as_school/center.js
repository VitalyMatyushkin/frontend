const 	RouterView 				= require('module/core/router'),
		Route 					= require('module/core/route'),
		PublicLogin 			= require('module/ui/menu/public_login'),
		Morearty        		= require('morearty'),
		React 					= require('react'),
		SchoolPageComponent 	= require("module/as_school/pages/school/school_page"),
		FixturesPageComponent 	= require("module/as_school/pages/fixtures/fixtures_page"),
		EventPageComponent 		= require("module/as_school/pages/event/event_page"),
		CalendarPageComponent 	= require("module/as_school/pages/calendar/calendar_page"),
		OpponentsPageComponent 	= require("module/as_school/pages/opponents/opponents_page"),
		AlbumsComponent 		= require("module/ui/gallery/albums"),
		HomeComponent 			= require("module/as_school/pages/school_home/home");


const Center = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	render: function() {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				currentPage	=  binding.get('routing.currentPageName') || '',
				mainClass	= 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

		return (
			<div className={mainClass}>
				<div className="bPageWrap">
					<PublicLogin binding={binding} />
					<RouterView routes={binding.sub('routing')} binding={binding}>
						<Route path="/ /school /school/:subPage"
							   binding={binding.sub('schoolProfile')}
							   component={SchoolPageComponent}/>

						<Route path="/fixtures"
							   binding={binding.sub('schoolFixtures')}
							   component={FixturesPageComponent}/>

						<Route path="/event"
							   binding={binding.sub('schoolEvent')}
							   component={EventPageComponent}/>

						<Route path="/calendar"
							   binding={binding.sub('schoolCalendar')}
							   component={CalendarPageComponent}/>

						<Route path="/opponents/:subPage"
							   binding={binding.sub('opponentsList')}
							   component={OpponentsPageComponent}/>

						<Route path="/albums /albums/:albumId"
							   binding={binding.sub('albums')}
							   component={AlbumsComponent}/>

                        <Route path="/ /home"
							   binding={binding.sub('schoolHomePage')}
							   component={HomeComponent}/>
                    </RouterView>
				</div>
			</div>
		)
	}
});

module.exports = Center;