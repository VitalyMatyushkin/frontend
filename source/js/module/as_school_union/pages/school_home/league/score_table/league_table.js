const	React							= require('react'),
		TableHead						= require('./table_head/table_head'),
		TableBody						= require('./table_body/table_body'),
		SchoolUnionSeasonScoresStyles	= require('../../../../../../../styles/ui/b_school_union_season_scores.scss'),
		Bootstrap						= require('../../../../../../../styles/bootstrap-custom.scss');


const LeagueTable = React.createClass({
	propTypes: {
		scores: 	React.PropTypes.array.isRequired
	},
	
	renderHead: function(titles, description) {
		const columns = titles.map( (title, i) => {
			if (description[i] === '') {
				return <th key={title + i}>{title}</th>;
			} else {
				return <th key={title + i} className="bTooltip" data-description={description[i]}>{title}</th>;
			}
		});
		return (
			<thead>
			<tr>
				<th>#</th>
				{columns}
			</tr>
			</thead>
		);
	},
	
	renderBody: function(titles, scoresData) {
		const sortedScoresData = scoresData.sort( (rowA, rowB) => rowA.Points < rowB.Points);
		
		const rows = sortedScoresData.map( (rowObj, i) => {
			const cells = titles.map( title => {
				return <td key={title+i}>{rowObj[title]}</td>;
			});
			return (
				<tr key={i}>
					<th scope="row">{i + 1}</th>
					{cells}
				</tr>
			);
		});
		return (<tbody>{rows}</tbody>);
	},
	
	render: function(){
		const	scores				= this.props.scores,
				titles				= ['schoolName', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Points'],
				titlesDescription 	= ['', 'Play', 'Win', 'Draw', 'Lose', 'Goal For', 'Goal Against', 'Goal Difference', ''],
				displayTitles		= titles.map( key => key === 'schoolName' ? '' : key);
		return (
			<div className="eSchoolUnionSeasonScores_scoreTableWrapper">
				<div className="table-responsive">
					<table className="table table-striped">
						{this.renderHead(displayTitles, titlesDescription)}
						{this.renderBody(titles, scores)}
					</table>
				</div>
			</div>
		);
	}
});

module.exports = LeagueTable;