const	React						= require('react'),
		Morearty					= require('morearty'),
		RouterView					= require('module/core/router'),
		Route						= require('module/core/route');

const	SportListComponent	= require('./sport_list_wrapper');

const SportsPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const	binding 		= this.getDefaultBinding(),
				subBinding		= binding.sub('classesRouting'),
				globalBinding	= this.getMoreartyContext().getBinding();

		return (
			<RouterView	routes	= {subBinding.sub('routing')}
						binding	= {globalBinding}
			>
				<Route	path		= "/school_sandbox/:schoolId/sports"
						binding		= {subBinding.sub('sports')}
						component	= {SportListComponent}
				/>
			</RouterView>
		)
	}
});

module.exports = SportsPage;