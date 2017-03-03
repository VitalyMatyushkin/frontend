/**
 * Created by bridark on 04/08/15.
 */
const   React = require('react');

const PublicLogin = React.createClass({
    handleSignInUpClick:function(){
        let subdomains = document.location.host.split('.');
        subdomains[0] = "app";
        let domain = subdomains.join(".");
        window.location.href = `//${domain}/#login`;
    },
    render:function(){
        return(
                <div className="bPublicMenu_login">
                    <div onClick={this.handleSignInUpClick.bind(null,this)}>
                        Log In
                    </div>
                </div>
        )
    }
});
module.exports = PublicLogin;