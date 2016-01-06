/**
 * Created by bridark on 04/08/15.
 */
var PublicLogin,
    SVG = require('module/ui/svg'),
    React = require('react'),
    ReactDOM = require('reactDom'),
    LoginForm = require('module/ui/login/user/form');
PublicLogin = React.createClass({
    mixins:[Morearty.Mixin],
    getInitialState:function(){
        return {signInTrayActive:false}
    },
    handleSignInUpClick:function(){
        var self = this,
            currentState = self.state.signInTrayActive;
        if(currentState === false){
            self.setState({signInTrayActive:true});
            self.forceUpdate();
        }else{
            self.setState({signInTrayActive:false});
            self.forceUpdate();
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            holderClasses = self.state.signInTrayActive === true ? 'bPublicMenu_login_holder bPublicMenu_login_active': 'bPublicMenu_login_holder' ,
            trayClasses = self.state.signInTrayActive === true ? 'bPublicMenu_login_tray signInActive' : 'bPublicMenu_login_tray ';
        return(
            <div className="bPublicMenu_login">
                <div onClick={self.handleSignInUpClick.bind(null,this)} className={holderClasses}>
                    <span className="loginUserIcon"><SVG icon="icon_user"></SVG></span>
                    <span className="bPublicMenu_login_txt"> Sign In </span>
                    <span className="loginChevronDwn"><SVG  icon="icon_chevron-down"></SVG></span>
                </div>
                <div ref="signInTray" className={trayClasses}>
                    <LoginForm customName={'Public'} binding={self.getDefaultBinding()} />
                    <a className="forgottenLink">Forgotten Password?</a>
                </div>
            </div>
        )
    }
});
module.exports = PublicLogin;