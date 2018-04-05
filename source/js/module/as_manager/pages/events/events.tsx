import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';

import * as RouterView from 'module/core/router';
import * as Route from 'module/core/route';

import {SubMenu} from 'module/ui/menu/sub_menu';
import {EventsCalendar} from './calendar/events_calendar';
import {EventManager} from './event_manager';
import {EventFixtures} from './events_fixtures';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item';
import {Sport} from 'module/models/sport/sport';

import * as MoreartyHelper from 'module/helpers/morearty_helper';

export interface Event {
	ages:               number[]
	albumId:            string
	createdAt:          string
	embeddedTeams:      EmbeddedTeam[]
	endTime:            string
	eventCreatorId:     string
	eventType:          string
	gender:             string
	generatedNames:     any
	houses:             any[]
	housesData:         any[]
	id:                 string
	individuals:        any[]
	individualsData:    any[]
	invitedSchoolIds:   string[]
	invitedSchools:     School[]
	inviterSchool:      School
	inviterSchoolId:    string
	invites: {
		createdAt: string
		eventId: string
		invitedSchoolId: string
		inviterSchoolId: string
		status: string
		threadId: string
		updatedAt: string
		__v: number
		_id: string
	}[]
	players: Player[]
	results: {
		houseScore: any[]
		individualDiscipline: any[]
		individualPerformance: any[]
		individualScore: any[]
		schoolScore: any[]
	}
	schoolsData:        School[]
	sport:              Sport
	sportId:            string
	startTime:          string
	teamsData:          any
	threadId:           string
	type:               string
	venue:              any
	_isRemoved:         boolean
}

interface EmbeddedTeam {
	ages:       number[]
	gender:     string
	name:       string
	schoolId:   string
	teamType:   string
	_id:        string
}

export interface Player {
	firstName?:             string
	form?:                  any
	gender?:                string
	houseId?:               string
	id?:                    string
	isCaptain:              boolean
	isTeamPlayer:           boolean
	lastName?:              string
	participationStatus:    string
	permissionId:           string
	schoolId:               string
	teamId:                 string
	userId:                 string
	_id?:                   string
}

export const Events = (React as any).createClass({
	mixins: [Morearty.Mixin],
	// ID of current school
	// Will set on componentWillMount event
	activeSchoolId: undefined,
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE
	}
	,
	getDefaultState: function () {
		return Immutable.fromJS({
			eventsRouting: {},
			calendar:{},
			teams: [],
			sports: {
				models: [],
				sync: false
			},
			models: [],
			sync: false,
			newEvent: {},
			fixtures: {}
		});
	},

	componentWillMount: function () {
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		this._initMenuItems();
	},

	_initMenuItems: function(): void {
		this.menuItems = [
			{
				href: '/#events/calendar',
				name: 'Calendar',
				key: 'Calendar'
			},{
				href: '/#events/fixtures',
				name: 'Fixtures',
				key: 'Fixtures'
			}
		];
	},

	render: function() {
		const   binding = this.getDefaultBinding(),
			rootBinging = this.getMoreartyContext().getBinding();

		return (
            <div>
                <SubMenu    binding = {binding.sub('eventsRouting')}
                            items   = {this.menuItems}
                />
                <div className='bSchoolMaster'>
                    <RouterView
                        routes  = {binding.sub('eventsRouting')}
                        binding = {rootBinging}
                    >
                        <Route
                            path                = '/events/calendar'
                            binding             = {binding.sub('calendar')}
                            component           = {EventsCalendar}
                            extraStyleForCol    = {'mBootstrap'}
                        />
                        <Route
                            path        = '/events/fixtures'
                            binding      = {
								{
									default: binding.sub('fixtures'),
									calendar: binding.sub('calendar')
								}
							}
                            component    = {EventFixtures}
                        />
                        <Route
                            path            = '/events/manager'
                            activeSchoolId  = {this.activeSchoolId}
                            binding         = {
								{
									default:    binding.sub('newEvent'),
									calendar:   binding.sub('calendar')
								}
							}
                            component       = {EventManager}
                        />
                    </RouterView>
                </div>
            </div>
		);
	}
});