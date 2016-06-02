/**
 * Created by Anatoly on 23.05.2016.
 */

const 	React 		= require('react'),
		classNames 	= require('classnames');
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
		tabModel: 	React.PropTypes.object.isRequired,
		onClick:	React.PropTypes.func.isRequired
	},
	render:function(){
		const 	self 	= this,
				model 	= self.props.tabModel,
				classes = classNames({
					eTab:true,
					mActive:model.isActive
				});

		return (
			<span className={classes} onClick={self.props.onClick.bind(null, model.value)}>{model.text}
			</span>
		);
	}
});

module.exports = TabItem;