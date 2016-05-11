const 	Form 		= require('module/ui/form/form'),
		FormColumn 	= require('module/ui/form/form_column'),
		FormField 	= require('module/ui/form/form_field'),
		React 		= require('react'),
		Immutable 	= require('immutable');

const PhotoEdit = React.createClass({
	mixins: [Morearty.Mixin],

	componentWillMount: function() {
		var self        = this,
            binding     = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            photoId     = rootBinding.get('routing.pathParameters.2'),
            albumId 	= rootBinding.get('routing.pathParameters.0'),
            schoolId    = rootBinding.get('userRules.activeSchoolId'),
            params      = {
                schoolId:schoolId,
                albumId:albumId,
                photoId:photoId
            };


        binding.clear();

		window.Server.schoolAlbumPhoto.get(params).then(function(data) {
			if (self.isMounted()) {
				binding.set(Immutable.fromJS(data));
			}
		});

		self.params = params;
	},

	onFormSubmit: function(data) {
		var self = this;

		window.Server.schoolAlbumPhoto.put(self.params, data).then(function() {
			if (self.isMounted()) {
				window.history.back();
			}
		});
	},

	render: function() {
		var self = this,
		binding = self.getDefaultBinding();

		return (
				<Form name="Edit photo" onSubmit={self.onFormSubmit} binding={binding} >
					<FormColumn type="column">
						<FormField type="textarea" class="mDefault" field="description" >Description: </FormField>
					</FormColumn>
				</Form>
		);
	}
});

module.exports = PhotoEdit;
