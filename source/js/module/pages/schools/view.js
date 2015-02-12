var SchoolListPage;

SchoolListPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return (
			<div className="bSchoolMaster">
				<h1>School control panel</h1>

				<div className="bDataList">
					<div className="eDataList_panel">
						<div className="eDataList_title">Classes <div className="bLinkLike">Add new...</div></div>

					</div>
					<div className="eDataList_list mBlockView">
						<div className="eDataList_listItem">5B</div>
						<div className="eDataList_listItem">5C</div>
					</div>
				</div>



				<div className="bDataList">
					<div className="eDataList_panel">
						<div className="eDataList_title">Homes <div className="bLinkLike">Add new...</div></div>

					</div>
					<div className="eDataList_list mBlockView">
						<div className="eDataList_listItem">The big tigers</div>
						<div className="eDataList_listItem">Griffindor</div>
						<div className="eDataList_listItem">Slizerin</div>
					</div>
				</div>




				<div className="bDataList">
					<div className="eDataList_panel">
						<div className="eDataList_title">Pupils <div className="bLinkLike">Add new...</div></div>

					</div>
					<div className="eDataList_list mTable">
						<div className="eDataList_listItem mHead">
							<div className="eDataList_listItemCell">Name</div>
							<div className="eDataList_listItemCell">Class</div>
							<div className="eDataList_listItemCell mActions">Actions</div>
						</div>
						<div className="eDataList_listItem">
							<div className="eDataList_listItemCell">Morozov Stas</div>
							<div className="eDataList_listItemCell">5C</div>
							<div className="eDataList_listItemCell mActions"> <span className="bLinkLike">Edit</span>  <span className="bLinkLike">View</span>  <span className="bLinkLike">Remove</span></div>
						</div>
						<div className="eDataList_listItem">
							<div className="eDataList_listItemCell">Podgorniy Mikhail</div>
							<div className="eDataList_listItemCell">5V</div>
							<div className="eDataList_listItemCell mActions"> <span className="bLinkLike">Edit</span>  <span className="bLinkLike">View</span>  <span className="bLinkLike">Remove</span></div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});


module.exports = SchoolListPage;
