const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable'),
		Form		= require('../../../../../ui/form/form'),
		FormField	= require('../../../../../ui/form/form_field'),
		FormColumn	= require('../../../../../ui/form/form_column'),
		Map			= require('../../../../../ui/map/map2');

const PlaceForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		title:			React.PropTypes.string.isRequired,
		onSubmit:		React.PropTypes.func.isRequired
	},
	DEFAULT_VENUE_POINT: { "lat": 50.832949, "lng": -0.246722 },
	getPoint: function() {
		const binding = this.getDefaultBinding();

		const postcode = binding.toJS('selectedPostcode');

		return typeof postcode !== 'undefined' ? postcode.point : this.DEFAULT_VENUE_POINT;
	},
	postcodeService: function(searchText) {
		return window.Server.postCodes.get(
			{
				filter: {
					where: {
						postcode: {
							like	: searchText,
							options	: 'i'
						}
					},
					limit: 10
				}
			});
	},
	onSelectPostcode: function(id, postcode) {
		this.getDefaultBinding().set('selectedPostcode', Immutable.fromJS(postcode))
	},
	render: function() {
		return (
			<Form
				name		= { this.props.title }
				onSubmit	= { this.props.onSubmit }
				binding		= { this.getDefaultBinding().sub('form') }
			>
				<FormField
					type		= 'text'
					field		= 'name'
					validation	= 'required'
				>
					Place name
				</FormField>
				<FormField
					type			= 'autocomplete'
					serviceFullData	= { this.postcodeService }
					serverField		= { 'postcode' }
					field			= 'postcode'
					onSelect		= { this.onSelectPostcode }
					validation		= 'required'
				>
					Postcode
				</FormField>
				<Map
					point				= {this.getPoint()}
					customStylingClass	= "eEvents_venue_map"
				/>
			</Form>
		);
	}
});

module.exports = PlaceForm;