const   RouterView      	= require('module/core/router'),
        React           	= require('react'),
        Route           	= require('module/core/route'),
        Morearty			= require('morearty'),
        Immutable	    	= require('immutable'),
		SportsListComponent = require('module/as_admin/pages/admin_schools/sports/sports_list'),
		SportsAddComponent 	= require('module/as_admin/pages/admin_schools/sports/sports_add'),
		SportsEditComponent = require('module/as_admin/pages/admin_schools/sports/sports_edit');


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
        const 	self = this,
            	binding = self.getDefaultBinding(),
            	globalBinding = self.getMoreartyContext().getBinding();

        return (
            <RouterView routes={binding.sub('sportsRouting')} binding={globalBinding}>
                <Route
                    path="/admin_schools/admin_views/sports"
                    binding={binding.sub('sportsList')}
                    component={SportsListComponent}
                    formBinding={binding.sub('sportsForm')}
                />
                <Route path="/admin_schools/admin_views/sports/add"
                       binding={binding.sub('sportsAdd')}
                       component={SportsAddComponent}
                />
                <Route path="/admin_schools/admin_views/sports/edit"
                       binding={binding.sub('sportsForm')}
                       component={SportsEditComponent}
                />
            </RouterView>
        )
    }
});

module.exports = SportsPage;
