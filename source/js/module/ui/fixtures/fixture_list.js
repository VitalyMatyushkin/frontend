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
		date: React.PropTypes.object.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func,
        childIdList: React.PropTypes.array,
        children: React.PropTypes.array
	},
    getInitialState: function() {
        return {
            events:		[],
            hasMore:	true
        };
    },

    loadFixtures: function (page) {
        const 	gteDate = DateHelper.getStartDateTimeOfMonth(this.props.date),
            	ltDate 	= DateHelper.getEndDateTimeOfMonth(this.props.date);
		if (this.props.childIdList) {
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
		} else {
            return FixtureActions.loadData(page, this.props.activeSchoolId, gteDate, ltDate)
                .then(events => events.filter(event => EventHelper.isShowEventOnCalendar(event, this.props.activeSchoolId)))
                .then(_events => {
                    let events = this.state.events;
                    events = events.concat(_events);
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
							<div className="eChallengeDate_date">{date}</div>
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
					<span>No fixtures to report.</span>
				</div>
			);
		} else {
			content = (
				<InfiniteScroll
					pageStart	= {0}
					loadMore	= {(page) => this.loadFixtures(page)}
					hasMore		= {this.state.hasMore}
					loader		= {<Loader/>}
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