const	React		= require('react'),
		Bootstrap  	= require('../../../../../../../styles/bootstrap-custom.scss');

const TableBody = React.createClass({
	propTypes: {
		scores: React.PropTypes.object.isRequired
	},
	renderRows: function() {
		const scores = this.props.scores;

		if(typeof scores !== 'undefined') {
			const xmlScore = [];

			let index = 1;
			for(let schoolId in scores) {
				xmlScore.push(
					<tr key={schoolId}>
						<th scope="row">{index++}</th>
						<td>{scores[schoolId].schoolName}</td>
						<td>{scores[schoolId].total}</td>
						<td>{scores[schoolId].won}</td>
						<td>{scores[schoolId].lost}</td>
						<td>{scores[schoolId].drew}</td>
					</tr>
				);
			}

			return xmlScore;
		} else {
			return null;
		}
	},
	render: function(){
		return (
			<tbody>
				{ this.renderRows() }
			</tbody>
		);
	}
});

module.exports = TableBody;