/**
 * Created by Anatoly on 22.09.2016.
 */

const 	React 				= require('react'),
		{DateHelper} 		= require('module/helpers/date_helper'),
		Lazy 				= require('lazy.js'),
		FixtureItem 		= require('./fixture_item'),
    	InfiniteScroll		= require('react-infinite-scroller'),
    	EventHelper			= require('module/helpers/eventHelper'),
    	Loader 				= require('module/ui/loader'),
    	{FixtureActions}	= require('module/ui/fixtures/fixture_actions');

const FixtureList = React.createClass({
	propTypes: {
		date:           React.PropTypes.object.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired,
		onClick:        React.PropTypes.func,
        childIdList:    React.PropTypes.array,
        children:       React.PropTypes.array,
        schoolId:       React.PropTypes.array || React.PropTypes.string,
        schoolIdList:   React.PropTypes.array,
        school: 		React.PropTypes.array,
        mode:           React.PropTypes.string,
		region:			React.PropTypes.string
	},
    getInitialState: function() {
        return {
            events:		[],
            hasMore:	true
        };
    },

    loadFixtures: function (page) {
        const 	mode = this.props.mode,
                gteDate = DateHelper.getStartDateTimeOfMonth(this.props.date),
            	ltDate 	= DateHelper.getEndDateTimeOfMonth(this.props.date);

        switch (mode) {
            case 'STUDENT':
                return FixtureActions.loadDataForStudent(page, this.props.schoolId, gteDate, ltDate)
                    .then(_events => {
                        this.injectSchoolToEvents(_events, this.props.school, this.props.schoolIdList);
                        let events = this.state.events;
                        events = events.concat(_events);
                        this.setState({
                            events: events,
                            hasMore: _events.length !== 0
                        });
                    });
            case 'PARENT':
                return FixtureActions.loadDataForParent(page, this.props.activeSchoolId, gteDate, ltDate, this.props.childIdList)
                    .then(_events => {
                        this.injectChildrenToEvents(_events,  this.props.children, this.props.childIdList);
                        let events = this.state.events;
                        events = events.concat(_events);
                        this.setState({
                            events: events,
                            hasMore: _events.length !== 0
                        });
                    });
            case 'ADMIN':
                return FixtureActions.loadData(page, this.props.activeSchoolId, gteDate, ltDate)
                    .then(events => events.filter(event => EventHelper.isShowEventOnCalendar(event, this.props.activeSchoolId)))
                    .then(_events => {
                        let events = this.state.events;
						_events.forEach(event => {
							const isEventAlreadyInState = events.some(eventState => eventState.id === event.id);
							if (!isEventAlreadyInState) {
								events.push(event);
							}
						});
                        this.setState({
                            events: events,
                            hasMore: _events.length !== 0
                        });

                        return true;
                    });

        }
	},

    injectChildrenToEvents: function(events, childList, currentChildIdList) {
        if(currentChildIdList.length === 1) {
            return this.injectChildToEvents(events, childList.find(c => c.id === currentChildIdList[0]));
        } else {
            return events.forEach(event => {
                const child = this.getChildFromEvent(event, childList);
                if(typeof child !== "undefined") {
                    event.child = child;
                }
            });
        }
    },

    injectSchoolToEvents: function(events, schoolList, currentSchoolIdList) {
        if(currentSchoolIdList.length === 1) {
            return this.injectSchoolsToEvents(events, schoolList.find(sch => sch.id === currentSchoolIdList[0]));
        } else {
            return events.forEach(event => {
                const school = this.getSchoolFromEvent(event, schoolList);
                if(typeof school !== "undefined") {
                    event.school = school;
                }
            });
        }
    },
    getSchoolFromEvent: function(event, schoolList) {
        return schoolList.find(school => this.isSchoolPlayInEvent(event, school));
    },
    isSchoolPlayInEvent: function(event, school) {
        const foundTeam = event.teamsData.find(t => this.isSchoolPlayInTeam(t, school));

        return typeof foundTeam !== 'undefined';
    },
    isSchoolPlayInTeam: function(team, school) {
        const foundPlayer = team.players.find(p => p.userId === school.id);

        return typeof foundPlayer !== 'undefined';
    },
    injectSchoolsToEvents: function(events, school) {
        return events.forEach(e => e.school = school);
    },
    getChildFromEvent: function(event, childList) {
        return childList.find(child => this.isChildPlayInEvent(event, child));
    },
    isChildPlayInEvent: function(event, child) {
        const foundTeam = event.teamsData.find(t => this.isChildPlayInTeam(t, child));

        return typeof foundTeam !== 'undefined';
    },
    isChildPlayInTeam: function(team, child) {
        const foundPlayer = team.players.find(p => p.userId === child.id);

        return typeof foundPlayer !== 'undefined';
    },
    injectChildToEvents: function(events, child) {
        return events.forEach(e => e.child = child);
    },

    renderFixtures: function() {
        let events = [];
        if (typeof this.state.events !== 'undefined' && this.state.events.length > 0) {
            const dates = Lazy(this.state.events).map(e => DateHelper.getDate(e.startTime)).uniq().toArray();
			return dates.sort().map((date, dtIndex) => {
				return (
					<div key={dtIndex} className="bChallengeDate">
						<div className="eChallengeDate_wrap">
							<div className="eChallengeDate_date">{DateHelper.getDateByRegion(date, this.props.region)}</div>
							<div className="eChallengeDate_list">{this.getEvents(date)}</div>
						</div>
					</div>
				);
			});
        }

        return events;
    },

    getEvents: function (date) {
        const 	eventsByDate = this.state.events.filter(e => DateHelper.getDate(e.startTime) === date);

        return eventsByDate.map(event => {
            return (
				<FixtureItem
					key             = {event.id}
					event			= {event}
					activeSchoolId	= {this.props.activeSchoolId}
					onClick			= {this.props.onClick}
				/>
            );
        });
    },

    render: function() {
        let content = null;

		if (this.state.events.length === 0 && !this.state.hasMore) {
			content = (
				<div className="eChallengeDate_wrap">
					<div className='eChallengeDate_noFixtures'>
						No fixtures to report.
					</div>
				</div>
			);
		} else {
			content = (
				<InfiniteScroll
					pageStart	= {0}
					loadMore	= {(page) => this.loadFixtures(page)}
					hasMore		= {this.state.hasMore}
					loader		= {<Loader key='infinite_scroll_loader'/>}
				>
					<div>
						{this.renderFixtures()}
					</div>
				</InfiniteScroll>
			);
		}

		return content;
    }

});

module.exports = FixtureList;