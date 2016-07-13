const   RouterView      = require('module/core/router'),
        React           = require('react'),
        Route           = require('module/core/route'),
        Morearty		= require('morearty'),
        Immutable	    = require('immutable');

const SportsPage = React.createClass({
    mixins: [Morearty.Mixin],
    getDefaultState: function () {
        return Immutable.fromJS({
            sportsList: {},
            sportsAdd: {},
            sportsEdit: {}
        });
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();

        return (
            <RouterView routes={binding.sub('sportsRouting')} binding={globalBinding}>
                <Route
                    path="/admin_schools/admin_views/sports"
                    binding={binding.sub('sportsList')}
                    component="module/as_admin/pages/admin_schools/sports/sports_list"
                    formBinding={binding.sub('sportsForm')}
                />
                <Route path="/admin_schools/admin_views/sports/add"
                       binding={binding.sub('sportsAdd')}
                       component="module/as_admin/pages/admin_schools/sports/sports_add"
                />
                <Route path="/admin_schools/admin_views/sports/edit"
                       binding={binding.sub('sportsForm')}
                       component="module/as_admin/pages/admin_schools/sports/sports_edit"
                />
            </RouterView>
        )
    }
});

module.exports = SportsPage;
