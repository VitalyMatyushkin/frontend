const	SVG					= require('module/ui/svg'),
		Map					= require('module/ui/map/map'),
		React				= require('react'),
		If					= require('module/ui/if/if'),
		Immutable			= require('immutable');

const SchoolSummary = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState:function(){
		return Immutable.fromJS({
			countOfSchools:0,
			schoolData:{}
		});
	},
	componentWillMount: function() {
		const	self			= this,
				rootBinding	= self.getMoreartyContext().getBinding();

		const 	activePermission 	= rootBinding.get('userData.roleList.activePermission');

        if(activePermission)
            self.loadSchool();
        else {
			self.addBindingListener(rootBinding, 'userData.roleList.activePermission', self.loadSchool);
		}
	},
    loadSchool:function(){
        const	self	= this,
                binding	= self.getDefaultBinding(),
				rootBinding	= self.getMoreartyContext().getBinding(),
				activeSchoolId = rootBinding.get('userRules.activeSchoolId');

		window.Server.school.get(activeSchoolId, {filter: {include: 'postcode'}})
			.then(function(schoolData) {
				binding.set('schoolData',Immutable.fromJS(schoolData));
				return schoolData;
			});
    },
	render: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				schoolPicture	= binding.get('schoolData.pic') ? binding.get('schoolData.pic'):'images/no-image.jpg',
				siteLink		= binding.get('schoolData.domain') ? `${binding.get('schoolData.domain')}.stage2.squadintouch.com`:'',
				geoPoint		= binding.get('schoolData.postcode') ? binding.toJS('schoolData').postcode.point : undefined,
				rootBinding 	= self.getMoreartyContext().getBinding(),
				activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
				role 			= rootBinding.get('userData.authorizationInfo.role');

		return (
			<div>
				<div className="eSchoolMaster_summary">
					<div className="summary_inside">
						<If condition={role === "ADMIN"}>
							<div className="editSchool">
								<a href={'/#schools/edit?id=' + activeSchoolId}>
									<div className="bEditButton">
										<SVG icon="icon_edit"/>
									</div>
								</a>
							</div>
						</If>
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
						{/*Lets not render a link when there is no domain for school*/}
						<If condition={siteLink!==''}>
							<p>
								Site:
								<a	href={'//' + siteLink}
									  target="blank" title={siteLink}
									  className="bSchoolLink">
									<SVG icon="icon_sch_link" />
								</a>
							</p>
						</If>
						<If condition={siteLink===''}>
							<p>
								Site:
								School has no active domain
							</p>
						</If>
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