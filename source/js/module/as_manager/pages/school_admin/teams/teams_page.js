const   RouterView  		= require('module/core/router'),
        React       		= require('react'),
        Morearty			= require('morearty'),
        Route       		= require('module/core/route'),
		TeamsListComponent 	= require("module/as_manager/pages/school_admin/teams/list/team-list"),
		TeamsAddComponent 	= require("module/as_manager/pages/school_admin/teams/team_add"),
		TeamsEditComponent 	= require("module/as_manager/pages/school_admin/teams/team_edit");



const TeamsPage = React.createClass({
    mixins: [Morearty.Mixin],
    render: function() {
        const 	self 			= this,
            	binding 		= self.getDefaultBinding(),
            	globalBinding 	= self.getMoreartyContext().getBinding();

        return (
            <RouterView routes={binding.sub('teamsRouting')} binding={globalBinding}>
                <Route path="/school_admin/teams"
                       binding={binding.sub('teamsList')}
                       formBinding={binding.sub('teamForm')}
                       component={TeamsListComponent}/>

                <Route path="/school_admin/teams/add"
                       binding={binding.sub('teamAdd')}
                       component={TeamsAddComponent}/>

                <Route path="/school_admin/teams/edit"
                       binding={binding.sub('teamEdit')}
                       component={TeamsEditComponent}/>
            </RouterView>
        );
    }
});

module.exports = TeamsPage;