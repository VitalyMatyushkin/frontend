/**
* Created by Anatoly on 09.09.2016.
*/

const 	React 		= require('react'),
		classNames 	= require('classnames');

const ActionDropList =  React.createClass({
	propTypes: {
		listItems: 			React.PropTypes.array.isRequired,
		listItemFunction: 	React.PropTypes.func,
		itemId: 			React.PropTypes.string
	},
	getInitialState:function(){
		return {
			wrapperActive : false
		};
	},
	_listItemClick:function(item){
		const 	text 				= item.text ? item.text : item,
				isActive 			= text.indexOf('inactive') === -1,
				listItemFunction 	= this.props.listItemFunction;

		//we call listItemFunction only for active elements droplist
		if (typeof listItemFunction !== 'undefined' && isActive) {
			listItemFunction(this.props.itemId, item);
		}
	},
	_renderListItems:function(){
		if(this.props.listItems){
			
			return(
				<ul className="dropdown">
					{this.props.listItems.map((item,index)=>{
						const 	text 	= item.text ? item.text : item,
								classes = classNames({
									'mInactive': text.indexOf('inactive') !== -1
								});
						return(
							<li key={index}>
								<span
									className 	= { classes }
									onClick 	= { this._listItemClick.bind(null,item) }
								>
									{text}
								</span>
							</li>
						)
					})}
				</ul>
			);
		}
	},
	onClick:function(event){
		this.setState({ wrapperActive: !this.state.wrapperActive });
		event.stopPropagation();
	},
	onBlur:function(event){
		//On mouse leave check if the current state is true
		//dismiss active state
		if(this.state.wrapperActive){
			this.setState({ wrapperActive: !this.state.wrapperActive });
			event.stopPropagation();
		}
	},
	render:function(){
		const 	classes = classNames({
					'wrapper-dropdown-5': 	true,
					active: 				this.state.wrapperActive
				});
		return (
			<div 	className 	= { classes }
					tabIndex 	= "1"
					onClick 	= { this.onClick }
					onBlur 		= { this.onBlur }
			>
				Edit
				{ this._renderListItems() }
			</div>
		)
	}
});

module.exports = ActionDropList;