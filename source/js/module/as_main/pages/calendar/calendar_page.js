var CalendarPage,
	SubMenu = require('module/ui/menu/sub_menu');

CalendarPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		// Пункты подменю
		self.menuItems = [{
			href: '/#calendar',
			name: 'All sports',
			key: 'all'
		},{
			href: '/#fixtures?sport=netball',
			name: 'Netball',
			key: 'Netball'
		},{
			href: '/#fixtures?sport=hockey',
			name: 'Hockey',
			key: 'hockey'
		},{
			href: '/#fixtures?sport=rugby',
			name: 'Rugby',
			key: 'rugby'
		},{
			href: '/#fixtures?sport=rounders',
			name: 'Rounders',
			key: 'rounders'
		},{
			href: '/#fixtures?sport=football',
			name: 'Football',
			key: 'football'
		},{
			href: '/#fixtures?sport=cricket',
			name: 'Cricket',
			key: 'cricket'
		}];
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<SubMenu binding={binding.sub('calendarRouting')} items={self.menuItems} />

				<div className="bBigCalendar">
					<div className="eBigCalendar_head">
						<span className="bButton mGoLeft">←</span>
						<span className="eBigCalendar_currentSelect">
							<span className="eBigCalendar_currentMonth">April</span>
							<span className="eBigCalendar_currentYear">2015</span>
						</span>

						<span className="bButton mGoRight">→</span>
					</div>

					<div className="eBigCalendar_oneWeek mDayNames">
						<div className="eBigCalendar_oneDay">Mon</div>
						<div className="eBigCalendar_oneDay">Tue</div>
						<div className="eBigCalendar_oneDay">Wed</div>
						<div className="eBigCalendar_oneDay">Thu</div>
						<div className="eBigCalendar_oneDay">Fri</div>
						<div className="eBigCalendar_oneDay">Sat</div>
						<div className="eBigCalendar_oneDay">Sun</div>
					</div>

					<div className="eBigCalendar_dates">

						<div className="eBigCalendar_oneWeek">
							<div className="eBigCalendar_oneDay"></div>
							<div className="eBigCalendar_oneDay"></div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">1</div>
								<div className="eBigCalendar_oneDayEvents">
									<div className="eBigCalendar_oneEvent">
										<div className="eBigCalendar_eventTime">13:00 Football</div>
										Great Walstead School vs Shoreham College
									</div>

									<div className="eBigCalendar_oneEvent">
										<div className="eBigCalendar_eventTime">17:00 Football</div>
										BOYS B17C vs BOYS B15C
									</div>
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">2</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">3</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">4</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">5</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
						</div>


						<div className="eBigCalendar_oneWeek">
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">6</div>
								<div className="eBigCalendar_oneDayEvents">
									<div className="eBigCalendar_oneEvent">
										<div className="eBigCalendar_eventTime">13:00 Football</div>
										Great Walstead School vs Shoreham College
									</div>

									<div className="eBigCalendar_oneEvent">
										<div className="eBigCalendar_eventTime">17:00 Football</div>
										BOYS B17C vs BOYS B15C
									</div>
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">7</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">8</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">9</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">10</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">11</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">12</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
						</div>



						<div className="eBigCalendar_oneWeek">
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">13</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">14</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">15</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">16</div>
								<div className="eBigCalendar_oneDayEvents">
									<div className="eBigCalendar_oneEvent">
										<div className="eBigCalendar_eventTime">13:00 Football</div>
										 Great Walstead School vs Shoreham College
									</div>

									<div className="eBigCalendar_oneEvent">
										<div className="eBigCalendar_eventTime">17:00 Football</div>
										BOYS B17C vs BOYS B15C
									</div>
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">17</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">18</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">19</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
						</div>


						<div className="eBigCalendar_oneWeek">
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">20</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">21</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">22</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">23</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">24</div>
								<div className="eBigCalendar_oneDayEvents">
									<div className="eBigCalendar_oneEvent">
										<div className="eBigCalendar_eventTime">13:00 Football</div>
										Great Walstead School vs Shoreham College
									</div>

									<div className="eBigCalendar_oneEvent">
										<div className="eBigCalendar_eventTime">17:00 Football</div>
										BOYS B17C vs BOYS B15C
									</div>
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">25</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">26</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
						</div>



						<div className="eBigCalendar_oneWeek">
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">27</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay mToday">
								<div className="eBigCalendar_oneDayDate">28</div>
								<div className="eBigCalendar_oneDayEvents">
									<div className="eBigCalendar_oneEvent">
										<div className="eBigCalendar_eventTime">13:00 Football</div>
										Great Walstead School vs Shoreham College
									</div>

									<div className="eBigCalendar_oneEvent">
										<div className="eBigCalendar_eventTime">17:00 Football</div>
										BOYS B17C vs BOYS B15C
									</div>
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">29</div>
								<div className="eBigCalendar_oneDayEvents">
								</div>
							</div>
							<div className="eBigCalendar_oneDay">
								<div className="eBigCalendar_oneDayDate">30</div>
								<div className="eBigCalendar_oneDayEvents">
									<div className="eBigCalendar_oneEvent">
										<div className="eBigCalendar_eventTime">17:00 Football</div>
										BOYS B17C vs BOYS B15C
									</div>
								</div>
							</div>
							<div className="eBigCalendar_oneDay"></div>
							<div className="eBigCalendar_oneDay"></div>
							<div className="eBigCalendar_oneDay"></div>
						</div>


					</div>
				</div>
			</div>
		)
	}
});


module.exports = CalendarPage;
