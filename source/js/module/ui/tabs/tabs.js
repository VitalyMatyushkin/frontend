/**
 * Created by Anatoly on 23.05.2016.
 */

const	React		= require('react'),
		TabItem		= require('./tab_item');

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
		tabListModel	: React.PropTypes.array.isRequired,
		onClick			: React.PropTypes.func.isRequired,
		customButton	: React.PropTypes.object
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
	renderTabs: function() {
		const model = this.props.tabListModel;

		if(typeof model !== "undefined") {
			return model.map(item => <TabItem key={item.value} tabModel={item} onClick={this.onClickTab}/>);
		} else {
			return null;
		}
	},
	renderCustomButton: function() {
		const customButton = this.props.customButton;

		if(typeof customButton !== "undefined") {
			return (
				<div className="eTabs_customButtonContainer">
					{customButton}
				</div>
			);
		} else {
			return null;
		}
	},
	render:function(){
		return (
			<div className="bTabs">
				{this.renderTabs()}
				{this.renderCustomButton()}
			</div>
		);
	}
});

module.exports = Tabs;