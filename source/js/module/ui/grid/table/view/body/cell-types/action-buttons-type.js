// @flow
/**
 * Created by Anatoly on 26.07.2016.
 */

const 	React 	= require('react'),
		SVG 	= require('module/ui/svg');

const ActionButtonsType = React.createClass({
	propTypes: {
		cell: 		React.PropTypes.object.isRequired,
		dataItem:	React.PropTypes.object.isRequired
	},
	getButtons:function(){
		const	itemButtons = [],
				item		= this.props.dataItem,
				options		= this.props.cell.typeOptions;

		options.onItemEdit && itemButtons.push(
			<span key={item.id+'edit'} onClick={options.onItemEdit.bind(null, item)} className="bLinkLike bTooltip"
				  data-description="Edit">
				<SVG icon="icon_edit"/>
			</span>
		);
		options.onItemView && itemButtons.push(
			<span key={item.id+'view'} onClick={options.onItemView.bind(null, item)}
				  className="bLinkLike bViewBtn bTooltip" data-description="View">
				<SVG icon="icon_eye"/>
			</span>
		);
		options.onItemSelect && itemButtons.push(
			<span key={item.id+'view'} onClick={options.onItemSelect.bind(null, item)}
				  className="bLinkLike bViewBtn bTooltip" data-description="View">
				<SVG icon="icon_eye"/>
			</span>
		);
		options.onItemRemove && itemButtons.push(
			<span key={item.id+'remove'} onClick={options.onItemRemove.bind(null, item)}
				  className="bLinkLike delete_btn bTooltip" data-description="Delete">
				<SVG icon="icon_delete"/>
			</span>
		);

		return itemButtons.map(btn => btn);
	},
	render: function() {
		return (
			<div className="eDataList_listItemCell mActions">
				{this.getButtons()}
			</div>
		);
	}
});

module.exports = ActionButtonsType;
