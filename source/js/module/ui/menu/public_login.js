/**
 * Created by bridark on 04/08/15.
 */
const   React = require('react');

const PublicLogin = React.createClass({
    handleSignInUpClick:function(){
        let subdomains = document.location.host.split('.');
        subdomains[0] = "login";
        let domain = subdomains.join(".");
        window.location.href = `//${domain}`;
    },
    render:function(){
        return(
            <div className="bPublicLogin_wrap">
                <div className="bPublicMenu_login">
                    <div onClick={this.handleSignInUpClick.bind(null,this)}
                         className="bPublicMenu_login_holder bPublicMenu_login_active">
                        <span>Sign In</span>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = PublicLogin;