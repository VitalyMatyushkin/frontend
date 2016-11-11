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

	render: function () {
		return (
			<div className="bFullTimeInput">
				<TimeInput	cssClassName	= { 'bSmallTimeInput' }
							value			= { this.props.hourValue }
							handleChange	= { this.props.handleChangeHour }
							type			= { TimeInputConsts.TIME_INPUT_TYPE.HOUR }
				/>
				<div className="eFullTimeInput_delimiter">:</div>
				<TimeInput	cssClassName	= { 'bSmallTimeInput' }
							value			= { this.props.minutesValue }
							handleChange	= { this.props.handleChangeMinutes }
							type			= { TimeInputConsts.TIME_INPUT_TYPE.MINUTES }
				/>
			</div>
		);
	}
});

module.exports = FullTimeInput;