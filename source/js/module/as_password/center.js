/**
 * Created by Anatoly on 29.05.2016.
 */
const   React           = require('react'),
        RouterView      = require('module/core/router'),
		Route			= require('module/core/route');

const Center = React.createClass({
    mixins: [Morearty.Mixin],
    render: function(){
        const   binding         = this.getDefaultBinding(),
                currentPage     = binding.get('routing.currentPageName') || '',
                mainClass       = 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

        return (
            <div className={mainClass}>
                <div className="bPageWrap">
                    <RouterView routes={ binding.sub('routing') } binding={binding}>

						<Route path="/reset"
							   binding={binding.sub('reset')}
							   component="module/as_password/forgot_password/reset"
							   unauthorizedAccess={true}/>

						<Route path="/reset-request"
							   binding={binding.sub('reset-request')}
							   component="module/as_password/forgot_password/reset_request"
							   unauthorizedAccess={true}/>

                    </RouterView>
            </div>
                </div>
        );
    }

});

module.exports = Center;