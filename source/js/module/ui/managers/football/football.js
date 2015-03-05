var FootballManager,
	Team = require('./team');

FootballManager = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('activeSchoolId'),
			rivalsType = binding.get('newEvent.model.rivalsType'),
			multipleCommand = rivalsType === 'houses' || rivalsType === 'classes',
			teamFirstBinding = {
				event: binding,
				default: binding.sub('newEvent.teams.first')
			},
			teamSecondBinding = {
				event: binding,
				default: binding.sub('newEvent.teams.second')
			};

		return <div className="eManagerGame mFootball">
			<Team binding={teamFirstBinding} />
			<div className="eManagerGame_field">
				<svg className="eManagerGame_fieldLayer" height="613.9539930555555" version="1.1" width="100%" xmlns="http://www.w3.org/2000/svg">
					<circle cx="77.55208333333333" cy="245.98551432291666" r="11" fill="#ee402f" stroke="none" strokeWidth="1" strokeLinejoin="round" data-toggle="tooltip" title="" data-original-title="Luca Zuffi">
						<text className="eManagerGame_playerTitle" x="24.850694444444443" y="534.38232421875" textAnchor="middle" stroke="none" fill="#ffffff" data-toggle="tooltip" title="" data-original-title="Matias Delgado">
							<tspan dy="4.49951171875">10</tspan>
						</text>
					</circle>
				</svg>
			</div>
			{multipleCommand ? <Team binding={teamSecondBinding} /> : null}
		</div>
	}
});

module.exports = FootballManager;
