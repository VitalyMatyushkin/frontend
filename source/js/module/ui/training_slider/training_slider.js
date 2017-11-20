/**
 * Created by vitaly on 15.11.17.
 */
const React = require('react');

const slides = [
	{src: '/images/slides/01.gif', time: 7000},
	{src: '/images/slides/02.gif', time: 9000},
	{src: '/images/slides/03.gif', time: 7000},
	{src: '/images/slides/04.gif', time: 10000},
	{src: '/images/slides/05.gif', time: 10000},
	{src: '/images/slides/06.gif', time: 10000},
	{src: '/images/slides/07.gif', time: 10000},
	{src: '/images/slides/08.gif', time: 18000}
];


const TrainingSlider = React.createClass({
	propTypes: {
		webIntroEnabled:			React.PropTypes.bool,
		handleClickDontshowAgain:	React.PropTypes.function,
		handleClickCloseButton:		React.PropTypes.function
	},
	getInitialState: function () {
		return {slides: slides, pointer: 0};
	},
	
	componentDidMount: function () {
		this.changeStateTimerId = setInterval(() => this.handleNextSlide(), slides[0].time);
	},
	
	componentWillUnmount: function () {
		this.changeStateTimerId && clearInterval(this.changeStateTimerId);
	},

	handleNextSlide: function () {
		const {pointer, slides} = this.state;
		let nextPointer = 0;
		if (pointer !== slides.length-1) {
			nextPointer = pointer + 1;
		}
		this.setState({pointer: nextPointer});
		this.resetTimeInterval(nextPointer);
	},
	
	handlePreviousSlide: function () {
		const {pointer,slides} = this.state;
		let previousPointer;
		if (pointer !== 0) {
			previousPointer = pointer -1;
		} else {
			previousPointer = slides.length-1;
		}
		this.setState({pointer: previousPointer});
		this.resetTimeInterval(previousPointer);
	},
	
	resetTimeInterval: function (pointer) {
		this.changeStateTimerId && clearInterval(this.changeStateTimerId);
		this.changeStateTimerId = setInterval(() => this.handleNextSlide(), slides[pointer].time);
	},
	
	renderNextButton: function () {
		if (this.state.pointer < slides.length-1) {
			return <div className="eSlider_button eSlider_next" onClick={() => this.handleNextSlide()}/>;
		} else {
			return null;
		}
	},
	
	renderPreviousButton: function () {
		if (this.state.pointer > 0) {
			return <div className="eSlider_button eSlider_previous" onClick={() => this.handlePreviousSlide()}/>;
		} else {
			return null;
		}
	},
	
	renderNavigationPanel: function () {
		const pointer = this.state.pointer;
		const buttons = slides.map((slide, index) => {
			const activeClass = index === pointer ? "eSlide_buttons_active" : "";
			return <div id={"slide_"+index} className={"eSlide_buttons "+activeClass} onClick={this.handleNavigationSlide.bind(null,index)}/>;
		});
		return buttons;
	},
	
	handleNavigationSlide: function (index) {
		this.setState({
			pointer: index
		});
		this.resetTimeInterval(index);
	},
	
	render: function() {
		const currentSlide = this.state.slides[this.state.pointer].src;
		return(
			<div className="bTraining_slider_wrapper">
					<img className="bTraining_slide" src={currentSlide} />
					{ this.props.handleClickCloseButton ?
						<div className="eSlider_Close" onClick={ this.props.handleClickCloseButton }/>
						: null
					}
					{ this.props.handleClickDontshowAgain ?
						<span className="eShow_again">
							<span>Don't show again</span>
							<input
								name="isGoing"
								type="checkbox"
								checked={ !this.props.webIntroEnabled }
								onChange={ this.props.handleClickDontshowAgain }
							/>
						</span>
					: null }
					{this.renderPreviousButton()}
					{this.renderNextButton()}
					<div className="bNavigation_panel">
						{this.renderNavigationPanel()}
					</div>
			</div>
		);
	}
});
module.exports = TrainingSlider;