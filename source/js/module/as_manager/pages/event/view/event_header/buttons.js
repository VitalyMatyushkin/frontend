const	React			= require('react'),
		EventHelper		= require('module/helpers/eventHelper'),
		LinkStyles 	    = require('styles/pages/event/b_event_eLink_cancel_event.scss');

/**
 * This component displays the buttons "Close event", "Change score", "Save", "Cancel".
 * */
const Buttons = React.createClass({
	propTypes: {
		mode:							React.PropTypes.string.isRequired,
		eventStatus:					React.PropTypes.string.isRequired,
		isUserSchoolWorker:				React.PropTypes.bool.isRequired,
		isShowScoreEventButtonsBlock:	React.PropTypes.bool.isRequired,
		handleClickCancelMatch:			React.PropTypes.func.isRequired,
		handleClickCloseEvent:			React.PropTypes.func.isRequired,
		onClickCloseCancel:				React.PropTypes.func.isRequired,
		onClickOk:						React.PropTypes.func.isRequired
	},
	/**
	 * The function render's button "Cancel" for event
	 */
	renderCancelEventButton: function() {
		const eventStatus = this.props.eventStatus;

		if(
			eventStatus !== EventHelper.EVENT_STATUS.FINISHED &&
			eventStatus !== EventHelper.EVENT_STATUS.REJECTED &&
			eventStatus !== EventHelper.EVENT_STATUS.CANCELED
		) {
			return (
				<div className="eLink_CancelEvent">
					<a onClick={this.props.handleClickCancelMatch}>
						Cancel
					</a>
				</div>
			);
		} else {
			return null;
		}
	},
	/**
	 * The function render's buttons "Change score"/"Close event"
	 */
	renderScoreEventButton: function() {
		const eventStatus = this.props.eventStatus;

		switch (eventStatus) {
			case EventHelper.EVENT_STATUS.FINISHED:
				return (
					<div	onClick		= {this.props.handleClickCloseEvent}
							className	="bButton mFullWidth"
					>
						Change score
					</div>
				);
			case EventHelper.EVENT_STATUS.ACCEPTED:
				return (
					<div	onClick		= {this.props.handleClickCloseEvent}
							className	="bButton mFullWidth"
					>
						Close event
					</div>
				);
		};
	},
	/**
	 * The function render's container with buttons "Close event"/"Change score" and button "Cancel" for event
	 */
	renderScoreEventButtonsContainer: function() {
		const isShowScoreEventButtonsBlock = this.props.isShowScoreEventButtonsBlock;

		if(isShowScoreEventButtonsBlock) {
			return (
				<div className="bEventButtons">
					<div className="eEventButtons_wrapper">
						{this.renderScoreEventButton()}
						{this.renderCancelEventButton()}
					</div>
				</div>
			);
		} else {
			return null;
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