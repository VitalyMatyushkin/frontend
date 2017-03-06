const	React			= require('react'),
		Morearty		= require('morearty'),
		MoreartyHelper	= require('../../../../../helpers/morearty_helper'),
		PlaceForm		= require('./place_form');

const PlaceAdd = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);
	},
	redirectToPlaceListPage: function() {
		document.location.hash = 'school_console/places';
	},
	onSubmit: function(data) {
		window.Server.schoolPlaces.post(
			this.activeSchoolId,
			{
				name: data.name,
				postcodeId: data.postcode
			}
		).then(() => {
			this.redirectToPlaceListPage();
		});
	},
	render: function() {
		return (
			<div className="container">
				<PlaceForm
					activeSchoolId	= { this.activeSchoolId }
					title			= { 'Add new place' }
					onSubmit		= { this.onSubmit }
					binding			= { this.getDefaultBinding().sub('placeForm') }
				/>
			</div>
		);
	}
});

module.exports = PlaceAdd;