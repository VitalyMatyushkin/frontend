const	React				= require('react'),
		DefaultTableBody	= require('module/as_school_union/pages/school_home/scores/score_table/table_body/default_table_body'),
		ShortTableBody		= require('module/as_school_union/pages/school_home/scores/score_table/table_body/short_table_body'),
		ScoreTableHelper	= require('module/as_school_union/pages/school_home/scores/score_table/helpers/score_table_helper');

const TableBody = React.createClass({
	propTypes: {
		sport:	React.PropTypes.object.isRequired,
		scores:	React.PropTypes.object.isRequired
	},
	render: function(){
		if(ScoreTableHelper.useDefaultScoreTable(this.props.sport)) {
			return (
				<DefaultTableBody
					scores={this.props.scores}
				/>
			);
		} else {
			return (
				<ShortTableBody
					scores={this.props.scores}
				/>
			);
		}
	}
});

module.exports = TableBody;