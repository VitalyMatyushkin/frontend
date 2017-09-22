const	React		= require('react'),
		Immutable	= require('immutable'),
		Morearty	= require('morearty');

const	Form		= require('module/ui/form/form'),
		FormField	= require('module/ui/form/form_field');

const	MultiselectWithAutocomplete = require('module/ui/multiselect_with_autocomplete/multiselect_with_autocomplete');

const	EventFormActions = require('module/as_manager/pages/events/manager/event_form/event_form_actions');

const ClubsForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title:			React.PropTypes.string.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired,
		onFormSubmit:	React.PropTypes.func.isRequired
	},
	componentWillMount: function () {
		this.getDefaultBinding().set('sports', Immutable.fromJS([]));
	},
	handleSelectSport: function (sportId, sport) {
		const sports = this.getDefaultBinding().toJS('sports');

		sports.push(sport);

		this.getDefaultBinding().set('sports', Immutable.fromJS(sports));
	},
	removeSport: function (sportId) {
		const sports = this.getDefaultBinding().toJS('sports');

		sports.splice(
			sports.findIndex(sport => sport.id === sportId),
			1
		);

		this.getDefaultBinding().set('sports', Immutable.fromJS(sports));
	},
	getSelectedSports: function () {
		return this.getDefaultBinding().toJS('sports');
	},
	render: function() {
		const self = this;

		const service = EventFormActions.getSportService(
			this.props.activeSchoolId,
			false
		);

		return (
			<div className ="eHouseForm">
				<Form
					formStyleClass	= "mNarrow"
					name			= {self.props.title}
					onSubmit		= {self.props.onFormSubmit}
					binding			= {self.getDefaultBinding().sub('form')}
					submitButtonId	= 'club_submit'
					cancelButtonId	= 'club_cancel'
				>
					<FormField
						id			= "house_name"
						type		= "text"
						field		= "name"
						validation	= "required"
					>
						Club name
					</FormField>
					<FormField
						id		= "house_description"
						type	= "text"
						field	= "description"
					>
						Description
					</FormField>
					<MultiselectWithAutocomplete
						serverField				= { 'name' }
						serviceFilter			= { service }
						handleSelectItem		= { this.handleSelectSport }
						placeholder				= 'Select sport'
						selectedItems			= { this.getSelectedSports() }
						handleClickRemoveItem	= { this.removeSport }
					/>
				</Form>
			</div>
		);
	}
});

module.exports = ClubsForm;
