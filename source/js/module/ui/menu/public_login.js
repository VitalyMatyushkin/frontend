/**
 * Created by bridark on 04/08/15.
 */
const   React       = require('react'),
        Morearty    = require('morearty');

const PublicLogin = React.createClass({
    mixins:[Morearty.Mixin],
    handleSignInUpClick:function(){
        let subdomains = document.location.host.split('.');
        subdomains[0] = "login";
        let domain = subdomains.join(".");
        window.location.href = `//${domain}`;
    },
    render:function(){
        var self = this;

        return(
            <div className="bPublicLogin_wrap">
                <div className="bPublicMenu_login">
                    <div onClick={self.handleSignInUpClick.bind(null,this)}
                         className="bPublicMenu_login_holder bPublicMenu_login_active">
                        <span className="bPublicMenu_login_txt"> Sign In </span>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = PublicLogin;