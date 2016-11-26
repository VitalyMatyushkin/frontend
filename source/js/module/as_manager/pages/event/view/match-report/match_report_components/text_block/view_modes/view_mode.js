const	React				= require('react'),

		MatchReportStyle	= require('../../../../../../../../../../styles/ui/b_match_report.scss');

const ViewMode = React.createClass({
	propTypes: {
		header:	React.PropTypes.string.isRequired,
		text:	React.PropTypes.string
	},
	render: function(){
		return (
			<div className="eMatchReport_textBlock">
				<h3 className="eMatchReport_header">
					{this.props.header}
				</h3>
				{this.props.text}
			</div>
		);
	}
});

module.exports = ViewMode;