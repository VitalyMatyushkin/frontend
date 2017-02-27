/**
 * Created by bridark on 30/07/15.
 */
const   Morearty            = require('morearty'),
        React               = require('react'),
        SVG                 = require('module/ui/svg'),
        PublicMenuStyles    = require('./../../../../styles/main/b_public_menu.scss'),
        Bootstrap           = require('./../../../../styles/bootstrap-custom.scss');

const PublicMenu = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        menuItems: React.PropTypes.array.isRequired
    },
    getInitialState:function(){
        return {menuActive:true}
    },
    getMenuItems:function(){
        const items = this.props.menuItems;
        if(typeof items !== 'undefined'){
            return items.map( node => {
                return (<li key={node} className="ePublicMenu_item">
                    <a href="">{node}</a>
                </li>);
            });
        }
    },
    menuToggle:function(){
        const currentState = this.state.menuActive;

        if(currentState === false){
            this.setState({menuActive:true});
            this.forceUpdate();
        }else{
            this.setState({menuActive:false});
            this.forceUpdate();
        }
    },
    render:function(){
        const 	self 		= this,
				menuNodes 	= self.getMenuItems(),
				menuClasses = self.state.menuActive === true ? 'bPublicMenu_tray bPublicMenu_show' : 'bPublicMenu_tray bPublicMenu_hide';
        return(
            <ul className="bPublicMenu">
                <span className="hBurgerIcon" onClick={self.menuToggle.bind(null,this)}><img src="images/menu.png"/></span>
                    {menuNodes}
            </ul>
        );
    }
});
module.exports = PublicMenu;