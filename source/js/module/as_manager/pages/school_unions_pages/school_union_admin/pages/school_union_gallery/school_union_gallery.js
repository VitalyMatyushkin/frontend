const 	React			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		SessionHelper	= require('module/helpers/session_helper'),
		{Album}			= require('module/ui/gallery/album/album_item');

const SchoolUnionGallery = React.createClass({
	mixins:[Morearty.Mixin],
	getDefaultState:function(){
		return Immutable.Map({
			defaultAlbum: null
		});
	},
	componentWillMount:function(){
		const 	rootBinding 	= this.getMoreartyContext().getBinding(),
				activeSchoolId 	= rootBinding.get('userRules.activeSchoolId'),
				role 			= SessionHelper.getRoleFromSession(rootBinding.sub('userData'));
		//I'm not sure, but in SchoolUnion maybe only role admin?
		if(role !== "ADMIN") {
			document.location.hash = 'school_union_admin/summary';
		} else {
			this.getDefaultSchoolAlbum(activeSchoolId);
		}
	},
	getDefaultSchoolAlbum:function(schoolId){
		const binding = this.getDefaultBinding();

		window.Server.school.get(schoolId).then(school => {
			if(school.defaultAlbumId)
				return window.Server.schoolAlbum.get({schoolId:schoolId, albumId:school.defaultAlbumId});
			else{
				console.error('school.defaultAlbumId is undefined')
				return null;
			}
		}).then(album => {
			binding.set('defaultAlbum', album);
		});
	},
	render:function(){
		const binding = this.getDefaultBinding();

		return (
			<div className="bSchoolGallery">
				<div className="eSchoolMaster_wrap">
					<h1 className="eSchoolMaster_title">Gallery</h1>
					<div className="eStrip"></div>
				</div>
				<div className="albums_wrap">
					<Album binding={binding.sub('defaultAlbum')} basePath="school-union-albums" />
				</div>
			</div>
		)
	}
});
module.exports = SchoolUnionGallery;