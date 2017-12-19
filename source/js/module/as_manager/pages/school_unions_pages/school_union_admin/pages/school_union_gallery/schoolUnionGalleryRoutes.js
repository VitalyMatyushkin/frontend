/**
 * Created by Anatoly on 14.05.2016.
 */

const 	{AlbumRoutes} 		= require('module/ui/gallery/albums'),
		galleryServices 	= require('module/as_manager/pages/school_admin/gallery/schoolGalleryServices'),
		Morearty 			= require('morearty'),
		React 				= require('react');
/**
 * This component is required to initialize the base. We create here a necessary set of parameters for a school gallery.
 * */
const schoolUnionGalleryRoutes = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const 	binding 		= this.getDefaultBinding(),
				rootBinding 	= this.getMoreartyContext().getBinding(),
				activeSchoolId 	= rootBinding.get('userRules.activeSchoolId');

		this.service = galleryServices(binding, activeSchoolId);
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<AlbumRoutes
				basePath	= "school-union-albums"
				service		= { this.service }
				binding		= { binding }
			/>
		);
	}
});

module.exports = schoolUnionGalleryRoutes;
