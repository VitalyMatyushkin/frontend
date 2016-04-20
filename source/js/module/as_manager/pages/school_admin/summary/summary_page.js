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
				globalBinding	= self.getMoreartyContext().getBinding();

		self.activeSchoolId = globalBinding.get('userRules.activeSchoolId');

        if(self.activeSchoolId)
            self.loadSchool();
        else
            self.addBindingListener(globalBinding, 'userRules.activeSchoolId', self.loadSchool);

		//ActiveUserHelper.howManySchools(self).then(function(count){
		//	binding.set('countOfSchools',Immutable.fromJS(count));
		//	return count;
		//});
	},
    loadSchool:function(){
        const	self	= this,
                binding	= self.getDefaultBinding();

        window.Server.school.get(self.activeSchoolId, {filter: {include: 'postcode'}})
            .then(function(schoolData) {
				console.log(schoolData);
                binding.set('schoolData',Immutable.fromJS(schoolData));
                return schoolData;
            });
    },
	render: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				schoolPicture	= binding.get('schoolData.pic') ? binding.get('schoolData.pic'):'images/no-image.jpg',
				siteLink		= binding.get('schoolData.domain') ? `${binding.get('schoolData.domain')}.stage2.squadintouch.com`:'',
				geoPoint		= binding.get('schoolData.postcode') ? binding.toJS('schoolData').postcode.point : undefined;
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
						{/*Lets not render a link when there is no domain for school*/}
						<If condition={siteLink!==''}>
							<p>
								Site:
								<a	href={'//' + siteLink}
									  target="blank" title="binding.get('name') homepage"
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