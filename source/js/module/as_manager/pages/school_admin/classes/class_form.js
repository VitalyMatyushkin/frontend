const	React			= require('react'),
		Morearty		= require('morearty');

const	Form			= require('module/ui/form/form'),
		FormField		= require('module/ui/form/form_field'),
		SchoolHelper	= require('module/helpers/school_helper');

const ClassForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title:			React.PropTypes.string.isRequired,
		onFormSubmit:	React.PropTypes.func
	},

	componentWillMount: function(){
		this.getAllAges();
	},

	componentWillUnmount: function () {
		this.getDefaultBinding().sub('classForm').clear();
	},

	getAllAges: function() {
		const	schoolId	= SchoolHelper.getActiveSchoolId(this),
				binding		= this.getDefaultBinding();

		window.Server.ageGroups.get({schoolId}).then(
			ages => {
				const agesObject = ages.map( (age, index) => {
					return {
						value: index,
						text: age
					}
				});

				binding.atomically()
					.set('ages',		agesObject)
					.set('isSyncAges',	true)
					.commit();
			},
			//if server return 404
			err => {
				console.error(err.message);
			} );
	},

	render: function() {
		const	binding	= this.getDefaultBinding(),
				isSync	= Boolean(binding.toJS('isSyncAges')),
				ages	= binding.toJS('ages');

		if (isSync) {
			const	selectedAge		= binding.sub('classForm').get('age'),
					defaultValue	= selectedAge ? selectedAge :  ages[0].value;

			return (
				<Form
					binding			= { binding.sub('classForm') }
					name			= { this.props.title }
					formStyleClass 	= "mNarrow"
					submitButtonId	= 'school_form_submit'
					cancelButtonId	= 'school_form_cancel'
					onSubmit		= { this.props.onFormSubmit }
				>
					<FormField
						id			= "school_form_name"
						type		= "text"
						field		= "name"
						validation	= "required"
					>
						Form name
					</FormField>
					<FormField
						id				= "school_age_group_checkbox"
						type			= "dropdown"
						field			= "age"
						options			= { ages }
						defaultValue	= { defaultValue }
					>
						Age group
					</FormField>
				</Form>
			)
		} else {
			return null;
		}
	}
});


module.exports = ClassForm;
