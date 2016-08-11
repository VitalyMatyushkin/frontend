/**
 * Created by Anatoly on 20.07.2016.
 */

const   HeadCell 	= require('./header/head-cell'),
		React 		= require('react');

const Header = React.createClass({
	propTypes: {
		columns: 	React.PropTypes.array.isRequired
	},
	render: function() {
		return (
			<div className="eDataList_listItem mHead">
				{this.props.columns.map((column, index) => {
					return <HeadCell key={index} column={column} order={this.props.order} />
				})}
			</div>
		);
	}
});

module.exports = Header;
