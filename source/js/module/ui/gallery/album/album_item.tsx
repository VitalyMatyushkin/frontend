
import * as React from 'react';
import * as Morearty from 'morearty';
import {SVG} from 'module/ui/svg';

export const Album = (React as any).createClass({
	mixins: [Morearty.Mixin],

	propTypes: {
		basePath: (React as any).PropTypes.string.isRequired,
		onDelete: (React as any).PropTypes.func.isRequired
	},

    getDefaultProps: function() {
        return {
            basePath: 'notFound'
        };
    },
	
	onClickAlbum: function(e): void {
		const 	binding 	= this.getDefaultBinding(),
                album 		= binding.toJS();

        document.location.hash = this.props.basePath + '/view/' + album.id;
		e.stopPropagation();
	},
	onClickEditAlbum: function(e): void {
		const 	binding 	= this.getDefaultBinding(),
				album 		= binding.toJS();

        document.location.hash = this.props.basePath + '/edit/' + album.id;
		e.stopPropagation();
	},
	onClickDeleteAlbum: function(e): void {
		const 	binding 	= this.getDefaultBinding(),
				album 		= binding.toJS();

		(window as any).confirmAlert(
			"Delete this album?",
			"Ok",
			"Cancel",
			() => this.props.onDelete && this.props.onDelete(album),
			() => {}
		);
		e.stopPropagation();
	},
	render: function() {
		const 	binding = this.getDefaultBinding(),
				a 		= binding.toJS(),
				name 	= a ? a.name : '',
				cover 	= a && a.coverUrl ? (window as any).Server.images.getResizedToBoxUrl(a.coverUrl, 200, 200) : '/images/no-image.jpg',
				styles 	= { backgroundImage: 'url(' + cover + ')'};

		return (
				<div onClick={e => this.onClickAlbum(e)} className='eAlbum' style={styles}>
					<div className="eAlbumActions">
						<span>{/*<SVG icon="icon_photo"/>*/}</span>
						<span>{/*<SVG icon="icon_comments"/>*/}</span>
						<span ></span>
						<span onClick={e => this.onClickEditAlbum(e)} id="editAlbum_button" className="bTooltip" data-description="Edit Album"><SVG
							icon="icon_edit"/></span>
						<span onClick={e => this.onClickDeleteAlbum(e)} id="deleteAlbum_button" className="bTooltip" data-description="Delete Album"><SVG
							classes="ePhotoDelete" icon="icon_delete"/></span>
					</div>
					<div className="eAlbumInfo">
						<span className='eAlbumTitle'>{name}</span>
					</div>
				</div>
		);
	}
});
