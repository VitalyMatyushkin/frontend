/**
 * Created by Woland on 05.10.2017.
 */
const 	React 				= require('react'),
	
		DateTimeMixin		= require('module/mixins/datetime'),
	
		ViewModeConsts 		= require('module/ui/view_selector/consts/view_mode_consts'),
	
		ViewSelector		= require('module/ui/view_selector/view_selector'),
	
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		ViewSelectorHelper 	= require('module/ui/view_selector/helpers/view_selector_helper');

const PublicEventHeaderSchoolUnion = React.createClass({
	
	mixins: [DateTimeMixin],
	
	propTypes: {
		event: 				React.PropTypes.any.isRequired,
		viewMode: 			React.PropTypes.oneOf(Object.keys(ViewModeConsts.VIEW_MODE)),
		onClickViewMode:	React.PropTypes.func.isRequired
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
	getFixtureInfo: function(event) {
		return(
			<div>
				<div className="eEventHeader_field mEvent">{event.generatedNames.official}</div>
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
				<div className="bEventHeader_leftSide">
					<div className="eEventHeader_field mEvent">
						{this.getFixtureInfo(event)}
					</div>
				</div>
				
				<div className="bEventHeader_rightSide">
					<div	onClick		= { this.handleClickGoBack }
							className	= "bButton mCancel"
					>
						Go Back
					</div>
				</div>
				{ this.renderViewModeLinks() }
			</div>
		);
	}
});

module.exports = PublicEventHeaderSchoolUnion;