const	React		= require('react'),
		Bootstrap  	= require('../../../../styles/bootstrap-custom.scss');

const PlayerStatusTableHead = React.createClass({
	render: function(){
		return (
			<thead>
			<tr>
				<th>Name</th>
				<th>Status</th>
				<th>Parents</th>
				<th />
			</tr>
			</thead>
		);
	}
});

module.exports = PlayerStatusTableHead;