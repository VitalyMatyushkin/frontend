var SchoolListPage;

SchoolListPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return (
			<div className="bSchoolMaster">
				<h1>School control panel</h1>
			</div>
		)
	}
});


module.exports = SchoolListPage;
