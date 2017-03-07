const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		MoreartyHelper	= require('../../../../../helpers/morearty_helper'),
		PlaceForm		= require('./place_form');

const PlaceEdit = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const	binding			= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding(),
				routingData		= globalBinding.sub('routing.parameters').toJS();

		this.placeId = routingData.id;
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		if (typeof this.placeId !== 'undefined') {
			let placeData;

			window.Server.schoolPlace.get({
				schoolId: this.activeSchoolId,
				placeId: this.placeId
			}).then(_placeData => {
				placeData = _placeData;

				return window.Server.postCodeById.get(placeData.postcodeId);
			}).then(postcodeData => {
				binding.atomically()
					.set('placeForm.form', Immutable.fromJS({
						name: placeData.name,
						postcode: placeData.postcodeId
					}))
					.set('placeForm.selectedPostcode', Immutable.fromJS(postcodeData))
					.commit();
			});
		}
	},
	redirectToPlaceListPage: function() {
		document.location.hash = 'school_console/places';
	},
	onSubmit: function(data) {
		window.Server.schoolPlace.put(
			{
				schoolId: this.activeSchoolId,
				placeId: this.placeId
			}, {
				name: data.name,
				postcodeId: data.postcode
			}
		).then(() => {
			this.isMounted() && (this.redirectToPlaceListPage());
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

module.exports = PlaceEdit;