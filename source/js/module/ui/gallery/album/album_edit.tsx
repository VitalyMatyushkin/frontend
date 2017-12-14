import * as React from 'react';
import * as Immutable from 'immutable';
import * as Morearty from 'morearty';
import {AlbumEditForm} from './album_edit_form';

export const AlbumEditComponent = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getInitialState: function() {
		return {
			albumData: null
		};
	},
	
	componentWillMount: function() {
		const 	rootBinding 	= this.getMoreartyContext().getBinding(),
				binding 		= this.getDefaultBinding(),
				params      	= rootBinding.toJS('routing.pathParameters'),
				albumId 		= params && params.length ? params[params.length-1] : null;
		
		binding.clear();
		this.service = this.props.service;
		this.albumId = albumId;
		
		this.service.album.get(this.albumId).then(data => binding.set(Immutable.fromJS(data)));
		
	},
	
	onFormSubmit: function(data): void {
		console.log(data);
		this.service.album.put(this.albumId, data).then(res => window.history.back());
	},
	
	render: function() {
		const binding = this.getDefaultBinding();
		
		return (
			<AlbumEditForm
				title		= 'Edit album'
				onFormSubmit= {this.onFormSubmit.bind(this)}
				albumId		= {this.albumId}
				binding		= {binding}
			/>
		);
	}
});
