const	React			= require('react'),
		classNames 		= require('classnames');

const	RadioButton		= require('module/ui/radio_button/radio_button');

const	EventConsts		= require('module/helpers/consts/events');

const	ManagerStyles	= require('styles/pages/events/b_events_manager.scss');

const ManagerGroupChanges 	= React.createClass({
	propTypes: {
		onClickRadioButton: 	React.PropTypes.func.isRequired,
		customStyles: 			React.PropTypes.string
	},
	getInitialState: function(){
		return {
			changeMode: EventConsts.CHANGE_MODE.SINGLE
		}
	},
	componentWillMount: function(){
		//set default value
		this.props.onClickRadioButton(EventConsts.CHANGE_MODE.SINGLE);
	},
	onClickRadioButton: function(mode){
		this.setState({
			changeMode: mode
		});
		this.props.onClickRadioButton(mode)
	},
	render: function() {
		const styles = classNames('eSavingPlayerChangesModePanel_radioButtons', this.props.customStyles);
		return (
			<div className={styles}>
				<span>
					Would you like to change this event only or this and all following events in the series?
				</span>
				<RadioButton	id			= { 'radio_button_only_this_event' }
								text		= { 'Only this event' }
								isChecked	= { this.state.changeMode === EventConsts.CHANGE_MODE.SINGLE}
								onClick		= { () => (this.onClickRadioButton(EventConsts.CHANGE_MODE.SINGLE)) }
				/>
				<RadioButton	id			= { 'radio_button_following_events' }
								text		= { 'Following events' }
								isChecked	= { this.state.changeMode === EventConsts.CHANGE_MODE.GROUP}
								onClick		= { () => (this.onClickRadioButton(EventConsts.CHANGE_MODE.GROUP)) }
				/>
			</div>
		);
	}
});

module.exports = ManagerGroupChanges;