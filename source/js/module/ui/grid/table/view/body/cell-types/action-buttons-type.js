/**
 * Created by Anatoly on 26.07.2016.
 */

const 	React 	= require('react'),
		SVG 	= require('module/ui/svg');

const ActionButtonsType = React.createClass({
	propTypes: {
		cell: 		React.PropTypes.object,
		dataItem:	React.PropTypes.object
	},
	getButtons:function(){
		const 	self = this,
				itemButtons = [],
				item = self.props.dataItem,
				options = self.props.cell.typeOptions;

		options.onItemEdit && itemButtons.push(
			<span key={item.id+'edit'} onClick={options.onItemEdit.bind(this, item)} className="bLinkLike">
				<SVG icon="icon_edit"/>
			</span>
		);
		options.onItemView && itemButtons.push(
			<span key={item.id+'view'} onClick={options.onItemView.bind(this, item)} className="bLinkLike bViewBtn">
				<SVG icon="icon_eye"/>
			</span>
		);
		options.onItemSelect && itemButtons.push(
			<span key={item.id+'view'} onClick={options.onItemSelect.bind(this, item)} className="bLinkLike bViewBtn">
				<SVG icon="icon_menu"/>
			</span>
		);
		options.onItemRemove && itemButtons.push(
			<span key={item.id+'remove'} onClick={options.onItemRemove.bind(this, item)} className="bLinkLike delete_btn">
				<SVG icon="icon_delete"/>
			</span>
		);

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
