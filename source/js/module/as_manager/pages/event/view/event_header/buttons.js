const	React			= require('react');

const	ActionList		= require('../../../../../ui/action_list/action_list');

const	EventHelper		= require('module/helpers/eventHelper'),
		LinkStyles 	    = require('styles/pages/event/b_event_eLink_cancel_event.scss');

/**
 * This component displays the buttons "Close event", "Change score", "Save", "Cancel".
 * */
const Buttons = React.createClass({
	propTypes: {
		eventId							: React.PropTypes.string.isRequired,
		mode							: React.PropTypes.string.isRequired,
		eventStatus						: React.PropTypes.string.isRequired,
		isUserSchoolWorker				: React.PropTypes.bool.isRequired,
		isShowScoreEventButtonsBlock	: React.PropTypes.bool.isRequired,
		handleClickCancelEvent			: React.PropTypes.func.isRequired,
		handleClickCloseEvent			: React.PropTypes.func.isRequired,
		onClickCloseCancel				: React.PropTypes.func.isRequired,
		onClickOk						: React.PropTypes.func.isRequired
	},
	/**
	 * The function render's container with buttons "Close event"/"Change score" and button "Cancel" for event
	 */
	renderScoreEventButtonsContainer: function() {
		const isShowScoreEventButtonsBlock = this.props.isShowScoreEventButtonsBlock;

		if(isShowScoreEventButtonsBlock) {
			return (
				<ActionList	buttonText				= 'Actions'
							actionList				= {this.getActionList()}
							handleClickActionItem	= {this.handleClickActionItem}
				/>
			);
		} else {
			return null;
		}
	},
	getActionList: function() {
		const actionList = [];

		actionList.push({id:'create', text:'Create Event Like This'});

		if(this.isCloseEventActionAvailable()) {
			actionList.push({id:'close', text:'Close Event'});
		}

		if(this.isChangeScoreEventActionAvailable()) {
			actionList.push({id:'change', text:'Change Score'});
		}

		if(this.isCancelEventActionAvailable()) {
			actionList.push({id:'cancel', text:'Cancel Event'});
		}

		return actionList;
	},
	isCancelEventActionAvailable: function() {
		const eventStatus = this.props.eventStatus;

		return (
			eventStatus !== EventHelper.EVENT_STATUS.FINISHED &&
			eventStatus !== EventHelper.EVENT_STATUS.REJECTED &&
			eventStatus !== EventHelper.EVENT_STATUS.CANCELED
		);
	},
	isCloseEventActionAvailable: function() {
		const eventStatus = this.props.eventStatus;

		return (
			eventStatus === EventHelper.EVENT_STATUS.ACCEPTED
		);
	},
	isChangeScoreEventActionAvailable: function() {
		const eventStatus = this.props.eventStatus;

		return (
			eventStatus === EventHelper.EVENT_STATUS.FINISHED
		);
	},
	handleClickActionItem: function(id) {
		switch (id) {
			// create event like this
			case 'create':
				document.location.hash = `events/manager?copyId=${this.props.eventId}`;
				break;
			case 'change':
				this.props.handleClickCloseEvent();
				break;
			case 'close':
				this.props.handleClickCloseEvent();
				break;
			case 'cancel':
				this.props.handleClickCancelEvent();
				break;
		}
	},
	/**
	 * The function render's "Cancel" and "Save" buttons after clicking "Change score" button
	 * Buttons for close event or for change score.
	 * So, save results or cancel.
	 */
	renderChangeScoreEventButtonsContainer: function() {
		return (
			<div className="bEventButtons">
				<div	className	= "bButton mCancel mMarginRight"
						onClick		= {this.props.onClickCloseCancel}
				>
					Cancel
				</div>
				<div	className	= "bButton"
						onClick		= {this.props.onClickOk}
				>
					Save
				</div>
			</div>
		);
	},
	render: function() {
		let buttons = null;

		// It's general condition for all buttons
		if(this.props.isUserSchoolWorker) {
			switch (this.props.mode) {
				case 'general':
					buttons = this.renderScoreEventButtonsContainer();
					break;
				case 'closing':
					buttons = this.renderChangeScoreEventButtonsContainer();
					break;
			};
		}

		return buttons;
	}
});

module.exports = Buttons;