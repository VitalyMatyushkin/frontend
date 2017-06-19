const	React		= require('react'),
		Bootstrap  	= require('../../../../../../../../styles/bootstrap-custom.scss');

const ShortTableHead = React.createClass({
	render: function(){
		return (
			<thead>
			<tr>
				<th>#</th>
				<th>Team</th>
				<th>Scores</th>
			</tr>
			</thead>
		);
	}
});

module.exports = ShortTableHead;