/**
 * Created by Woland on 11.03.2017.
 */
const React = require('react');

function getMaxOfArray(numArray) {
	return Math.max.apply(null, numArray);
}

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
			currentSlide: 0,
			maxHeights: []
		}
	},
	
	componentWillMount: function(){
		this.intervalId = setInterval(() => {
			this.nextSlide();
		}, 5000);
	},
	
	componentWillUnmount: function(){
		clearInterval(this.intervalId);
	},
	
	getItems: function(){
		return this.props.items.map((item, index) => {
			const isShowing = this.state.currentSlide === index ? 'mShowing' : '';
			return <img className={'eSchoolHeader_slider mTransitionImage ' + isShowing} key={index} src={item}/>
		});
	},
	 
	nextSlide: function(){
		const randIndexPos 	= Math.floor(Math.random() * this.props.items.length);
		this.setState({currentSlide: randIndexPos});
	},
	
	onLoadImage: function(e){
		let arrayHeights = this.state.maxHeights;
		
		arrayHeights.push(e.target.height);
		
		this.setState({maxHeights: arrayHeights});
	},
	
	renderInvisibleImages: function(){
		return this.props.items.map( (img, index) => {
			return <img key={index} onLoad={this.onLoadImage} src={img} style={{display:'none', maxWidth:'100%'}}/>
		});
	},
		
	renderMaxHeightImage: function(){
		const maxHeight = getMaxOfArray(this.state.maxHeights);
		if (maxHeight) {
			return <img style={{visibility:'hidden', height: maxHeight, maxWidth:'100%'}}/>
		} else {
			return null;
		}
	},
	
	render: function(){
		return (
			<div>
				{this.renderInvisibleImages()}
				{this.renderMaxHeightImage()}
				{this.getItems()}
			</div>
		);
	}
});

module.exports = Slider;