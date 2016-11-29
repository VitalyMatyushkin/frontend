/**
 * Created by Anatoly on 01.10.2016.
 */

const	React			= require('react');

const MatchReport = React.createClass({
	propTypes:{
		activeSchoolId: React.PropTypes.string.isRequired,
		report:			React.PropTypes.any.isRequired
	},
	render:function(){
		return(
			<div className="bMatchReport">
				<h3>Match Report </h3>
				{this.props.report.content}
			</div>
		);
	}
});

module.exports = MatchReport;

