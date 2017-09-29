const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable');

const	RadioButton		= require('module/ui/radio_button/radio_button');

const	EventConsts		= require('module/helpers/consts/events');

const	ConfirmPopup	= require('module/ui/confirm_popup'),
		ManagerStyles	= require('styles/pages/events/b_events_manager.scss');

const ChangeModeManager = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:		React.PropTypes.string.isRequired,
		isSubmitProcessing:	React.PropTypes.bool.isRequired,
		submit:				React.PropTypes.func.isRequired,
		handleClose:		React.PropTypes.func.isRequired
	},
	componentWillMount: function () {
		const binding = this.getDefaultBinding();

		binding.set('changeMode', EventConsts.CHANGE_MODE.SINGLE);
	},
	handleChange: function (mode) {
		const binding = this.getDefaultBinding();

		binding.set('changeMode', mode);
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<ConfirmPopup	okButtonText			= "Save"
							cancelButtonText		= "Back"
							isOkButtonDisabled		= { this.props.isSubmitProcessing }
							handleClickOkButton		= {
								() => {
									 this.props.submit();
								 }
							}
							handleClickCancelButton	= { this.props.handleClose }
			>
				<div className="bSavingChangesBlock">
					<div className="eSavingPlayerChangesModePanel_text">
						Players have been changed. Please select one of the following options:
					</div>
					<div className="eSavingPlayerChangesModePanel_radioButtons">
						<RadioButton	id			= { 'update_only_this_event_button' }
										text		= { 'Update only this event' }
										isChecked	= { binding.toJS('changeMode') === EventConsts.CHANGE_MODE.SINGLE}
										onClick		= { this.handleChange.bind(this, EventConsts.CHANGE_MODE.SINGLE) }
						/>
						<RadioButton	id			= { 'update_all_events_in_group' }
										text		= { 'Update all events in group' }
										isChecked	= { binding.toJS('changeMode') === EventConsts.CHANGE_MODE.GROUP}
										onClick		= { this.handleChange.bind(this, EventConsts.CHANGE_MODE.GROUP) }
						/>
					</div>
				</div>
			</ConfirmPopup>
		);
	}
});

module.exports = ChangeModeManager;