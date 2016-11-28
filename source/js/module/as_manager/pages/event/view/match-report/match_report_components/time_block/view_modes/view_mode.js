const	React				= require('react'),

		DateHelper			= require('../../../../../../../../helpers/date_helper'),

		MatchReportStyle	= require('../../../../../../../../../../styles/ui/b_match_report.scss');

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
			<div className="eMatchReport_time">
				<div className="eMatchReport_timeLabel">
					{this.props.label}
				</div>
				<div className="eMatchReport_timeValue">
					{this.getTimeView()}
				</div>
			</div>
		);
	}
});

module.exports = ViewMode;