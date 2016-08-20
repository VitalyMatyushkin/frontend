/**
 * Created by Anatoly on 28.07.2016.
 */
const   React 		= require('react'),
		SVG 		= require('module/ui/svg'),
		classNames 	= require('classnames');

const Pagination = React.createClass({
	propTypes: {
		model: 	React.PropTypes.object.isRequired
	},
	render: function() {
		const model = this.props.model,
				classes = classNames({
					bPagination:true,
					mLoading: model.isLoading,
					mLast:model.isLastPage
				});

		return (
			<div className={classes}>
				<span className="bButton" onClick={model.nextPage.bind(model)}>More</span>
				<div className="eLoader"><SVG icon="icon_spin-loader-black" /></div>
			</div>
		);
	}
});

module.exports = Pagination;