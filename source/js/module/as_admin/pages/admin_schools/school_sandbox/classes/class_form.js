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
		
		window.Server.ageGroups.get( {schoolId} ).then(
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
					name 		= { this.props.title }
					onSubmit 	= { this.props.onFormSubmit }
					binding 	= { binding }
				>
					<FormField
						type 		= "text"
						field 		= "name"
						validation 	= "required"
					>
						Form name
					</FormField>
					<FormField
						type 			= "select"
						sourceArray 	= { ages }
						field 			= "age"
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
