var FootballManager,
	Team = require('./team');

FootballManager = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return <div className="eManagerGame mFootball">
			<Team binding={binding} />
			<div className="eManagerGame_field">
				<svg className="eManagerGame_fieldLayer" height="613.9539930555555" version="1.1" width="100%" xmlns="http://www.w3.org/2000/svg">
					<circle cx="77.55208333333333" cy="245.98551432291666" r="11" fill="#ee402f" stroke="none" strokeWidth="1" strokeLinejoin="round" data-toggle="tooltip" title="" data-original-title="Luca Zuffi">
						<text className="eManagerGame_playerTitle" x="24.850694444444443" y="534.38232421875" textAnchor="middle" stroke="none" fill="#ffffff" data-toggle="tooltip" title="" data-original-title="Matias Delgado">
							<tspan dy="4.49951171875">10</tspan>
						</text>
					</circle>
				</svg>
			</div>
			<Team binding={binding} />
		</div>
	}
});

module.exports = FootballManager;
