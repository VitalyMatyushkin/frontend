const	React		= require('react'),
		Bootstrap  	= require('../../../../../../../../styles/bootstrap-custom.scss');

const DefaultTableHead = React.createClass({
	render: function(){
		return (
			<thead>
			<tr>
				<th>#</th>
				<th>Team</th>
				<th>Scores</th>
				<th>Total</th>
				<th>Won</th>
				<th>Lost</th>
				<th>Draw</th>
			</tr>
			</thead>
		);
	}
});

module.exports = DefaultTableHead;