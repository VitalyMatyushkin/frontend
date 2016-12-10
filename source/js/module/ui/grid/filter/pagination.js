/**
 * Created by Anatoly on 28.07.2016.
 */
const   React 			= require('react'),
		SVG 			= require('module/ui/svg'),
		PaginationModel = require('./model/pagination-model'),
		classNames 		= require('classnames');

const Pagination = React.createClass({
	propTypes: {
		model: 	React.PropTypes.instanceOf(PaginationModel).isRequired
	},
	componentWillMount:function () {
		const self = this,
			model = this.props.model;

		model.addListener();
		model.onShowBtnUp = this.onRender;
	},
	componentWillUnmount: function () {
		this.props.model.removeListeners();
	},
	onRender:function(){
		this.setState({scrollY: window.scrollY});
	},
	render: function() {
		const model = this.props.model,
				classes = classNames({
					bPagination:	true,
					mLoading: 		model.isLoading,
					mLast:			model.isLastPage,
					mScrolled: 		model.isScrolled
				});

		return (
			<div className={classes}>
				<span className="bButton" onClick={model.nextPage.bind(model)}>More</span>
				<div className="eLoader"><SVG icon="icon_spin-loader-black" /></div>
				<div className="bButton mUp" onClick={model.onScrollTop}>Up ↑</div>
			</div>
		);
	}
});

module.exports = Pagination;