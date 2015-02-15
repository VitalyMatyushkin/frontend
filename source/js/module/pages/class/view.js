var ClassForm = require('module/pages/class/add'),
	ClassViewPage;

ClassViewPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			schoolId = routingData.schoolId,
			classId = routingData.id,
			mode = routingData.mode;

		self.schoolId = schoolId;
		self.classId = classId;
		self.mode = mode || 'view';

		// Костыль, пока не будет ясности с путями хранения данных
		binding.clear();

		classId && window.Server.class.get({
			schoolId: schoolId,
			classId: classId
		}).then(function (data) {
			binding.set('data', Immutable.fromJS(data));
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bTest">
				<ClassForm mode={self.mode} classId={self.classId} schoolId={self.schoolId} binding={binding} />
			</div>
		)
	}
});


module.exports = ClassViewPage;
