/**
 * Created by Anatoly on 23.05.2016.
 */

const	React		= require('react'),
		classNames	= require('classnames');
/**
 * Tab item component
 * @param tabModel {object} = 	{
 * 									value:{string},
 * 									text:{string},
 * 									isActive:{bool}
 * 								}
 * */
const TabItem = React.createClass({
	propTypes: {
		tabModel	: React.PropTypes.object.isRequired,
		onClick		: React.PropTypes.func.isRequired
	},
	getTabClassName: function() {
		return classNames({
			eTabs_tab	: true,
			mActive		: this.props.tabModel.isActive
		});
	},
	render:function(){
		const model = this.props.tabModel;

		return (
			<div	className	= {this.getTabClassName()}
					onClick		= {this.props.onClick.bind(null, model.value)}
			>
				{model.text}
			</div>
		);
	}
});

module.exports = TabItem;