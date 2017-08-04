const	React						= require('react');

const	TableViewRivalOrderStyle	= require('../../../../../../../../../../../styles/ui/b_table_view_rivals/b_table_view_rival_order.scss');

const Order = React.createClass({
	propTypes: {
		order: React.PropTypes.number.isRequired
	},
	render: function() {
		return (
			<div className="bTableViewRivalOrder">
				{ this.props.order }
			</div>
		);
	}
});

module.exports = Order;