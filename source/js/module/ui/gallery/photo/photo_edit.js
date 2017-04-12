const 	Form 			= require('module/ui/form/form'),
		FormColumn 		= require('module/ui/form/form_column'),
		FormField 		= require('module/ui/form/form_field'),
		React 			= require('react'),
		Immutable 		= require('immutable'),
		Morearty 		= require('morearty'),
		PhotoEditCrop 	= require('./photo_edit_crop');

const PhotoEdit = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		service:React.PropTypes.object
	},

	componentWillMount: function() {
		const 	binding		= this.getDefaultBinding(),
				rootBinding = this.getMoreartyContext().getBinding(),
				params 		= rootBinding.toJS('routing.pathParameters'),
				albumId 	= params && params.length ? params[params.length-3] : null,
				photoId 	= params && params.length ? params[params.length-1] : null;
		
		this.albumId = albumId;
		this.photoId = photoId;
		this.service = this.props.service;
		binding.clear();
		
		this.service.photo.get(this.albumId, this.photoId).then( data => {
			binding.set(Immutable.fromJS(data));
		});
	},
	
	onFormSubmit: function(data) {
		this.service.photo.put(this.albumId, this.photoId, data).then( () => {
			//TODO: one need to use router here, but currently our router is kind of shit and unable to perform that kind of ops
			window.history.back();
		});
	},

	render: function() {
		const 	binding = this.getDefaultBinding(),
				picUrl = typeof binding.toJS('picUrl') !== 'undefined' ? binding.toJS('picUrl') : '';

		return picUrl !== '' ? <PhotoEditCrop src={picUrl} albumId={this.albumId} service={this.service}/> : null;
	}
});

module.exports = PhotoEdit;
