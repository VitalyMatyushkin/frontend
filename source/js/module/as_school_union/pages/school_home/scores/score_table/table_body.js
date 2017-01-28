const	React		= require('react'),
		Bootstrap  	= require('../../../../../../../styles/bootstrap-custom.scss');

const TableBody = React.createClass({

	render: function(){
		return (
			<tbody>
			<tr>
				<th scope="row">1</th>
				<td>Great Walstead School</td>
				<td>20</td>
				<td>10</td>
				<td>4</td>
				<td>6</td>
			</tr>
			<tr>
				<th scope="row">2</th>
				<td>Handcross Park School</td>
				<td>16</td>
				<td>8</td>
				<td>3</td>
				<td>9</td>
			</tr>
			</tbody>
		);
	}
});

module.exports = TableBody;