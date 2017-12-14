/**
 * Created by bridark on 30/07/15.
 */
import * as React 		from 'react';
import {PublicLogin} 	from './public_login';
import * as Morearty 	from 'morearty';
import './../../../../styles/main/b_public_menu.scss';
import './../../../../styles/bootstrap-custom.scss';

export const PublicMenu = (React as any).createClass({
	mixins:[Morearty.Mixin],
	
	getInitialState:function(){
		return {hidden:true}
	},
	
	getMenuItems:function(){
		const items = this.props.menuItems;
		
		if(typeof items !== 'undefined'){
			return items.map( node => {
				return (<li key={node} className = "ePublicMenu_item">
					<a
						onClick		= { () => {this.onClick(node)} }
						className	= "ePublicMenu_link"
					>
						{node}
					</a>
				</li>);
			});
		}
	},
	
	onClick: function(node) {
		/**
		 * If there is a link in the hash, then clicking on the link in the top menu will not do anything
		 * So, we manually call event hashchange, for function of scroll in component <Home />
		 * It's no best practice, but I don't see another option
		 */
		document.location.hash = `home`;
		document.location.hash = `${node.toLowerCase()}`;
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
		const 	menuNodes 		= this.getMenuItems(),
				extraClasses 	= this.state.hidden === false ? 'mShown' : '',
				classNames 		= `ePublicMenuCollapsedItems ${extraClasses}`;
		return(
			<div className="bPublicMenu">
				<span className="ePublicMenu_toggle" onClick={this.menuToggle}>
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