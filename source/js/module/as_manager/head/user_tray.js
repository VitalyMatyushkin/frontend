/**
 * Created by bridark on 08/07/15.
 */
var UserTray,
    SVG = require('module/ui/svg');
UserTray = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        openProperty: React.PropTypes.string.isRequired,
        onRequestDrop: React.PropTypes.func.isRequired
    },
    getDefaultProps:function(){
        return {
            isOpened:false
        };
    },
    render:function(){
        var self = this,
            isOpened = self.getDefaultBinding().get(self.props.openProperty),
            menuTrayClass = 'eTopMenu_tray ' + (isOpened ? 'eTopMenu_trayActive' : '');
        return(
            <div className="eTopMenu_item mLogin" onClick={this.props.onRequestDrop}>
                <SVG icon="icon_logout" />
                <div ref="accountTray" className={menuTrayClass}>
                    <ul>
                        <li onClick={function(){document.location.hash ="settings/general"}} className="eTray_item"><span>MY ACCOUNT</span></li>
                        <li onClick={function(){document.location.hash ="logout"}} className="eTray_item"><span>SIGN OUT</span></li>
                    </ul>
                </div>
            </div>
        )
    }
});
module.exports = UserTray;