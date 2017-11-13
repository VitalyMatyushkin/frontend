const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		SchoolUnionForm	= require('../school_union_form/school_union_form'),
		SchoolHelper	= require('module/helpers/school_helper');

const SchoolUnionEdit = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const	binding		= this.getDefaultBinding(),
				schoolId	= this.getSchoolIdFromPageUrl();

		binding.clear();
		binding.set('isSync', false);

		if(typeof schoolId !== "undefined") {
			this.loadSchoolById(schoolId);
		}
	},
	getSchoolIdFromPageUrl: function() {
		return this.getMoreartyContext().getBinding().sub('routing.parameters').toJS().id;
	},
	loadSchoolById: function(schoolId) {
		window.Server.school.get(schoolId).then(school => {
			this.getDefaultBinding()
				.atomically()
				.set('isSync',	true)
				.set('school',	Immutable.fromJS(school))
				.commit();
		});
	},
	handleSubmit: function(schoolData) {
		window.Server.school.put(this.getSchoolIdFromPageUrl(), schoolData).then(() => {
			this.getDefaultBinding().clear();
			document.location.hash = 'schools/school_unions';
		});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		if(binding.get('isSync')) {
			return (
				<SchoolUnionForm	binding		= {binding.sub('school')}
									title		= {"Edit School Union..."}
									onSubmit	= {this.handleSubmit}
				/>
			);
		} else {
			return null;
		}
	}
});

module.exports = SchoolUnionEdit;