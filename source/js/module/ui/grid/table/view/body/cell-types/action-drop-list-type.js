/**
 * Created by Anatoly on 09.09.2016.
 */

const 	React 		= require('react'),
		DropList 	= require('module/ui/action-drop-list');

const ActionDropListType = function(props){
	const 	item 			= props.dataItem,
			options 		= props.cell.typeOptions,
			getActionList 	= options.getActionList,
			actionHandler 	= options.actionHandler,
			actionList 		= getActionList ? getActionList(item): null;

	return (
		<div className="eDataList_listItemCell mActions">
			<DropList 	key 				= { 'actions-' + item.id }
						itemId 				= { item.id }
						listItems 			= { actionList }
						listItemFunction 	= { actionHandler} />
		</div>
	);

};

ActionDropListType.propTypes = {
	cell: 		React.PropTypes.object.isRequired,
	dataItem:	React.PropTypes.object.isRequired
};


module.exports = ActionDropListType;
