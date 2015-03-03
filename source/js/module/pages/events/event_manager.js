var Panel = require('./panel'),
	EventManager,
	Manager = require('module/ui/managers/manager');

EventManager = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.OVERWRITE;
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			newEvent: {
				model: {
					rivalsType: 'schools'
				},
				inviteModel: {},
				step: 'chooseType'
			}
		});
	},
	nextStep: function () {
		var self = this;
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			managerBinding = {
				default: binding,
				data: binding.get('newEvent')
			};

		return <div className="bEvents">
			<Panel binding={binding} />
			<Manager binding={managerBinding} game="football" />
		</div>
	}
});


module.exports = EventManager;
