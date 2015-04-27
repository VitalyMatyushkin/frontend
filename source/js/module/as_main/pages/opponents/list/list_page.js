var OpponentsListPage;

OpponentsListPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div classNameName="bOpponentsList">

				<div className="bSchoolMaster">
					<div className="bFiltersPage mNoFilters">
						<h1 className="eSchoolMaster_title"><span>Opponents list</span>

							<div className="eSchoolMaster_buttons">
								<div className="bButton"><span>Filters </span><span>⇣</span></div>
							</div>
						</h1>
						<div className="bDataList">
							<div className="eDataList_list mTable">
								<div className="eDataList_listItem mHead">
									<div className="eDataList_listItemCell" style={{width: '35%'}}><span>School name</span>
									</div>
									<div className="eDataList_listItemCell"style={{width: '27%'}}><span>Adress</span></div>
									<div className="eDataList_listItemCell"style={{width: '18%'}}><span>Phone</span></div>
									<div className="eDataList_listItemCell mActions">Actions</div>
								</div>
								<div className="eDataList_listItem">
									<div className="eDataList_listItemCell">London School of Hygiene &amp; Tropical Medicine</div>
									<div className="eDataList_listItemCell">The Ridgeway, Mill Hill Village</div>
									<div className="eDataList_listItemCell">845 320 654 98</div>
									<div className="eDataList_listItemCell mActions"><span className="bLinkLike">Open fixtures</span></div>
								</div>
								<div className="eDataList_listItem">
									<div className="eDataList_listItemCell">Barnet College</div>
									<div className="eDataList_listItemCell">Keppel Street, London WC1E 7HT</div>
									<div className="eDataList_listItemCell">845 700 654 53</div>
									<div className="eDataList_listItemCell mActions"><span className="bLinkLike">Open fixtures</span></div>
								</div>
								<div className="eDataList_listItem">
									<div className="eDataList_listItemCell">Belmont School</div>
									<div className="eDataList_listItemCell">658 Romford Road</div>
									<div className="eDataList_listItemCell">845 257 600 24</div>
									<div className="eDataList_listItemCell mActions"><span className="bLinkLike">Open fixtures</span></div>
								</div>
								<div className="eDataList_listItem">
									<div className="eDataList_listItemCell">London School of Hygiene &amp; Tropical Medicine</div>
									<div className="eDataList_listItemCell">Keppel Street, London WC1E 7HT</div>
									<div className="eDataList_listItemCell">845 421 654 15</div>
									<div className="eDataList_listItemCell mActions"><span className="bLinkLike">Open fixtures</span></div>
								</div>
								<div className="eDataList_listItem">
									<div className="eDataList_listItemCell">American InterContinental University London</div>
									<div className="eDataList_listItemCell">Bownley Rd</div>
									<div className="eDataList_listItemCell">845 245 856 57</div>
									<div className="eDataList_listItemCell mActions"><span className="bLinkLike">Open fixtures</span></div>
								</div>
								<div className="eDataList_listItem">
									<div className="eDataList_listItemCell">Alleyn's School</div>
									<div className="eDataList_listItemCell">Keppel Street, London WC1E 7HT</div>
									<div className="eDataList_listItemCell">845 123 75 22</div>
									<div className="eDataList_listItemCell mActions"><span className="bLinkLike">Open fixtures</span></div>
								</div>
								<div className="eDataList_listItem">
									<div className="eDataList_listItemCell">Barnet College</div>
									<div className="eDataList_listItemCell">110 Marylebone High St</div>
									<div className="eDataList_listItemCell">245 18 87 67</div>
									<div className="eDataList_listItemCell mActions"><span className="bLinkLike">Open fixtures</span></div>
								</div>

							</div>

						</div>
					</div>
				</div>

			</div>
		)
	}
});


module.exports = OpponentsListPage;
