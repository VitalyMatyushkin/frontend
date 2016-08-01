/**
 * Created by Anatoly on 28.07.2016.
 */
const   React 		= require('react'),
		classNames 	= require('classnames');

const Pagination = React.createClass({
	propTypes: {
		model: 	React.PropTypes.object
	},
	render: function() {
		const model = this.props.model,
				classes = classNames({
					bPagination:true,
					mHidden:model.isLastPage
				});

		return (
			<div className={classes}>
				<span className="bButton" onClick={model.nextPage.bind(model)}>More</span>
			</div>
		);
	}
});

module.exports = Pagination;