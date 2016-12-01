const	React				= require('react'),

		SVG					= require('../../../../../ui/svg'),

		TextBlock			= require('./details_components/text_block/text_block'),
		TimeBlock			= require('./details_components/time_block/time_block'),

		If					= require('../../../../../ui/if/if'),

		Consts				= require('./details_components/consts'),
		DetailsStyle		= require('../../../../../../../styles/ui/b_details.scss');

const Details = React.createClass({
	propTypes:{
		name:				React.PropTypes.string.isRequired,
		officialName:		React.PropTypes.string.isRequired,
		venue:				React.PropTypes.string.isRequired,
		description:		React.PropTypes.string,
		kitNotes:			React.PropTypes.string,
		comments:			React.PropTypes.string,
		teamDeparts:		React.PropTypes.string,
		teamReturns:		React.PropTypes.string,
		meetTime:			React.PropTypes.string,
		teaTime:			React.PropTypes.string,
		lunchTime:			React.PropTypes.string,
		handleChange:		React.PropTypes.func.isRequired,
		handleChangeMode:	React.PropTypes.func.isRequired,
		isParent:			React.PropTypes.bool.isRequired
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
		return (
			<div className="bDetails">
				<div className="eDetails_column mBig">
					<div className="eDetails_columnContent">
						<div className="eDetails_textBlock">
							<h3 className="eDetails_header">
								{this.props.name}
							</h3>
							<h4 className="eDetails_header mSmall">
								{this.props.officialName}
							</h4>

							<div className="eDetails_body">
								{this.props.venue}
							</div>
						</div>
						<TextBlock	header={"Event Description"}
									text={this.props.description}
									mode={this.state.viewMode}
									handleChange={this.props.handleChange.bind(null, 'description')}
							/>
						<TextBlock	header={"Kit notes"}
									text={this.props.kitNotes}
									mode={this.state.viewMode}
									handleChange={this.props.handleChange.bind(null, 'kitNotes')}
							/>
						<TextBlock	header={"Comments"}
									text={this.props.comments}
									mode={this.state.viewMode}
									handleChange={this.props.handleChange.bind(null, 'comments')}
							/>
					</div>
				</div>
				<div className="eDetails_column">
					<div className="eDetails_columnContent mGrayBackground  mWithoutPadding">
						<div className="eDetails_editButtonWrapper">
							<If condition={!this.props.isParent}>
								<div className="eDetails_editButton"
									 onClick={this.handleClickEditButton}
									>
									<i className="fa fa-pencil" aria-hidden="true"></i>

								</div>
							</If>
						</div>
						<div className="eDetails_infoContainer">
							<TimeBlock	label={"Team departs"}
										dateString={this.props.teamDeparts}
										mode={this.state.viewMode}
										handleChange={this.props.handleChange.bind(null, 'teamDeparts')}
								/>
							<TimeBlock	label={"Team returns"}
										dateString={this.props.teamReturns}
										mode={this.state.viewMode}
										handleChange={this.props.handleChange.bind(null, 'teamReturns')}
								/>
							<TimeBlock	label={"Meet time"}
										dateString={this.props.meetTime}
										mode={this.state.viewMode}
										handleChange={this.props.handleChange.bind(null, 'meetTime')}
								/>
							<TimeBlock	label={"Tea time"}
										dateString={this.props.teaTime}
										mode={this.state.viewMode}
										handleChange={this.props.handleChange.bind(null, 'teaTime')}
								/>
							<TimeBlock	label={"Lunch time"}
										dateString={this.props.lunchTime}
										mode={this.state.viewMode}
										handleChange={this.props.handleChange.bind(null, 'lunchTime')}
								/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Details;

