/**
 * Created by bridark on 04/08/15.
 */
var PublicLogin,
    SVG = require('module/ui/svg'),
    React = require('react');

PublicLogin = React.createClass({
    mixins:[Morearty.Mixin],
    handleSignInUpClick:function(){
        const domain = document.location.host.split('.')[1] + "." + document.location.host.split('.')[2];
        const subdomain = "login";
        window.location.href = `http://${subdomain}.${domain}`;
    },
    render:function(){
        var self = this;

        return(
            <div className="bPublicMenu_login">
                <div onClick={self.handleSignInUpClick.bind(null,this)} className="bPublicMenu_login_holder bPublicMenu_login_active">
                    <span className="loginUserIcon"><SVG icon="icon_user"></SVG></span>
                    <span className="bPublicMenu_login_txt"> Sign In </span>
                </div>
            </div>
        )
    }
});
module.exports = PublicLogin;