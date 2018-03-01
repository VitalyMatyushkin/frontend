/**
 * Created by Woland on 05.10.2017.
 */
const 	React 				= require('react'),
	
		DateTimeMixin		= require('module/mixins/datetime'),
		
		ViewModeConsts 		= require('module/ui/view_selector/consts/view_mode_consts'),
		
		ViewSelector		= require('module/ui/view_selector/view_selector'),
		
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		ViewSelectorHelper 	= require('module/ui/view_selector/helpers/view_selector_helper');

const PublicEventHeaderSchool = React.createClass({
	mixins: [DateTimeMixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired,
		event: React.PropTypes.any.isRequired,
		viewMode: React.PropTypes.oneOf(Object.keys(ViewModeConsts.VIEW_MODE)),
		onClickViewMode: React.PropTypes.func.isRequired
	},
	getDefaultProps: function(){
		return {
			viewMode: ViewModeConsts.VIEW_MODE.BLOCK_VIEW
		}
	},
	handleClickGoBack: function() {
		document.location.hash = 'home';
		document.location.reload();
	},
	getEventName: function (event) {
		const activeSchoolId = this.props.activeSchoolId;

		return typeof this.props.activeSchoolId !== 'undefined' ?
			event.generatedNames[activeSchoolId]:
			event.generatedNames.official;
	},
	getFixtureInfo: function(event) {
		return(
			<div>
				<div className="eEventHeader_field mEvent">{this.getEventName(event)}</div>
				<div className="eEventHeader_field mDate">
					{`${this.getDateFromIso(event.startTime)} / ${this.getTimeFromIso(event.startTime)} / ${event.sport.name}`}
				</div>
			</div>
		)
	},
	renderViewModeLinks: function(){
		const event = this.props.event;
		
		if(TeamHelper.isNewEvent(event)) {
			return (
				<ViewSelector
					selectorList	= { ViewSelectorHelper.getSelectorList(event) }
					handleClick		= { this.props.onClickViewMode }
					viewMode		= { this.props.viewMode }
				/>
			);
		} else {
			return null;
		}
	},
	render: function(){
		const event = this.props.event;
		
		return (
			<div className="bEventHeader">
				<div className='eEventHeader_row'>
					<div className="eEventHeader_leftSide">
						<div className="eEventHeader_field mEvent">
							{this.getFixtureInfo(event)}
						</div>
					</div>
					<div className="eEventHeader_rightSide">
						<div className="bButton mCancel" onClick={this.handleClickGoBack}>
							Go Back
						</div>
					</div>
				</div>
				<div className='eEventHeader_row'>
					<div className='eEventHeader_leftSide'>
						{this.renderViewModeLinks()}
					</div>
				</div>
			</div>
		);
	}
});

module.exports = PublicEventHeaderSchool;