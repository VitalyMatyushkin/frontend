const 	React 			= require('react'),
		Lazy			= require('lazy.js'),
		Form 			= require('module/ui/form/form'),
		Morearty		= require('morearty'),
		SchoolHelper 	= require('module/helpers/school_helper'),
		FormField 		= require('module/ui/form/form_field');


const ClassForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: 			React.PropTypes.string.isRequired,
		onFormSubmit: 	React.PropTypes.func
	},
	
	componentWillMount: function(){
		this.getAllAges();
	},

	getAllAges: function() {
		const 	schoolId 	= SchoolHelper.getActiveSchoolId(this),
				binding 	= this.getDefaultBinding();
		
		window.Server.ageGroups.get({schoolId}).then(
			ages => {
				const agesObject = ages.map( (age,index) => {
					return {
						value: age,
						age: index,
						id: index
					}
				});
				binding.atomically()
				.set('ages', 	agesObject)
				.set('isSync', 	true)
				.commit();
			},
			//if server return 404
			err => {
				console.error(err.message);
			} );
	},

	render: function() {
		const 	binding = this.getDefaultBinding(),
				isSync 	= binding.toJS('isSync'),
				ages 	= binding.toJS('ages');
		
		if (isSync) {
			return (
				<Form
					formStyleClass 	= "mNarrow"
					name 			= { this.props.title }
					onSubmit 		= { this.props.onFormSubmit }
					binding 		= { this.getDefaultBinding() }
					submitButtonId	= 'class_submit'
					cancelButtonId	= 'class_cancel'
				>
					<FormField
						type 		= "text"
						field 		= "name"
						id 			= "class_name"
						validation 	= "required"
					>
						Form name
					</FormField>
					<FormField
						type 			= "select"
						sourceArray 	= { ages }
						field 			= "age"
						id 				= "class_age_combox"
						validation 		= "required"
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
