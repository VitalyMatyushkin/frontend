const	React							= require('react'),
		TableHead						= require('./table_head/table_head'),
		TableBody						= require('./table_body/table_body'),
		SchoolUnionSeasonScoresStyles	= require('../../../../../../../styles/ui/b_school_union_season_scores.scss'),
		Bootstrap						= require('../../../../../../../styles/bootstrap-custom.scss');

const ScoreTable = React.createClass({
	propTypes: {
		sport:	React.PropTypes.object.isRequired,
		scores:	React.PropTypes.object.isRequired
	},
	render: function(){
		return (
			<div className="eSchoolUnionSeasonScores_scoreTableWrapper">
				<table className="table table-striped">
					<TableHead
						sport	= { this.props.sport }
					/>
					<TableBody
						sport	= { this.props.sport }
						scores	= { this.props.scores }
					/>
				</table>
			</div>
		);
	}
});

module.exports = ScoreTable;