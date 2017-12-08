const   React			= require('react'),
	
		{SVG}			= require('module/ui/svg'),
		TimeInput		= require('./../time_input/time_input'),
		TimeInputConsts	= require('./../time_input/const');

const TimePicker = React.createClass({
	propTypes: {
		hourValue:              React.PropTypes.number.isRequired,
		minutesValue:           React.PropTypes.number.isRequired,
		handleChangeHour:       React.PropTypes.func.isRequired,
		handleChangeMinutes:    React.PropTypes.func.isRequired
	},

	incHour: function() {
		return this.props.hourValue === 23 ? 0 : this.props.hourValue + 1;
	},
	decHour: function() {
		return this.props.hourValue === 0 ? 23 : this.props.hourValue - 1
	},
	incMin: function() {
		return this.props.minutesValue === 59 ? 0 : this.props.minutesValue + 1;
	},
	decMin: function() {
		return this.props.minutesValue === 0 ? 59 : this.props.minutesValue - 1;
	},

	handleClickArrow: function(direction, unitType) {
		switch (true) {
			case direction === 'up' && unitType === 'hour':
				this.props.handleChangeHour(this.incHour());
				break;
			case direction === 'down' && unitType === 'hour':
				this.props.handleChangeHour(this.decHour());
				break;
			case direction === 'up' && unitType === 'minutes':
				if(this.props.minutesValue === 59) {
					this.props.handleChangeHour(this.incHour());
				}
				this.props.handleChangeMinutes(this.incMin());
				break;
			case direction === 'down' && unitType === 'minutes':
				if(this.props.minutesValue === 0) {
					this.props.handleChangeHour(this.decHour());
				}
				this.props.handleChangeMinutes(this.decMin());
				break;
		}
	},

	render: function () {
		return (
			<div className="bTimePicker">
				<div className="eTimePicker_box">
					<span   className   = "eTimePicker_arrow mUp"
							onClick     = { this.handleClickArrow.bind(null, 'up', 'hour') }
					>
						<SVG icon="icon_arrow_top"/>
					</span>
					<TimeInput	cssClassName    = { 'eTimePicker_value' }
								value           = { this.props.hourValue }
								handleChange    = { this.props.handleChangeHour }
								type			= { TimeInputConsts.TIME_INPUT_TYPE.HOUR }
					/>
					<span   className   = "eTimePicker_arrow mDown"
							onClick     = { this.handleClickArrow.bind(null, 'down', 'hour') }
					>
						<SVG icon="icon_arrow_down"/>
					</span>
				</div>
				<div className="eTimePicker_box mDelimiter">:</div>
				<div className="eTimePicker_box">
					<span   className   = "eTimePicker_arrow mUp"
							onClick     = { this.handleClickArrow.bind(null, 'up', 'minutes') }
					>
						<SVG icon="icon_arrow_top"/>
					</span>
					<TimeInput	cssClassName    = { 'eTimePicker_value' }
								value           = { this.props.minutesValue }
								handleChange    = { this.props.handleChangeMinutes }
								type			= { TimeInputConsts.TIME_INPUT_TYPE.MINUTES }
					/>
					<span	className   = "eTimePicker_arrow mDown"
							onClick     = { this.handleClickArrow.bind(null, 'down', 'minutes') }
					>
						<SVG icon="icon_arrow_down"/>
					</span>
				</div>
			</div>
		);
	}
});


module.exports = TimePicker;