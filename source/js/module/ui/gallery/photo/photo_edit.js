const 	Form 		= require('module/ui/form/form'),
		FormColumn 	= require('module/ui/form/form_column'),
		FormField 	= require('module/ui/form/form_field'),
		React 		= require('react'),
		Immutable 	= require('immutable'),
		Morearty    = require('morearty');

const PhotoEdit = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		service:React.PropTypes.object
	},

	componentWillMount: function() {
		const 	self 		= this,
				binding		= self.getDefaultBinding(),
				rootBinding = self.getMoreartyContext().getBinding(),
				params      = rootBinding.toJS('routing.pathParameters'),
				albumId 	= params && params.length ? params[params.length-3] : null,
				photoId 	= params && params.length ? params[params.length-1] : null;

		self.albumId = albumId;
		self.photoId = photoId;
		self.service = self.props.service;
        binding.clear();

		self.service.photo.get(self.albumId, self.photoId).then(function(data) {
			binding.set(Immutable.fromJS(data));
		});
	},

	onFormSubmit: function(data) {
		var self = this;

		self.service.photo.put(self.albumId, self.photoId, data).then(function() {
			window.history.back();
		});
	},

	render: function() {
		var self = this,
		binding = self.getDefaultBinding();

		return (
				<Form formStyleClass="mNarrow" name="Edit photo" onSubmit={self.onFormSubmit} binding={binding} >
					<FormColumn>
						<FormField type="textarea" class="mDefault" field="description" >Description: </FormField>
					</FormColumn>
				</Form>
		);
	}
});

module.exports = PhotoEdit;
