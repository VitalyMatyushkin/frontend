import * as React from 'react';
import {AlbumEditForm} from './album_edit_form';
import * as Morearty from 'morearty';

export const AlbumCreateComponent = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		this.getDefaultBinding().clear();
	},
	
	onFormSubmit: function(data): void {
		console.log(data);
		this.props.service.albums.post({
			name: data.name,
			description: data.name,
			ownerId: data.ownerId
		}).then(() => {
			window.history.back();
		});
	},
	
	render: function() {
		const binding = this.getDefaultBinding();
		
		return (
			<AlbumEditForm
				title		= 'Create album'
				onFormSubmit= {this.onFormSubmit.bind(this)}
				binding		= {binding}
			/>
		);
	}
});
