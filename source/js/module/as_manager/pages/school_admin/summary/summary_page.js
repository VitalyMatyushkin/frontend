var SchoolSummary;

SchoolSummary = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
		self.request = window.Server.schoolsFindOne.get({
            filter: {
                where: {
                    id: activeSchoolId
                },
                include: ['zipCode']
            }
        }).then(function (data) {
			binding.set(Immutable.fromJS(data));
			self.isMounted() && self.forceUpdate();
		});
	},
	componentWillUnmount: function () {
		var self = this;

		self.request && self.request.abort();
	},
	render: function () {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<h1 className="eSchoolMaster_title"> School {binding.get('name')} summary inforamtion

					<div className="eSchoolMaster_buttons">

						<a href={'/#schools/edit?id=' + self.activeSchoolId} className="bButton">Edit...</a>
						<a href="/#schools" className="bButton">Change active school...</a>
					</div>
				</h1>
                <p>PostCode: {binding.get('zipCode.zipCode')}</p>
				<p>Address: {binding.get('address')}</p>
				<p>Description: {binding.get('description')}</p>
			</div>
		)
	}
});


module.exports = SchoolSummary;
