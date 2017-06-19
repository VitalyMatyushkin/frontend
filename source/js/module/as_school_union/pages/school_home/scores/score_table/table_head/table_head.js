const	React		= require('react'),
		Bootstrap  	= require('../../../../../../../styles/bootstrap-custom.scss');

const TableHead = React.createClass({
	propTypes: {
		sport: React.PropTypes.object.isRequired
	},
	render: function(){
		return (
			<thead>
			<tr>
				<th>#</th>
				<th>Team</th>
				<th>Total</th>
				<th>Won</th>
				<th>Lost</th>
				<th>Draw</th>
			</tr>
			</thead>
		);
	}
});

module.exports = TableHead;