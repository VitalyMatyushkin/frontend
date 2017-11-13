const	React 			= require('react'),
		Morearty		= require('morearty'),
		Immutable 		= require('immutable'),
		SchoolHelper	= require('../../../../../../helpers/school_helper'),
		SchoolUnionForm	= require('./school_union_form');

const SchoolUnionEdit = React.createClass({
	SCHOOL_UNION_SUMMARY_PAGE: 'school_union_admin/summary',
	schoolUnionId: undefined,
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const schoolUnionId = this.getSchoolUnionFromPageUrl();

		if(schoolUnionId) {
			this.loadSchoolUnionById(schoolUnionId);
		}
	},
	getSchoolUnionFromPageUrl: function() {
		return this.getMoreartyContext().getBinding().sub('routing.parameters').toJS().id;
	},
	loadSchoolUnionById: function(schoolUnionId) {
		const binding = this.getDefaultBinding();

		//TODO WAITING API
		window.Server.school.get(schoolUnionId, {filter:{include:'postcode'}}).then(function (data) {
			if(data.postcode && data.postcode._id){
				data.postcode.id = data.postcode._id;
			}
			binding.set(Immutable.fromJS(data));
		});

		this.schoolUnionId = schoolUnionId;
	},
	submitEdit: function(schoolData) {
		//TODO WAITING API
		window.Server.school.put(
			this.schoolUnionId,
			schoolData
		).then(() => {
			document.location.hash = this.SCHOOL_UNION_SUMMARY_PAGE;
			return true;
		});
	},
	render: function() {
		return (
			<div className="bSchoolEdit">
				<SchoolUnionForm	title		= "Edit school union..."
									onSubmit	= {this.submitEdit}
									binding		= {this.getDefaultBinding()}
				/>
			</div>
		);
	}
});

module.exports = SchoolUnionEdit;