/**
 * Created by Anatoly on 28.07.2016.
 */
const   React 	= require('react');

const Pagination = React.createClass({
	propTypes: {
		model: 	React.PropTypes.object
	},
	render: function() {
		const model = this.props.model;

		return (
			<div className="bPagination">
				<span className="bButton" onClick={model.nextPage.bind(model)}>More</span>
			</div>
		);
	}
});

module.exports = Pagination;