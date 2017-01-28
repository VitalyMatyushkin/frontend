const	React							= require('react'),
		TableHead						= require('./table_head'),
		TableBody						= require('./table_body'),
		SchoolUnionSeasonScoresStyles	= require('../../../../../../../styles/ui/b_school_union_season_scores.scss'),
		Bootstrap						= require('../../../../../../../styles/bootstrap-custom.scss');

const ScoreTable = React.createClass({
	render: function(){
		return (
			<div className="eSchoolUnionSeasonScores_scoreTableWrapper">
				<table className="table table-striped">
					<TableHead/>
					<TableBody/>
				</table>
			</div>
		);
	}
});

module.exports = ScoreTable;