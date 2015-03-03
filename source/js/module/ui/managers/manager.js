var Manager,
	FootballManager = require('./football/football');

Manager = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		game: React.PropTypes.oneOf(['football']).isRequired
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			dataBinding = self.getBinding('data');

		return <div className="bManager">
			<div className="eManager_gameDate">28.03.2015 - schools</div>
			<div className="eManager_gameResult">
				<span className="eManager_rival">FCB</span>
				<span className="eManager_score">1:0</span>
				<span className="eManager_rival">EBS</span>
			</div>
			<FootballManager binding={binding}  />
		</div>
	}
});

module.exports = Manager;
