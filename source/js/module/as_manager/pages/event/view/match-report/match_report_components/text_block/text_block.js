const	React				= require('react'),

		ViewMode			= require('./view_modes/view_mode'),
		EditMode			= require('./view_modes/edit_mode'),

		Consts				= require('./../consts'),
		MatchReportStyle	= require('../../../../../../../../../styles/ui/b_match_report.scss');

const TextBlock = React.createClass({
	propTypes:{
		header:			React.PropTypes.string.isRequired,
		handleChange:	React.PropTypes.func.isRequired,
		mode:			React.PropTypes.string,
		text:			React.PropTypes.string
	},
	getDefaultProps: function () {
		return {
			mode: Consts.REPORT_FILED_VIEW_MODE.VIEW
		}
	},
	render:function(){
		switch (this.props.mode) {
			case Consts.REPORT_FILED_VIEW_MODE.VIEW:
				return (
					<ViewMode	header	= {this.props.header}
								text	= {this.props.text}
					/>
				);
			case Consts.REPORT_FILED_VIEW_MODE.EDIT:
				return (
					<EditMode	header			= {this.props.header}
								text			= {this.props.text}
								handleChange	= {this.props.handleChange}
					/>
				);
		}
	}
});

module.exports = TextBlock;