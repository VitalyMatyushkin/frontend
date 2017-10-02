const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable');

const	RadioButton		= require('module/ui/radio_button/radio_button');

const	EventConsts		= require('module/helpers/consts/events');

const	ConfirmPopup	= require('module/ui/confirm_popup'),
		ManagerStyles	= require('styles/pages/events/b_events_manager.scss');

const SaveChangesManager 	= React.createClass({
	mixins: [Morearty.Mixin],
	handleChange: function (mode) {
		const binding = this.getDefaultBinding();

		binding.set('changeMode', mode);
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<div className="eSavingPlayerChangesModePanel_radioButtons">
				<span>
					Would you like to change this event only or this and all following events in the series?
				</span>
				<RadioButton	id			= { 'radio_button_only_this_event' }
								text		= { 'Only this event' }
								isChecked	= { binding.toJS('changeMode') === EventConsts.CHANGE_MODE.SINGLE}
								onClick		= { this.handleChange.bind(this, EventConsts.CHANGE_MODE.SINGLE) }
				/>
				<RadioButton	id			= { 'radio_button_following_events' }
								text		= { 'Following events' }
								isChecked	= { binding.toJS('changeMode') === EventConsts.CHANGE_MODE.GROUP}
								onClick		= { this.handleChange.bind(this, EventConsts.CHANGE_MODE.GROUP) }
				/>
			</div>
		);
	}
});

module.exports = SaveChangesManager;