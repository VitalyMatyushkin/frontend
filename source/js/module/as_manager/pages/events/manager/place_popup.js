const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		{ConfirmPopup}	= require('module/ui/confirm_popup'),
		PlaceForm		= require('../../school_console/views/places_page/place_form');

const PlacePopup = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		onSubmit:		React.PropTypes.func.isRequired,
		onCancel:		React.PropTypes.func.isRequired
	},
	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		const postcodeData = binding.toJS('model.venue.postcodeData');

		const placeForm = {
			form: {
				name: undefined,
				postcode: postcodeData.id
			},
			selectedPostcode: postcodeData
		};

		binding.set('placeForm', Immutable.fromJS(placeForm));
	},
	onSubmit: function(data) {
		window.Server.schoolPlaces.post(
			this.props.activeSchoolId,
			{
				name: data.name,
				postcodeId: data.postcode
			}
		).then((data) => {
			this.props.onSubmit(data);
		});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
				<ConfirmPopup isShowButtons = { false }>
					<PlaceForm	binding		= { binding.sub('placeForm') }
								onSubmit	= { this.onSubmit }
								onCancel	= { this.props.onCancel }
					/>
				</ConfirmPopup>
		);
	}
});

module.exports = PlacePopup;