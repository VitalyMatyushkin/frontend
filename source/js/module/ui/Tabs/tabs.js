/**
 * Created by Anatoly on 23.05.2016.
 */

const 	React       = require('react'),
		TabItem 	= require('module/ui/tabs/tab_item');

/**
 * Tabs component
 * @param tabListModel {array} = [{
 * 									value:{string},
 * 									text:{string},
 * 									isActive:{bool}
 * 								},
 * 								.........
 * 								{
 * 									value:{string},
 * 									text:{string},
 * 									isActive:{bool}
 * 								}
 * 							]
 * */
const Tabs = React.createClass({
	propTypes: {
		tabListModel: 	React.PropTypes.array.isRequired,
		onClick:		React.PropTypes.func.isRequired
	},
	getInitialState:function(){
		return {
			activeTab:null
		};
	},
	componentWillMount:function(){
		const 	self 	= this,
				model 	= self.props.tabListModel;

		// set active tab
		if(model && model.length){
			let activeTab = model.find(item => item.isActive);
			if(!activeTab)
				activeTab = model[0];

			self.setState({activeTab:activeTab});
		}
	},
	onClickTab:function(value){
		const 	self 	= this,
				model 	= self.props.tabListModel;

		if(model && model.length){
			let activeTab = self.state.activeTab;
			activeTab.isActive = false;
			activeTab = model.find(item => item.value === value);
			activeTab.isActive = true;

			self.setState({activeTab:activeTab});
			self.props.onClick && self.props.onClick(value);
		}
	},
	render:function(){
		const 	self 	= this,
				model 	= self.props.tabListModel,
				tabs	= model && model.map(item => {
						return <TabItem tabModel={item} onClick={self.onClickTab} />
					});

		return (
			<div className="bTabs">
				{tabs}
			</div>
		);
	}
});

module.exports = Tabs;