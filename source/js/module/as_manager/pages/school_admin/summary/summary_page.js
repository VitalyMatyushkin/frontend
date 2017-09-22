const 	React				= require('react'),
		Immutable			= require('immutable'),
		Morearty			= require('morearty'),
		SessionHelper		= require('module/helpers/session_helper'),
		DomainHelper 		= require('module/helpers/domain_helper'),
		SummaryPanel		= require('./summary_panel');

const SchoolSummary = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState:function(){
		return Immutable.fromJS({
			countOfSchools:			0,
			schoolData:				{},
			isSchoolDataLoading: 	true
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

		binding.set('isSchoolDataLoading', true);	// setting flag, that we are loading data...

		window.Server.school.get(activeSchoolId, {filter: {include: 'postcode'}}).then(schoolData => {
			binding.set('schoolData', 			Immutable.fromJS(schoolData));
			binding.set('isSchoolDataLoading', 	false);		// setting flag that data load
		});
    },
	render: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				schoolPicture	= binding.get('schoolData.pic') ? binding.get('schoolData.pic'):'images/no-image.jpg',
				siteLink		= binding.get('schoolData.domain') ? DomainHelper.getSubDomain(binding.get('schoolData.domain')) :'',
				geoPoint		= binding.get('schoolData.postcode') ? binding.toJS('schoolData').postcode.point : undefined,
				rootBinding 	= self.getMoreartyContext().getBinding(),
				activeSchoolId	= rootBinding.get('userRules.activeSchoolId'),
				role 			= SessionHelper.getRoleFromSession(rootBinding.sub('userData')),
				schoolName		= binding.get('schoolData').get('name'),
				postcode		= binding.get('schoolData.postcode.postcode'),
				address			= binding.get('schoolData').get('address'),
				description		= binding.get('schoolData').get('description');

		if(binding.get('isSchoolDataLoading') === true) {
			return null;	// nothing to show if data still loading
		}

		return <SummaryPanel
			showEditButton	= {role === 'ADMIN'}
			activeSchoolId	= {activeSchoolId}
			schoolName		= {schoolName}
			schoolPic		= {schoolPicture}
			postcode		= {postcode}
			address			= {address}
			description		= {description}
			siteLink		= {siteLink}
			geoPoint		= {geoPoint}
			binding			= {binding}
		/>;

	}
});

module.exports = SchoolSummary;