const 	{SVG} 			= require('module/ui/svg'),
		React 			= require('react'),
		FixturesList 	= require('../../fixtures/fixtures_list'),
		Morearty        = require('morearty'),
		Immutable 		= require('immutable');

const FixturesPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		var self = this;

		return Immutable.fromJS({
			fixtures: {}
		});
	},
	componentWillMount: function () {
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('activeSchoolId'),
			binding = self.getDefaultBinding();

		if (!activeSchoolId) {
			console.error('School id is not set');

			return false;
		}

		window.Server.fixturesBySchoolId.get(activeSchoolId, {
			filter: {
				include: 'sport',
				limit: 10,
				order: 'startTime asc',
				where: {
					status: 'waiting game'
				}
			}
		}).then(function(data) {
			binding.set('fixtures', Immutable.fromJS(data));
		});

	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<FixturesList binding={binding.sub('fixtures')} />
			</div>
		)
	}
});


module.exports = FixturesPage;
