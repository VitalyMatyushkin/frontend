const	classNames		= require('classnames'),
		If				= require('module/ui/if/if'),
		EventHeader		= require('./view/event_header'),
		EventRivals		= require('./view/event_rivals'),
		EventButtons	= require('./view/event_buttons'),
		EventTeams		= require('./view/event_teams'),
		EventGallery	= require('module/as_manager/pages/event/gallery/event_gallery'),
		EventMenu     = require('./view/event_menu'),
		React			= require('react'),
		Comments		= require('./view/event_blog'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		Immutable		= require('immutable'),
		Lazy			= require('lazyjs');

const EventView = React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'EventPage',
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			model: {},
			participants: [],
			eventId: null,
			players: [],
			points: [],
			result: {
				points: []
			},
			sync: false,
			mode: 'general',
			showingComment: false
		});
	},
	componentWillMount: function () {
		const	self		= this,
				rootBinding	= self.getMoreartyContext().getBinding(),
				binding		= self.getDefaultBinding(),
				eventId		= rootBinding.get('routing.pathParameters.0');

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		// TODO should decompose to functions
		// TODO Houston, we need to refactor, urgently!
		binding.addListener('players', function (descriptor) {
			var path = descriptor.getPath(),
				previous = descriptor.getPreviousValue(),
				current;

			if (previous && previous.get(path[0])) {
				previous = previous.get(path[0]).toJS();
				current = binding.toJS(['players', path[0]]);

				if (current.length > previous.length) {
					const currentPlayer = current.pop();

					const body = {
						userId: currentPlayer.id
					};

					currentPlayer.position && (body.position = currentPlayer.position);
					currentPlayer.sub && (body.sub = currentPlayer.sub);

					TeamHelper.addPlayer(
						self.activeSchoolId,
						binding.get(['participants', path[0], 'id']),
						body
					);
				} else if (current.length < previous.length) {
					previous.filter(player => {
						return !current.some(function (model) {
							return model.id === player.id;
						});
					}).forEach(player => {
						TeamHelper.deletePlayer(
							self.activeSchoolId,
							binding.get(['participants', path[0], 'id']),
							player.id
						);
					});
				} else {
					let changedPlayer;
					for(let prevIndex in previous) {
						let findCurrPlayer = Lazy(current).findWhere({id:previous[prevIndex].id});
						if(
							findCurrPlayer.position !== previous[prevIndex].position ||
							findCurrPlayer.sub !== previous[prevIndex].sub
						) {
							changedPlayer = findCurrPlayer;
							break;
						}
					}
					TeamHelper.changePlayer(
						self.activeSchoolId,
						binding.get(['participants', path[0], 'id']),
						changedPlayer.playerModelId,
						{
							position:  changedPlayer.position,
							sub:       changedPlayer.sub
						}
					);
				}
			}
		});

		self._initMenuItems();

		let	activeSchool,
			event,
			invites,
			teams,
			sport;

		// TODO don't forget about filter
		//filter: {
		//    where: {
		//        id: eventId
		//    },
		//    include: [
		//        {
		//            participants: [
		//                {
		//                    players: ['user', 'form']
		//                },
		//                {
		//                    school: 'forms'
		//                },
		//                {
		//                    exactlyPlayers: 'student'
		//                },
		//                'house'
		//            ]
		//        },
		//        {
		//            invites: ['guest', 'inviter']
		//        },
		//        {
		//            result: 'points'
		//        },
		//        {
		//            sport: ''
		//        },
		//        {
		//            albums: 'photos'
		//        }
		//    ]
		//}
		window.Server.school.get(self.activeSchoolId)
		.then(_school => {
			activeSchool = _school;

			// Get event
			return window.Server.schoolForms.get(self.activeSchoolId);
		})
		.then(forms => {
			activeSchool.forms = forms;

			// Get forms
			return window.Server.schoolEvent.get({
				schoolId: self.activeSchoolId,
				eventId: eventId
			});
		})
		.then(_event => {
			event = _event;

			// Get sport
			return window.Server.sport.get(event.sportId);
		})
		.then(_sport => {
			sport = _sport;

			// Get invite
			if(event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
				return window.Server.schoolEventInvite.get({
					schoolId:	self.activeSchoolId,
					eventId:	event.id
				})
				.then(_invite => {
					invites = _invite;

					return window.Server.publicSchool.get(
						// it all depends on whether the school is inviting active or not
						invites.inviterSchoolId !== self.activeSchoolId ? invites.inviterSchoolId : invites.invitedSchoolId
					)
					.then(otherSchool => {
						return window.Server.publicSchoolForms.get(otherSchool.id).then(forms => {
							otherSchool.forms = forms;

							return otherSchool;
						});
					})
					.then(otherSchool => {
						// it all depends on whether the school is inviting active or not
						invites.inviterSchool = invites.inviterSchoolId === self.activeSchoolId ? activeSchool : otherSchool;
						invites.invitedSchool = invites.invitedSchoolId === self.activeSchoolId ? activeSchool : otherSchool;

						return Promise.resolve(invites);
					});
				});
			} else {
				// TODO Hmmm...really?
				return Promise.resolve(sport);
			}
		})
		.then(_ => {
			return Promise.all(event.teams.map(
				teamId => window.Server.team.get({schoolId: self.activeSchoolId, teamId: teamId})
			));
		})
		.then(_teams => {
			teams = _teams;

			if(event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']) {
				return Promise.all(
					teams.map(team => window.Server.schoolHouse.get(
						{
							schoolId: self.activeSchoolId,
							houseId: team.houseId
						}
					).then(house => team.house = house))
				);
			} else {
				return Promise.resolve(_teams);
			}
		})
		.then(_ => {
			// get all students
			return Promise.all(teams.map(team => {
				return window.Server.schoolTeamStudents.get({schoolId: team.schoolId, teamId: team.id}).then(users => {
					// inject students to team
					team.users = users;

					// inject school to team
					if(event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
						team.school = team.schoolId === invites.inviterSchoolId ? invites.inviterSchool : invites.invitedSchool;
					} else {
						team.school = activeSchool;
					}


					return team;
				});
			}));
		})
		.then(_ => {
			const players = [];

			players.push(
				TeamHelper.injectFormsToPlayers( // inject forms to players
					TeamHelper.getPlayersWithUserInfo( // result [user + playerInfo]
						TeamHelper.injectTeamIdToPlayers(teams[0].id, teams[0].players),
						teams[0].users
					),
					teams[0].school.forms
				)
			);

			if(teams[1]) {
				players.push(
					TeamHelper.injectFormsToPlayers( // inject forms to players
						TeamHelper.getPlayersWithUserInfo( // result [user + playerInfo]
							TeamHelper.injectTeamIdToPlayers(teams[1].id, teams[1].players), // player + teamId
							teams[1].users
						),
						teams[1].school.forms
					));
			}

			// TODO remove plug and implement albums
			const	albums	= [], // res.albums,
					points	= event.result && event.result.points ? TeamHelper.convertPointsToClientModel(event.result.points) : [];

			binding
				.atomically()
				.set('sport',				Immutable.fromJS(sport))
				.set('model',				Immutable.fromJS(event))
				.set('model.sportModel',	Immutable.fromJS(sport))
				.set('invites',				Immutable.fromJS(invites))
				.set('participants',		Immutable.fromJS(teams))
				.set('points',				Immutable.fromJS(points))
				.set('albums',				Immutable.fromJS(albums))
				.set('players',				Immutable.fromJS(players))
				.set('schoolInfo',			Immutable.fromJS(activeSchool))
				.set('eventId',				Immutable.fromJS(eventId))
				.set('mode',				Immutable.fromJS('general'))
				.set('sync',				Immutable.fromJS(true))
				.commit();
		});

		rootBinding.addListener('routing.pathParameters', function () {
			binding.set('mode', Immutable.fromJS(rootBinding.get('routing.pathParameters.1') || null))
		});
	},
	/**
	 * Initialize data for menu items
	 * @private
	 */
	_initMenuItems: function() {
		const	self	= this,
				eventId	= self.getMoreartyContext().getBinding().get('routing.pathParameters.0');

		self.menuItems = [
			{
				href: '/#event/' + eventId,
				name: 'General',
				key: 'General'
			},{
				href: '/#event/' + eventId + '/edit',
				name: 'Edit',
				key: 'Edit'
			},
			{
				href: '/#event/' + eventId + '/finish',
				name: 'Finish',
				key: 'Finish'
			}
		];
	},
	onToggleShowComment: function() {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('showingComment', !binding.get('showingComment'));
	},
	//A function that shadows comment keystrokes in order to show the comments right after the manager has entered them
	//This avoids the manager having to reload the screen to see what they just entered.
	onChange:function(){
		var self = this,
			comment = document.getElementById('commentTextArea');
		if(comment){
			self.commentContent = comment.value;
		}else{
			self.commentContent = '0';
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			showingComment = binding.get('showingComment'),
			commentTextClasses = classNames({
				'eEvent_commentText': true,
				mHide: !showingComment
			});  self.onChange();
		return <div>
			<div className="bEventContainer">
				<If condition={binding.get('sync')=== true}>
					<div className="bEvent">
						<If condition={(binding.get('mode') === 'general')}>
							<div className="bEventButtons_action">
								<EventButtons binding={binding} />
							</div>
							</If>
						<div className="bEventHeader_wrap">
							<EventHeader binding={binding}/>
							<EventRivals binding={binding}/>
						</div>
						<EventMenu />
						<EventTeams binding={binding} />
						<If condition={(binding.get('mode') === 'general') && (self.commentContent !=='0') || false}>
							<div className="eEvent_shadowCommentText">{self.commentContent}</div>
						</If>
						<EventGallery binding={binding} />
						<div className="eEvent_commentBox">
							<If condition={(binding.get('mode') === 'closing') || false}>
								<Morearty.DOM.textarea
										placeholder="Enter your first comment"
										className="eEvent_comment"
										onChange={Morearty.Callback.set(binding, 'model.comment')}
										value={binding.get('model.comment')} id="commentTextArea"
										/>
							</If>
							<If condition={(binding.get('mode') === 'general' && binding.get('model.result.comment')!==undefined) || false}>
								<div className="bMainComment">
									<span className="bMainComment_pic">
										<img src={'http://placehold.it/400x400'}/>
									</span>
									<div>{binding.get('model.result.comment')}</div>
								</div>
							</If>
						<If condition={((binding.get('mode') === 'general') && (binding.get('model.status') === "FINISHED")) || false}>
							<Comments binding={binding}/>
						</If>
					</div>
						<If condition={(binding.get('mode') !== 'general')}>
						<EventButtons binding={binding} />
						</If>
					</div>
				</If>
				<If condition={!binding.get('sync')}>
					<span>loading...</span>
				</If>
			</div>
		</div>;
	}
});

module.exports = EventView;