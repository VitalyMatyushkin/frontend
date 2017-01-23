const	React 						= require('react'),
		Morearty					= require('morearty'),
		Immutable 					= require('immutable'),
		SchoolUnionView				= require('./school_union_view'),
		SchoolUnionViewWrapperStyle	= require('../../../../../../../styles/ui/b_school_view_wrapper.scss');

const SchoolUnionViewWrapper = React.createClass({
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

		window.Server.school.get(schoolId, {filter:{include:'postcode'}}).then(school => {
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
					<SchoolUnionView schoolUnion={binding.toJS('school')}/>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = SchoolUnionViewWrapper;