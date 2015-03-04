var FootballManager,
    Autocomplete = require('module/ui/autocomplete/autocomplete'),
	Team = require('./team');

FootballManager = React.createClass({
	mixins: [Morearty.Mixin],
    getDefaultState: function () {
        return Immutable.fromJS({
            autocompleteLeaners: {}
        });
    },
    serviceLearnersFilter: function (schoolId, learnerName) {
        return window.Server.learnersFilter.get({
            filter: {
                where: {
                    schoolId: schoolId,
                    or: [
                        {
                            firstName: {
                                like: learnerName,
                                options: 'i'
                            }
                        },
                        {
                            lastName: {
                                like: learnerName,
                                options: 'i'
                            }
                        }
                    ]
                }
            }
        }).then(function (data) {
            data.map(function (player) {
                var name = player.firstName + ' ' + player.lastName;
                player.name = name;

                return player.name;
            });

            return data;
        });
    },
    onSelectLearner: function () {
        console.log(arguments)
    },
	render: function() {
		var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('activeSchoolId'),
			binding = self.getDefaultBinding();

		return <div className="eManagerGame mFootball">
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
            <Autocomplete
                serviceFilter={self.serviceLearnersFilter.bind(null, activeSchoolId)}
                serverField="name"
                onSelect={self.onSelectLearner}
                binding={binding.sub('autocompleteLeaners')}
            />
		</div>
	}
});

module.exports = FootballManager;
