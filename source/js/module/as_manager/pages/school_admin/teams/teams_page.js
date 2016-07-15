const   RouterView  = require('module/core/router'),
        React       = require('react'),
        Morearty	= require('morearty'),
        Route       = require('module/core/route');

const TeamsPage = React.createClass({
    mixins: [Morearty.Mixin],
    render: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();

        return (
            <RouterView routes={binding.sub('teamsRouting')} binding={globalBinding}>
                <Route path="/school_admin/teams"
                       binding={binding.sub('teamsList')}
                       formBinding={binding.sub('teamForm')}
                       component="module/as_manager/pages/school_admin/teams/teams_list"/>

                <Route path="/school_admin/teams/add"
                       binding={binding.sub('teamAdd')}
                       component="module/as_manager/pages/school_admin/teams/team_add"/>

                <Route path="/school_admin/teams/edit"
                       binding={binding.sub('teamEdit')}
                       component="module/as_manager/pages/school_admin/teams/team_edit"/>
            </RouterView>
        );
    }
});

module.exports = TeamsPage;