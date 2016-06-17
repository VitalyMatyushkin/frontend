const   RouterView  	= require('module/core/router'),
		Route       	= require('module/core/route'),
		React       	= require('react'),
		SubMenu     	= require('module/ui/menu/sub_menu'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		Immutable   	= require('immutable');

const EventView = React.createClass({
	mixins: [Morearty.Mixin],
	activeSchoolId: '',
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE
	},
	getDefaultState: function () {
		var self = this;

		return Immutable.fromJS({
			eventsRouting: {},
			eventChild:[],
			teams: [],
			sports: {
				models: [],
				sync: false
			},
			eventsOfAllChildren:[],
			models: [],
			sync: false,
			newEvent: {}
		});
	},
	componentWillMount: function () {
		const self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			userId = rootBinding.get('userData.authorizationInfo.userId'),
			binding = self.getDefaultBinding(),
			sportsBinding = binding.sub('sports');

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		self.serviceChildrenFilter(userId);
		self.setActiveChild();
		self.eventModel = [];
		window.Server.sports.get().then(function (data) {
			sportsBinding
				.atomically()
				.set('sync', true)
				.set('models', Immutable.fromJS(data))
				.commit();
			return self.loadEvents(userId);
		});

	},
	componentDidMount:function(){
		const self = this,
			binding = self.getDefaultBinding();

		self.addBindingListener(binding, 'eventChild', self.createSubMenu);
		self.addBindingListener(binding, 'eventsRouting.currentPathParts', self.createSubMenu);
		self.addBindingListener(binding, 'eventsRouting', self.setActiveChild);
		self.addBindingListener(binding, 'activeChildId', self.filterEvents);
		self.addBindingListener(binding, 'eventsOfAllChildren', self.filterEvents);
	},
	setActiveChild: function() {
		const self = this,
			binding = self.getDefaultBinding(),
			params = binding.toJS('eventsRouting.pathParameters'),
			newValue = params && params.length > 0 ? params[0]:'all';

		binding.set('activeChildId', newValue);
	},
	createSubMenu: function(){
		const self = this,
			binding = self.getDefaultBinding(),
			children = binding.toJS('eventChild'),
			partPath = binding.toJS('eventsRouting.currentPathParts'),
			mainMenuItem = partPath && partPath.length > 1 ? '/#' + partPath[0] + '/' + partPath[1] : '',
			menuItems = [];

		children.forEach(user => {
			menuItems.push({
				icon: user.gender === 'female' ? 'icon_girl':'icon_boy',
				href: mainMenuItem + '/' + user.childId,
				name: user.firstName + ' ' + user.lastName,
				key: user.id
			});
		});
		if (children.length > 1) {
			menuItems.push({
				icon: 'icon_girl_boy',
				href: mainMenuItem + '/all',
				name: 'Show all children',
				key: 'all',
				className: 'allChildren'
			});
		}
		binding.set('itemsBinding', Immutable.fromJS(menuItems));
	},
	loadEvents:function(){
		const self = this;

		return window.Server.userChildren.get().then(userChildren => {
			//Set the requirement for an all children view here
			if (userChildren && userChildren.length > 0) {
				self.request = userChildren.map(child => {
					window.Server.userChildEvents.get({childId:child.id})
						.then(events => Promise.all(events.map(event =>
							window.Server.sport.get({sportId:event.sportId}).then(sport => {
									event.sport = sport;

									return event;
								})
							)
						))
						.then(events => self._includeTeamsToEvents(events, child.schoolId))
						.then(events => self.processRequestData(events, child.id));
				});
				return self.request;
			}
		});
	},
	/**
	 * Method include teams to each event
	 * @private
	 */
	_includeTeamsToEvents: function(events, schoolId) {
		const self = this;

		return Promise.all(events.map(event => self._includeTeamsToEvent(event, schoolId)));
	},
	/**
	 * Method include teams to event model
	 * @private
	 */
	_includeTeamsToEvent: function(event, schoolId) {
		const self = this;

		return self._getTeamsForEvent(event, schoolId)
			.then(teams => {
				event.participants = teams;

				return event;
			});
	},
	/**
	 * Method return teams for event.
	 * Each team has school and house models.
	 * @param event
	 * @returns {*}
	 * @private
	 */
	_getTeamsForEvent: function(event, schoolId) {
		const self = this;

		return window.Server.schoolEventTeams.get({schoolId: schoolId, eventId: event.id})
			.then(teams => Promise.all(teams.map(team => self._includeModelsToTeam(team))));
	},
	/**
	 * Method include school and house models to team model.
	 * Method modify input team.
	 * @param team
	 * @returns {*}
	 * @private
	 */
	_includeModelsToTeam: function(team) {
		return window.Server.publicSchool.get({schoolId: team.schoolId}).then(school => {
			team.school = school;

			if(team.houseId) {
				return window.Server.publicSchoolHouse.get({schoolId: team.schoolId, houseId: team.houseId}).then(house => {
					team.house = house;

					return team;
				});
			}
			return team;
		});
	},
	filterEvents:function(){
		const self = this,
			binding = self.getDefaultBinding(),
			allEvents = binding.toJS('eventsOfAllChildren'),
			childId = binding.get('activeChildId');

		if(childId && allEvents && allEvents.length > 0){
			let res = childId === 'all' ? allEvents : allEvents.filter(ev => ev.childId === childId);
			binding.set('models', Immutable.fromJS(res));
		}
	},
	processRequestData:function(reqData,childId){
		var self = this,
			binding = self.getDefaultBinding(),
			sports = binding.toJS('sports.models');
		if(reqData){
			reqData.forEach(function(el){
				if(el !== undefined){
					el.childId = childId;
					el.sport = sports.find(s => s.id === el.sportId);
					self.eventModel.push(el);
				}
			});
			binding
				.atomically()
				.set('eventsOfAllChildren',Immutable.fromJS(self.eventModel))
				.set('models',Immutable.fromJS(self.eventModel))
				.set('sync',true)
				.commit();
		}
	},
	serviceChildrenFilter: function () {
		const	self = this,
				binding = self.getDefaultBinding();

		return window.Server.userChildren.get()
			//.then(children => {
			//	return Promise.all(children.map(child => {
			//		return window.Server.userChildEvents.get({childId:child.id})
			//			.then(events => {
			//				child.events = events;
			//
			//				return child;
			//			});
			//	}));
			//})
			.then(children => {
				binding.set('eventChild',Immutable.fromJS(children.map(child => {
					// TODO fix
					child.childId = child.id

					return child;
				})));

				return true;
			});
	},
	render: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			rootBinging = self.getMoreartyContext().getBinding();

		return <div className="bParentsPage">
			<SubMenu items={self.menuItems}
					binding={{
						default: binding.sub('eventsRouting'),
						itemsBinding: binding.sub('itemsBinding')
					}}/>

			<div className='bSchoolMaster'>
				<div className='bEvents'>
					<RouterView routes={binding.sub('eventsRouting')}
								binding={rootBinging}
					>
						<Route	path='/events/calendar/:userId'
								binding={binding}
								component='module/as_parents/pages/events/events_calendar'
						/>
						<Route	path='/events/fixtures/:userId'
								binding={binding}
								component='module/ui/fixtures/events_fixtures'
						/>
						<Route	path="/events/achievement/:userId"
								binding={binding}
								component="module/as_parents/pages/events/events_achievement"
						/>
					</RouterView>
				</div>
			</div>
		</div>;
	}
});


module.exports = EventView;
