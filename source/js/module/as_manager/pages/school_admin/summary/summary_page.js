const	SVG					= require('module/ui/svg'),
		Map					= require('module/ui/map/map'),
		React				= require('react'),
		If					= require('module/ui/if/if'),
		ActiveUserHelper	= require('module/helpers/activeUser_helper'),
		Immutable			= require('immutable');

const SchoolSummary = React.createClass({
	mixins: [Morearty.Mixin],
	activeSchoolId: undefined,
	getDefaultState:function(){
		return Immutable.fromJS({
			countOfSchools:0,
			schoolData:{}
		});
	},
	componentWillMount: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				globalBinding	= self.getMoreartyContext().getBinding();

		self.activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		window.Server.school.get(self.activeSchoolId, {filter: {include: 'postcode'}})
        .then(function(schoolData) {
			binding.set(
				'schoolData',Immutable.fromJS(schoolData)
			);
			return schoolData;
		});

		//ActiveUserHelper.howManySchools(self).then(function(count){
		//	binding.set('countOfSchools',Immutable.fromJS(count));
		//	return count;
		//});
	},
	render: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				schoolPicture	= binding.get('schoolData').get('pic') !== undefined ? binding.get('schoolData').get('pic'):'images/no-image.jpg',
				siteLink		= binding.get('schoolData').get('domain')!== undefined?`${binding.get('schoolData').get('domain')}.stage.squadintouch.com`:'',
				geoPoint		= binding.get('schoolData').get('postcode') !== undefined ?binding.toJS('schoolData').postcode.point : undefined;
		return (
			<div>
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
								{binding.get('schoolData').get('name')}
							</h1>
							<div className="eSchoolAddress">
							  {binding.get('schoolData').get('postcodeId')}
							  {binding.get('schoolData').get('address')}
							</div>
						</div>
						<div className="eDescription">
							<p>{binding.get('schoolData').get('description')}</p>
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
						  <Map binding={binding} point={geoPoint}/>
						</If>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = SchoolSummary;