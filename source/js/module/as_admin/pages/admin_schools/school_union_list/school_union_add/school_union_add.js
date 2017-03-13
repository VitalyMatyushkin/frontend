const	React			= require('react'),
		Morearty		= require('morearty'),
		SchoolUnionForm	= require('../school_union_form/school_union_form'),
		SchoolHelper	= require('module/helpers/school_helper');

const SchoolUnionCreate = React.createClass({
	mixins: [Morearty.Mixin],
	submitAdd: function(schoolUnionData) {
		schoolUnionData.kind = "SchoolUnion";
		window.Server.schools.post(schoolUnionData).then(() => {
			document.location.hash = '/admin_schools/school_unions';
		});
	},
	render: function() {
		return (
			<SchoolUnionForm	title		= "Add new school union..."
								onSubmit	= {this.submitAdd}
								binding		= {this.getDefaultBinding().sub('school_union_form')}
			/>
		);
	}
});


module.exports = SchoolUnionCreate;
