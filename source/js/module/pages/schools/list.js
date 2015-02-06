var SchoolListPage;

SchoolListPage = React.createClass({
	render: function() {
		var self = this;

		return (
			<div className="bSchoolList">
				<h2>My schools</h2>

				<div className="eSchoolList_one">
					North London Collegiate School - Edgeware

					<div className="eSchoolList_oneInfo">
						Houses: 25<br/>
						Students: 17
					</div>
				</div>

				<div className="eSchoolList_one mAddNew">
					+
				</div>
			</div>
		)
	}
});


module.exports = SchoolListPage;
