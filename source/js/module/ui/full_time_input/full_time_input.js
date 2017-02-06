const	React			= require('react'),

		TimeInput		= require('./../time_input/time_input'),
		TimeInputConsts	= require('./../time_input/const');

const FullTimeInput = React.createClass({
	propTypes: {
		handleChangeMinutes:	React.PropTypes.func.isRequired,
		handleChangeHour:		React.PropTypes.func.isRequired,
		minutesValue:			React.PropTypes.number.isRequired,
		hourValue:				React.PropTypes.number.isRequired
	},
	getInitialState: function(){
		return {focus: false}
	},
	handleChangeHourInput: function(hour){
		this.setState({focus:true});
		this.props.handleChangeHour(hour);
	},
	handleChangeMinutesInput: function(minutes){
		this.setState({focus:false});
		this.props.handleChangeMinutes(minutes);
	},

	render: function () {
		return (
			<div className="bFullTimeInput">
				<TimeInput	cssClassName	= { 'bSmallTimeInput' }
							value			= { this.props.hourValue }
							handleChange	= { this.handleChangeHourInput }
							type			= { TimeInputConsts.TIME_INPUT_TYPE.HOUR }
				/>
				<div className="eFullTimeInput_delimiter">:</div>
				<TimeInput	cssClassName	= { 'bSmallTimeInput' }
							value			= { this.props.minutesValue }
							handleChange	= { this.handleChangeMinutesInput }
							type			= { TimeInputConsts.TIME_INPUT_TYPE.MINUTES }
							focus			= { this.state.focus }
				/>
			</div>
		);
	}
});

module.exports = FullTimeInput;