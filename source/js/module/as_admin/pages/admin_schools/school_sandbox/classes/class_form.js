const 	React 			= require('react'),
		Lazy 			= require('lazy.js'),
		Morearty 		= require('morearty'),
		Form 			= require('module/ui/form/form'),
		SchoolHelper 	= require('module/helpers/school_helper'),
		FormField 		= require('module/ui/form/form_field');

const ClassForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: 			React.PropTypes.string.isRequired,
		schoolId: 		React.PropTypes.string.isRequired,
		onFormSubmit: 	React.PropTypes.func
	},
	componentWillMount: function(){
		this.getAllAges();
	},
	
	getAllAges: function() {
		const 	schoolId 	= this.props.schoolId,
				binding 	= this.getDefaultBinding();
		
		window.Server.ageGroups.get({schoolId}).then(
			ages => {
				const agesObject = ages.map( (age, index) => {
					return {
						value: index,
						text: age
					}
				});
				binding.atomically()
					.set('ages', 			agesObject)
					.set('isSyncAges', 		true)
					.commit();
			},
			//if server return 404
			err => {
				console.error(err.message);
			} );
	},
	render: function() {
		const 	binding = this.getDefaultBinding(),
				isSync 	= Boolean(binding.toJS('isSyncAges')),
				ages 	= binding.toJS('ages');
		
		if (isSync) {
			const 	selectedAge		= binding.sub('formData').get('age'),
					defaultValue	= selectedAge ? selectedAge :  ages[0].value;
			return (
				<Form
					formStyleClass 	= "mNarrow"
					name 			= { this.props.title }
					onSubmit 		= { this.props.onFormSubmit }
					binding 		= { binding.sub('formData') }
					submitButtonId	= 'school_form_submit'
					cancelButtonId	= 'school_form_cancel'
				>
					<FormField
						type 		= "text"
						field 		= "name"
						id 			= "school_form_name"
						validation 	= "required"
					>
						Form name
					</FormField>
					<FormField
						type 		= "dropdown"
						id 			= "school_age_group_checkbox"
						field 		= "age"
						options 	= { ages }
						defaultValue= { defaultValue }
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
