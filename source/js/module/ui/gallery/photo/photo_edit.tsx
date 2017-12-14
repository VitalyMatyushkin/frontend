import * as React from 'react';
import * as Immutable from 'immutable';
import * as Morearty from 'morearty';
import * as Form from 'module/ui/form/form';
import * as FormColumn from 'module/ui/form/form_column';
import * as FormField from 'module/ui/form/form_field';
import * as PhotoEditCrop from './photo_edit_crop';

interface PhotoData {
	description: 	string
	ownerId:		string
}

export const PhotoEditComponent = (React as any).createClass({
	mixins: [Morearty.Mixin],
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
	
	onFormSubmit: function(data): void {
		console.log(data);
		this.service.photo.put(this.albumId, this.photoId, data).then( () => {
			//TODO: one need to use router here, but currently our router is kind of shit and unable to perform that kind of ops
			window.history.back();
		});
	},
	
	render: function() {
		const 	binding = this.getDefaultBinding(),
				picUrl = typeof binding.toJS('picUrl') !== 'undefined' ? binding.toJS('picUrl') : '';
		
		//Disable crop on picture editing http://tracker.squadintouch.com/issues/2603
		{/**return picUrl !== '' ? <PhotoEditCrop src={picUrl} albumId={this.albumId} service={this.service}/> : null;*/}
		
		return (
			<Form formStyleClass="mNarrow" name="Edit photo" onSubmit={this.onFormSubmit.bind(this)} binding={binding} >
				<FormColumn>
					<FormField type="textarea" class="mDefault" field="description" >Description: </FormField>
				</FormColumn>
			</Form>
		);
	}
});
