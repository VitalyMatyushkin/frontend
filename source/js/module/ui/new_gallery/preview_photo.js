const	React	= require('react'),

		SVG		= require('module/ui/svg');

const PreviewPhoto = React.createClass({
	propTypes: {
		id:						React.PropTypes.string.isRequired,
		url:					React.PropTypes.string.isRequired,
		isPublic:				React.PropTypes.bool.isRequired,
		handleClickPhoto:		React.PropTypes.func,
		handleClickDeletePhoto:	React.PropTypes.func
	},

	handleClickPhoto: function() {
		typeof this.props.handleClickPhoto !== "undefined" && this.props.handleClickPhoto(this.props.id);
	},
	handleClickDeletePhoto: function(e) {
		typeof this.props.handleClickDeletePhoto !== "undefined" &&  this.props.handleClickDeletePhoto(this.props.id);
		e.stopPropagation();
	},

	renderActions: function() {
		if(!this.props.isPublic) {
			return (
				<div className='ePreviewPhoto_actions'>
					<span	onClick				= { this.handleClickDeletePhoto }
							className			= "bTooltip"
							data-description	= "Delete Photo"
					>
						<SVG icon = "icon_delete"/>
					</span>
				</div>
			);
		} else {
			return null;
		}
	},
	render: function() {
		const background  = {
			backgroundImage: `url(${this.props.url})`
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
