const	React			= require('react'),

		{DateHelper}		= require('../../../../../../../../helpers/date_helper'),

		FullTimeInput	= require('../../../../../../../../ui/full_time_input/full_time_input'),

		DetailsStyle	= require('../../../../../../../../../../styles/ui/b_details.scss');

const EditMode = React.createClass({
	propTypes:{
		label			: React.PropTypes.string.isRequired,
		dateString		: React.PropTypes.string.isRequired,
		handleChange	: React.PropTypes.func.isRequired
	},
	handleChangeHour: function(hours) {
		const dateObject = new Date(this.props.dateString);

		dateObject.setHours(hours);

		this.props.handleChange(dateObject.toISOString());
	},
	handleChangeMinutes: function(minute) {
		const dateObject = new Date(this.props.dateString);

		dateObject.setMinutes(minute);

		this.props.handleChange(dateObject.toISOString());
	},
	render:function(){
		const dateObject = new Date(this.props.dateString)

		return(
			<div className="eDetails_time">
				<div className="eDetails_timeLabel">
					{this.props.label}
				</div>
				<div className="eDetails_timeValue">
					<FullTimeInput	hourValue			= { dateObject.getHours() }
									minutesValue		= { dateObject.getMinutes() }
									handleChangeHour	= { this.handleChangeHour }
									handleChangeMinutes	= { this.handleChangeMinutes }
					/>
				</div>
			</div>
		);
	}
});

module.exports = EditMode;