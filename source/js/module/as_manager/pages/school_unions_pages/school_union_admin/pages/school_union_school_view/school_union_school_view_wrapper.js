const	React 								= require('react'),
		Morearty							= require('morearty'),
		Immutable 							= require('immutable'),
		SchoolUnionSchoolView				= require('./school_union_school_view'),
		SchoolUnionSchoolViewWrapperStyle	= require('../../../../../../../../styles/ui/b_school_view_wrapper.scss');

const SchoolUnionSchoolViewWrapper = React.createClass({
	propTypes: {
		schoolUnionId: React.PropTypes.string.isRequired
	},
	schoolId: undefined,
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
		return this.getMoreartyContext().getBinding().sub('routing').toJS().pathParameters[1];
	},
	loadSchoolById: function(schoolId) {
		const binding = this.getDefaultBinding();

		window.Server.schoolUnionSchool.get(
			{
				schoolUnionId: this.props.schoolUnionId,
				schoolId: schoolId
			},
			{
				filter: {include:'postcode'}
			}
		).then(school => {
			if(school.postcode && school.postcode._id){
				school.postcode.id = school.postcode._id;
			}

			binding.set('isSync', true);
			binding.set('school', Immutable.fromJS(school));
		});

		this.schoolId = schoolId;
	},
	render: function() {
		const binding = this.getDefaultBinding();

		if(binding.get('isSync')) {
			return (
				<div className="bSchoolViewWrapper">
					<SchoolUnionSchoolView	school={binding.toJS('school')}/>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = SchoolUnionSchoolViewWrapper;