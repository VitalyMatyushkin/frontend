const	React			= require('react'),

		{DateHelper}		= require('../../../../../../../../helpers/date_helper'),

		DetailsStyle	= require('../../../../../../../../../../styles/ui/b_details.scss');

const ViewMode = React.createClass({
	propTypes:{
		label:		React.PropTypes.string.isRequired,
		dateString:	React.PropTypes.string.isRequired
	},
	getTimeView: function() {
		return DateHelper.getShortTimeStringFromDateObject(this.props.dateString);
	},
	render:function(){
		return(
			<div className="eDetails_time">
				<div className="eDetails_timeLabel">
					{this.props.label}
				</div>
				<div className="eDetails_timeValue">
					{this.getTimeView()}
				</div>
			</div>
		);
	}
});

module.exports = ViewMode;