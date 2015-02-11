var SchoolListPage;

SchoolListPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return (
			<div className="bSchoolMaster">
				<h1>School control panel</h1>

				<div class="bDataList">
					<div class="eDataList_panel"></div>
					<div class="eDataList_list">

					</div>
				</div>
			</div>
		)
	}
});


module.exports = SchoolListPage;
