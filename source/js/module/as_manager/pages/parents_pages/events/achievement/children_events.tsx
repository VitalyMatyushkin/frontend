/**
 * Created by vitaly on 24.12.17.
 */
import * as	React from 'react';
import * as	InfiniteScroll from 'react-infinite-scroller';
import * as Loader from 'module/ui/loader';
import * as EventRivals from 'module/shared_pages/student/view/event-rivals.js';

interface ChildrenEventsProps {
	activeSchoolId:	string
	loadEvents: 	(page: number) => Promise<any>
	childId:		string
}

interface ChildrenEventsState {
	events:		any[]
	hasMore:	boolean
}

export const ChildrenEvents = (React as any).createClass({
	onClickChallenge: function (event: any): void {
		const schoolIdByChildId = event.players.find(p => p.userId === this.props.childId).schoolId;
		document.location.hash = 'event/' + event.id  + '?schoolId=' + schoolIdByChildId;
	},
	
	componentWillMount: function () {
		this.setState({
			events:		[],
			hasMore:	true
		});
	},
	
	loadEvents: function (page: number): Promise<any> {
		return this.props.loadEvents(page).then(_events => {
			let events = this.state.events;
			events = events.concat(_events);
			this.setState({
				events:		events,
				hasMore:	_events.length !== 0
			});
			return true;
		});
	},
	
	renderEvents: function (): React.ReactNode {
		let events = [];
		
		if(typeof this.state.events !== 'undefined' && this.state.events.length > 0) {
			events = this.state.events.map(event => {
				return (
					<div className="bAchievement_event" key={event.id} onClick={() => this.onClickChallenge(event)}>
						<EventRivals event={event} activeSchoolId={this.props.activeSchoolId}/>
					</div>
				);
			});
		}
		
		return events;
	},
	
	render: function() {
		let content = null;
		
		if (this.state.events.length === 0 && !this.state.hasMore) {
			content = (
				<div className="eInvites_processing">
					<span>There are no events to display.</span>
				</div>
			);
		} else {
			content = (
				<InfiniteScroll
					pageStart	= { 0 }
					loadMore	= { page => this.loadEvents(page) }
					hasMore		= { this.state.hasMore }
					loader		= { <Loader/> }
				>
					<div className="bAchievement_eventWrapper">
						{ this.renderEvents() }
					</div>
				</InfiniteScroll>
			);
		}
		
		return content;
	}
});