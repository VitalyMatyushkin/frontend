const	React		= require('react'),
		Morearty	= require('morearty'),

		Gallery		= require('./../../../ui/new_gallery/galley');

const PublicEventGallery = React.createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		const photos = this.getDefaultBinding().toJS('photos');

		return(
			<div className="bPublicGallery">
				<Gallery	photos		= { photos }
							isPublic	= { true }
				/>
			</div>
		);
	}
});

module.exports = PublicEventGallery;

