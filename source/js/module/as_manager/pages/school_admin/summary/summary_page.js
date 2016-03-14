const	SVG					= require('module/ui/svg'),
		Map					= require('module/ui/map/map'),
		React				= require('react'),
		If					= require('module/ui/if/if'),
		ActiveUserHelper	= require('module/helpers/activeUser_helper'),
		Immutable			= require('immutable');

const SchoolSummary = React.createClass({
	mixins: [Morearty.Mixin],
	activeSchoolId: undefined,
	componentWillMount: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				globalBinding	= self.getMoreartyContext().getBinding();

		self.activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		window.Server.school.get(
			{
				id: self.activeSchoolId,
				filter: {include: 'postcode'}
			}
		).then(function(schoolData) {
			binding.set(
				Immutable.fromJS(schoolData)
			);

			return schoolData;
		});

		ActiveUserHelper.howManySchools(self).then(function(count){
			binding.set('countOfSchools', count);

			return count;
		});
	},
	render: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				schoolPicture	= binding.get('pic'),
				siteLink		= `${binding.get('domain')}.stage.squadintouch.com`,
				geoPoint		= binding.toJS('postcode.point');

		return (
			<div>
				<div className="changeSchool">
					{/*Check if the current user has more than one schools listed against him/her before showing swap icon*/}
					<If condition={binding.get('countOfSchools') > 1 }>
						<a title="Change active school" href="/#schools" className="addButton">
							<SVG icon="icon_change_school" />
						</a>
					</If>
				</div>
				<div className="eSchoolMaster_summary">
					<div className="summary_inside">
						<div className="editSchool">
							<a href={'/#schools/edit?id=' + self.activeSchoolId}>
								<div className="bEditButton">
									<SVG icon="icon_edit"/>
								</div>
							</a>
						</div>
						<div>
							{schoolPicture ? <div className="eSchoolMaster_flag"><img src={schoolPicture}/></div> : ''}
							<h1 className="eSchoolMaster_title">
								{binding.get('name')}
							</h1>
							<div className="eSchoolAddress">
							  {binding.get('postcodeId')}
							  {binding.get('address')}
							</div>
						</div>
						<div className="eDescription">
							<p>{binding.get('description')}</p>
						</div>
						<p>
							Site:
							<a	href={'//' + siteLink}
								target="blank"
								title="binding.get('name') homepage"
									className="bSchoolLink"
							>
									<SVG icon="icon_sch_link" />
								</a>
						</p>
					</div>
					<div>
						<If condition={geoPoint !== undefined}>
						  <Map binding={binding} point={binding.toJS('postcode.point')}/>
						</If>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = SchoolSummary;