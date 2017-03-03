/**
 * Created by bridark on 30/07/15.
 */
const   Morearty            = require('morearty'),
        React               = require('react'),
        SVG                 = require('module/ui/svg'),
        PublicLogin = require('module/ui/menu/public_login'),
        PublicMenuStyles    = require('./../../../../styles/main/b_public_menu.scss'),
        Bootstrap           = require('./../../../../styles/bootstrap-custom.scss');

const PublicMenu = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        menuItems: React.PropTypes.array.isRequired
    },
    getInitialState:function(){
        return {hidden:true}
    },
    getMenuItems:function(){
        const items = this.props.menuItems;
        if(typeof items !== 'undefined'){
            return items.map( node => {
                return (<li key={node} className="ePublicMenu_item">
                    <a href={"#eSchool" + node} className="ePublicMenu_link" >{node}</a>
                </li>);
            });
        }
    },
    menuToggle:function(){
        if(!this.state.hidden){
            this.setState({hidden:true});
            this.forceUpdate();
        }else{
            this.setState({hidden:false});
            this.forceUpdate();
        }
    },
    render:function(){
        const 	self 		= this,
				menuNodes 	= self.getMenuItems(),
				extraClasses = self.state.hidden === false ? 'mShown' : '',
                classNames = `ePublicMenuCollapsedItems ${extraClasses}`;
        return(
            <div className="bPublicMenu">
                <span className="ePublicMenu_toggle" onClick={self.menuToggle}>
                    <i className="fa fa-bars" aria-hidden="true" />
                </span>
                <ul className={classNames}>
                    {menuNodes}
                    <PublicLogin />
                </ul>
            </div>
        );
    }
});
module.exports = PublicMenu;