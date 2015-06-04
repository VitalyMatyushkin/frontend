/**
 * Created by bridark on 04/06/15.
 */
var LoginForm = require('module/as_admin/pages/admin_login/admin_user/form'),
    LoginError = require('module/as_admin/pages/admin_login/admin_user/error'),
    LoginAdminPage;

LoginAdminPage = React.createClass({
    mixins: [Morearty.Mixin],
    getDefaultState: function () {
        return Immutable.Map({
            showError: false
        });
    },
    onSuccess: function(data) {
        var self = this,
            binding = self.getDefaultBinding();

        if(data.id) {
            binding.update('authorizationInfo', function(){
                return Immutable.fromJS(data);
            });
        }
    },
    showError: function() {
        var self = this;

        self.getDefaultBinding().set('showError', true);
    },
    hideError: function() {
        var self = this;

        self.getDefaultBinding().set('showError', false);
    },
    onSingUp: function() {
        var self = this;

        document.location.hash = 'register';
        self.hideError();
    },
    render: function() {
        var self = this,
            currentView;

        if (!self.getDefaultBinding().get('showError')) {
            currentView = <LoginForm onError={self.showError} onSuccess={self.onSuccess} binding={self.getDefaultBinding()} />
        } else {
            currentView = <LoginError onOk={self.hideError} onSingUp={self.onSingUp} />
        }

        return (
            <div className="bPageMessage">
                {currentView}
            </div>
        )
    }
});


module.exports = LoginAdminPage;
