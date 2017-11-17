/**
 * Created by vitaly on 16.11.17.
 */
const	React			= require('react'),
		Morearty		= require('morearty'),
		TrainingSlider	= require('./training_slider');

const SliderAlert = React.createClass({
	mixins: [Morearty.Mixin],
	
	handleClickCloseButton: function() {
		const binding = this.getDefaultBinding();
		
		let webIntroShowTimes = binding.get('webIntroShowTimes');
		webIntroShowTimes = typeof webIntroShowTimes === "undefined" ? 1 : ++webIntroShowTimes;
		
		window.Server.profile.put({webIntroShowTimes}).then(() => {
			if (webIntroShowTimes === 5) {
				this.sendWebIntroEnabled(false);
			}
			binding.set('isOpen', false);
		});
	},
	handleClickDontshowAgain: function(event) {
		const 	binding = this.getDefaultBinding();
		
		binding.set('webIntroEnabled', !event.target.checked);
		console.log(!event.target.checked);
		this.sendWebIntroEnabled(!event.target.checked);
	},
	sendWebIntroEnabled: function (webIntroEnabled) {
		window.Server.profile.put({webIntroEnabled});
	},
	
	render: function() {
		const binding = this.getDefaultBinding();
		
		const	isOpen = !!binding.toJS('isOpen'),
				webIntroEnabled = !!binding.toJS('webIntroEnabled');

		if(isOpen) {
			return (
				<div className="bTrainingSlider">
					<TrainingSlider
						webIntroEnabled				= {webIntroEnabled}
						handleClickDontshowAgain 	= {this.handleClickDontshowAgain}
						handleClickCloseButton 		= {this.handleClickCloseButton}
					/>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = SliderAlert;