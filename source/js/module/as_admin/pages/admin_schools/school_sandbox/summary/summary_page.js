const	React 					= require('react'),
		Immutable					= require('immutable'),
		SummaryComponent	= require('module/as_admin/pages/admin_schools/school_sandbox/summary/summary_component'),
		Morearty				= require('morearty');

const SummaryPage = React.createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		const self					= this,
				binding					= self.getDefaultBinding(),
				school					= binding.toJS('schoolDetails');

				return <SummaryComponent school={school} />
	}
});

module.exports = SummaryPage;