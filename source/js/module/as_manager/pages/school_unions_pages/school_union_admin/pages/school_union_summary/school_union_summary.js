const	React					= require('react'),
		Immutable				= require('immutable'),
		Morearty				= require('morearty'),
		DomainHelper			= require('../../../../../../helpers/domain_helper'),
		MoreartyHelper			= require('../../../../../../helpers/morearty_helper'),
		SchoolUnionSummaryPanel	= require('./school_union_summary_panel');

const SchoolSummary = React.createClass({
	mixins: [Morearty.Mixin],
	NO_IMAGE_LINK: 'images/no-image.jpg',
	componentWillMount: function() {
		const rootBinding = this.getMoreartyContext().getBinding();

		const activePermission = rootBinding.get('userData.roleList.activePermission');

		if(activePermission)
			this.loadSchoolUnion();
		else {
			this.addBindingListener(rootBinding, 'userData.roleList.activePermission', this.loadSchoolUnion);
		}
	},
	loadSchoolUnion: function(){
		const	binding			= this.getDefaultBinding(),
				activeSchoolId	= MoreartyHelper.getActiveSchoolId(this);

		binding.set('isSchoolDataLoading', true);	// setting flag, that we are loading data...

		window.Server.school.get(
			activeSchoolId,
			{
				filter: {include: 'postcode'}
			}
		).then(schoolData => {
			binding.atomically()
				.set('schoolData',			Immutable.fromJS(schoolData))
				.set('isSchoolDataLoading',	false)
				.commit();
		});
	},
	getSchoolUnionPicture: function() {
		const schoolUnionPicture = this.getDefaultBinding().toJS('schoolData.pic')

		return typeof schoolUnionPicture !== "undefined" ? schoolUnionPicture : this.NO_IMAGE_LINK;
	},
	getPublicSchoolUnionSiteLink: function() {
		const schoolUnionDomain = this.getDefaultBinding().toJS('schoolData.domain');

		return typeof schoolUnionDomain !== "undefined" ? DomainHelper.getSubDomain(schoolUnionDomain) : '';
	},
	render: function() {
		const binding = this.getDefaultBinding();

		if(binding.get('isSchoolDataLoading') === true) {
			return null;	// nothing to show if data still loading
		} else {
			return (
				<SchoolUnionSummaryPanel	isShowEditButton			= {true}
											schoolUnionPicture			= {this.getSchoolUnionPicture()}
											publicSchoolUnionSiteLink	= {this.getPublicSchoolUnionSiteLink()}
											activeSchoolUnionId			= {MoreartyHelper.getActiveSchoolId(this)}
											schoolName					= {binding.toJS('schoolData.name')}
											postcode					= {binding.toJS('schoolData.postcode.postcode')}
											address						= {binding.toJS('schoolData.address')}
											description					= {binding.toJS('schoolData.description')}
				/>
			);
		}
	}
});

module.exports = SchoolSummary;