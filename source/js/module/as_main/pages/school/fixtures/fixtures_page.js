var FixturesPage,
	SVG = require('module/ui/svg'),
	FixturesList = require('module/ui/fixtures/fixtures_list');

FixturesPage = React.createClass({
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


		 /*
		window.Server.eventsBySchoolId.get({
			schoolId: activeSchoolId
		}).then(function (data) {
			binding
				.atomically()
				.set('models', Immutable.fromJS(data))
				.set('sync', true)
				.commit();
		});  */

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
