const	React		= require('react'),
		Bootstrap  	= require('../../../../../../../styles/bootstrap-custom.scss');

const TableHead = React.createClass({

	render: function(){
		return (
			<thead>
			<tr>
				<th>#</th>
				<th>Team</th>
				<th>P</th>
				<th>W</th>
				<th>D</th>
				<th>L</th>
			</tr>
			</thead>
		);
	}
});

module.exports = TableHead;