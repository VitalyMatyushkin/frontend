const	React				= require('react'),
		Bootstrap			= require('../../../../../../../../styles/bootstrap-custom.scss');

const ShortTableBody = React.createClass({
	propTypes: {
		scores: React.PropTypes.object.isRequired
	},
	renderRows: function() {
		const scores = this.props.scores;

		if(typeof scores !== 'undefined') {
			const scoreArray = [];

			for(let schoolId in scores) {
				scoreArray.push(scores[schoolId]);
			}

			return scoreArray
				.sort((s1, s2) => {
					if(s1.point < s2.point) {
						return -1;
					} else if(s1.point > s2.point) {
						return 1;
					} else {
						return 0;
					}
				})
				.map((s, index) => {
					return (
						<tr key={index}>
							<th scope="row">{index + 1}</th>
							<td>{s.schoolName}</td>
							<td>{s.points}</td>
						</tr>
					)
				});
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

module.exports = ShortTableBody;