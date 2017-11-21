/**
 * Created by vitaly on 17.11.17.
 */

const 	React           = require('react'),
		TrainingSlider	= require('module/ui/training_slider/training_slider');

const DemoSlider= React.createClass({
	
	handleClickCloseButton: function () {
		window.history.back();
	},
	
	handleClickTrainingSlider: function (e) {
		if (e.target.className === 'bTrainingSlider') {
			this.handleClickCloseButton();
		}
	},
	
	render: function() {
		return 	(
			<div className="bTrainingSlider" onClick={this.handleClickTrainingSlider}>
				<TrainingSlider
					handleClickCloseButton 	= {this.handleClickCloseButton}
				/>
			</div>
				)
	}
});

module.exports = DemoSlider;
