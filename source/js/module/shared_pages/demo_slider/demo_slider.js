/**
 * Created by vitaly on 17.11.17.
 */

const 	React           = require('react'),
		TrainingSlider	= require('module/ui/training_slider/training_slider');

const DemoSlider= React.createClass({
	
	render: function() {
		return 	(
					<div className="bTrainingSlider bDemo_slider">
						<TrainingSlider/>
					</div>
				)
	}
});

module.exports = DemoSlider;
