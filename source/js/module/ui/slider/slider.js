/**
 * Created by Woland on 11.03.2017.
 */
const React = require('react');


/**
 * Component slider that simply takes an array of pictures and outputs each in a separate div
 * Component change the picture randomly every 5s (use component state for re-render)
 */
const Slider = React.createClass({
	propTypes: {
		items: React.PropTypes.array.isRequired
	},
	
	getInitialState: function() {
		return {
			currentSlide:	0,
			intervalId:		undefined
		}
	},
	
	componentWillMount: function(){
		const intervalId = setInterval(() => {
			this.nextSlide();
		}, 5000);
		this.setState({intervalId: intervalId});
	},
	
	componentWillUnmount: function(){
		if(this.state.intervalId)
			clearInterval(this.state.intervalId);
	},
	
	getItems: function(){
		return this.props.items.map((item, index) => {
			const isShowing = this.state.currentSlide === index ? 'mShowing' : '';
			return <img className={'eSchoolHeader_slider mTransitionImage ' + isShowing} key={index} src={item}/>
		});
	},
	 
	nextSlide: function(){
		const 	prevSlideIndex		= this.state.currentSlide,
			 	totalSlidesCount	= this.props.items.length,
				nextSlideIndex		= (prevSlideIndex + 1) % totalSlidesCount;

		this.setState({currentSlide: nextSlideIndex});
	},
	
	render: function(){
		return (
			<div>
				{this.getItems()}
			</div>
		);
	}
});

module.exports = Slider;