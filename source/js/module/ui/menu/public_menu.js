/**
 * Created by bridark on 30/07/15.
 */
const   Morearty    = require('morearty'),
        React       = require('react'),
        SVG         = require('module/ui/svg');

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
                return (<div key={node} className="bPublicMenu_item">{node}</div>);
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
            <div className="bTopMenu bPublicMenu">
                <span>Menu</span>
                <span className="hBurgerIcon" onClick={self.menuToggle.bind(null,this)}><img src="images/menu.png"/></span>
                <div className={menuClasses}>
                    {menuNodes}
                </div>
            </div>
        );
    }
});
module.exports = PublicMenu;