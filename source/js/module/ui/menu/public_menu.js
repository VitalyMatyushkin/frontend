/**
 * Created by bridark on 30/07/15.
 */
var PublicMenu,
    React = require('react'),
    SVG = require('module/ui/svg');

PublicMenu = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        menuItems:React.PropTypes.array.isRequired
    },
    getInitialState:function(){
        return {menuActive:false}
    },
    getMenuItems:function(){
        var self = this,
            items = self.props.menuItems;
        if(items !== undefined){
            return items.map(function(node){
                return (
                    <div className="bPublicMenu_item">{node}</div>
                );
            });
        }
    },
    menuToggle:function(){
        var self = this,
            currentState = self.state.menuActive;
        if(currentState === false){
            self.setState({menuActive:true});
            self.forceUpdate();
        }else{
            self.setState({menuActive:false});
            self.forceUpdate();
        }
    },
    render:function(){
        var self = this,
            menuNodes = self.getMenuItems(),
            menuClasses = self.state.menuActive === true? 'bPublicMenu_tray bPublicMenu_show':'bPublicMenu_tray bPublicMenu_hide';
        return(
            <div className="bTopMenu bPublicMenu">
                <span>Menu</span>
                <span className="hBurgerIcon" onClick={self.menuToggle.bind(null,this)}><SVG classes="" icon="icon_menu"></SVG></span>
                <div className={menuClasses}>
                    {menuNodes}
                </div>
            </div>
        );
    }
});
module.exports = PublicMenu;