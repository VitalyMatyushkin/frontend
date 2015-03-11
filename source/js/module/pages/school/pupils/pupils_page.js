var PupilPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route');

PupilPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('pupilsRouting') } binding={globalBinding}>
				<Route path="/school/pupils" binding={binding.sub('pupilsList')} formBinding={binding.sub('pupilForm')} component="module/pages/school/pupils/pupils_list"  />
				<Route path="/school/pupils/add" binding={binding.sub('pupilForm')} component="module/pages/school/pupils/pupil_add"  />
				<Route path="/school/pupils/edit" binding={binding.sub('pupilForm')} component="module/pages/school/pupils/pupil_edit"  />
			</RouterView>
		)
	}
});


module.exports = PupilPage;
