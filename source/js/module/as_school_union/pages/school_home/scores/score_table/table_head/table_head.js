const	React				= require('react'),
		DefaultTableHead	= require('module/as_school_union/pages/school_home/scores/score_table/table_head/default_table_head'),
		ShortTableHead		= require('module/as_school_union/pages/school_home/scores/score_table/table_head/short_table_head'),
		ScoreTableHelper	= require('module/as_school_union/pages/school_home/scores/score_table/helpers/score_table_helper');

const TableHead = React.createClass({
	propTypes: {
		sport: React.PropTypes.object.isRequired
	},
	render: function(){
		if(ScoreTableHelper.useDefaultScoreTable(this.props.sport)) {
			return (
				<DefaultTableHead/>
			);
		} else {
			return (
				<ShortTableHead/>
			);
		}
	}
});

module.exports = TableHead;