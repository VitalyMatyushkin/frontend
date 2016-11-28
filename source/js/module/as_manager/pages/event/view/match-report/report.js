const	React				= require('react'),

		SVG					= require('../../../../../ui/svg'),

		TextBlock			= require('./match_report_components/text_block/text_block'),
		TimeBlock			= require('./match_report_components/time_block/time_block'),


		Consts				= require('./match_report_components/consts'),
		MatchReportStyle	= require('../../../../../../../styles/ui/b_match_report.scss');

const MatchReport = React.createClass({
	propTypes:{
		name:				React.PropTypes.string.isRequired,
		venue:				React.PropTypes.string.isRequired,
		description:		React.PropTypes.string.isRequired,
		kitNotes:			React.PropTypes.string.isRequired,
		comments:			React.PropTypes.string.isRequired,
		teamDeparts:		React.PropTypes.string.isRequired,
		teamReturns:		React.PropTypes.string.isRequired,
		meetTime:			React.PropTypes.string.isRequired,
		teaTime:			React.PropTypes.string.isRequired,
		lunchTime:			React.PropTypes.string.isRequired,
		handleChange:		React.PropTypes.func.isRequired,
		handleChangeMode:	React.PropTypes.func.isRequired
	},
	getInitialState: function() {
		return {
			viewMode: Consts.REPORT_FILED_VIEW_MODE.VIEW
		};
	},
	handleClickEditButton: function() {
		switch (this.state.viewMode) {
			case Consts.REPORT_FILED_VIEW_MODE.VIEW:
				this.setState({viewMode: Consts.REPORT_FILED_VIEW_MODE.EDIT});
				this.props.handleChangeMode(Consts.REPORT_FILED_VIEW_MODE.EDIT);
				break;
			case Consts.REPORT_FILED_VIEW_MODE.EDIT:
				this.setState({viewMode: Consts.REPORT_FILED_VIEW_MODE.VIEW});
				this.props.handleChangeMode(Consts.REPORT_FILED_VIEW_MODE.VIEW);
				break;
		}
	},
	render: function() {
		return(
			<div className="bMatchReport">
				<div className="eMatchReport_column mBig">
					<TextBlock	header			= {this.props.name}
								mode			= {Consts.REPORT_FILED_VIEW_MODE.VIEW}
								text			= {this.props.venue}
								handleChange	= {this.props.handleChange.bind(null, 'name')}
					/>
					<TextBlock	header			= {"Event Description"}
								text			= {this.props.description}
								mode			= {this.state.viewMode}
								handleChange	= {this.props.handleChange.bind(null, 'description')}
					/>
					<TextBlock	header			= {"Kit notes"}
								text			= {this.props.kitNotes}
								mode			= {this.state.viewMode}
								handleChange	= {this.props.handleChange.bind(null, 'kitNotes')}
					/>
					<TextBlock	header			= {"Comments"}
								text			= {this.props.comments}
								mode			= {this.state.viewMode}
								handleChange	= {this.props.handleChange.bind(null, 'comments')}
					/>
				</div>
				<div className="eMatchReport_column mGrayBackground mWithoutPadding">
					<div className = "eMatchReport_editButtonWrapper">
						<div	className	= "eMatchReport_editButton"
								onClick		= {this.handleClickEditButton}
						>
							<SVG icon="icon_edit"/>
						</div>
					</div>
					<div className="eMatchReport_infoContainer">
							<TimeBlock	label			= {"Team departs"}
										dateString		= {this.props.teamDeparts}
										mode			= {this.state.viewMode}
										handleChange	= {this.props.handleChange.bind(null, 'teamDeparts')}
							/>
							<TimeBlock	label			= {"Team returns"}
										dateString		= {this.props.teamReturns}
										mode			= {this.state.viewMode}
										handleChange	= {this.props.handleChange.bind(null, 'teamReturns')}
							/>
							<TimeBlock	label			= {"Meet time"}
										dateString		= {this.props.meetTime}
										mode			= {this.state.viewMode}
										handleChange	= {this.props.handleChange.bind(null, 'meetTime')}
							/>
							<TimeBlock	label			= {"Tea time"}
										dateString		= {this.props.teaTime}
										mode			= {this.state.viewMode}
										handleChange	= {this.props.handleChange.bind(null, 'teaTime')}
							/>
							<TimeBlock	label			= {"Lunch time"}
										dateString		= {this.props.lunchTime}
										mode			= {this.state.viewMode}
										handleChange	= {this.props.handleChange.bind(null, 'lunchTime')}
							/>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = MatchReport;

