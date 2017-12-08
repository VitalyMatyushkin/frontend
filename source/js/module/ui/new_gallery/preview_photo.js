const	React					= require('react'),
	
		{SVG}					= require('module/ui/svg'),
		GalleryAccessPresets	= require('./../../helpers/consts/gallery');

const PreviewPhoto = React.createClass({
	propTypes: {
		id:						React.PropTypes.string.isRequired,
		url:					React.PropTypes.string.isRequired,
		accessMode:				React.PropTypes.string.isRequired,
		handleClickPhoto:		React.PropTypes.func,
		handleClickDeletePhoto:	React.PropTypes.func,
		PhotoWidth: 			React.PropTypes.number.isRequired
	},

	handleClickPhoto: function() {
		typeof this.props.handleClickPhoto !== "undefined" && this.props.handleClickPhoto(this.props.id);
	},
	handleClickDeletePhoto: function(e) {
		typeof this.props.handleClickDeletePhoto !== "undefined" &&  this.props.handleClickDeletePhoto(this.props.id);

		e.stopPropagation();
	},
	handleClickToTooltip: function(e) {
		// just do stop propagation
		// because onClick to tooltip doesn't anything
		e.stopPropagation();
	},
	renderActions: function() {
		switch (this.props.accessMode) {
			case GalleryAccessPresets.GALLERY_ACCESS_PRESET.PUBLIC:
				return null;
			case GalleryAccessPresets.GALLERY_ACCESS_PRESET.STUDENT:
				return null;
			default:
				return (
					<div className='ePreviewPhoto_actions'>
						<span	className			= "bTooltip"
								data-description	= "Delete Photo"
								onClick				= { this.handleClickToTooltip }
						>
							<SVG	onClick	= { this.handleClickDeletePhoto }
									icon	= "icon_delete"
							/>
						</span>
					</div>
				);
		}
	},
	render: function() {
		const background  = {
			backgroundImage: `url(${window.Server.images.getResizedToMinValueUrl(this.props.url, this.props.PhotoWidth)})`
		};

		return (
			<div	className	= 'bPreviewPhoto'
					onClick		= { this.handleClickPhoto }
					style		= { background }
			>
				{ this.renderActions() }
			</div>
		);
	}
});

module.exports = PreviewPhoto;
