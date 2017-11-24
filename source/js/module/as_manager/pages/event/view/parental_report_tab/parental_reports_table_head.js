/**
 * Created by Woland on 23.11.2017.
 */
const React = require('react');

const ParentalReportsTableHead = React.createClass({
	render: function(){
		return (
			<thead>
				<tr>
					<th>Name</th>
					<th>Available</th>
					<th>Details</th>
					<th>Sender</th>
					<th>Status</th>
					<th />
				</tr>
			</thead>
		);
	}
});

module.exports = ParentalReportsTableHead;