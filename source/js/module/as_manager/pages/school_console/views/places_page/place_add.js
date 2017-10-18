const	React			= require('react'),
		Morearty		= require('morearty'),
		MoreartyHelper	= require('../../../../../helpers/morearty_helper'),
		PlaceHelper		= require('./place_helper'),
		PlaceForm		= require('./place_form');

const PlaceAdd = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);
	},
	componentWillUnmount: function() {
		this.getDefaultBinding().clear();
	},
	onSubmit: function(data) {
		window.Server.schoolPlaces.post(
			this.activeSchoolId,
			{
				name: data.name,
				postcodeId: data.postcode
			}
		).then(() => {
			PlaceHelper.redirectToPlaceListPage();
		});
	},
	render: function() {
		return (
			<div className="container">
				<PlaceForm
					activeSchoolId	= { this.activeSchoolId }
					title			= { 'Add new place' }
					onSubmit		= { this.onSubmit }
					binding			= { this.getDefaultBinding() }
					onCancel 		= { () => {window.history.back()} }
				/>
			</div>
		);
	}
});

module.exports = PlaceAdd;