const	React			= require('react');

const	Autocomplete	= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		InputItem		= require('module/ui/multiselect-dropdown/input_item');

const MultiselectWithAutocomplete = React.createClass({
	propTypes: {
		serverField:			React.PropTypes.string.isRequired,
		serviceFilter:			React.PropTypes.func.isRequired,
		handleSelectItem:		React.PropTypes.func.isRequired,
		handleClickRemoveItem:	React.PropTypes.func.isRequired,
		placeholder:			React.PropTypes.string.isRequired,
		selectedItems:			React.PropTypes.array.isRequired
	},
	renderItem: function (item) {
		return (
			<InputItem
				key						= { item.id }
				text					= { item.name }
				handleClickRemoveItem	= { this.props.handleClickRemoveItem.bind(null, item) }
			/>
		)
	},
	renderItems: function () {
		let items = null;

		if(this.props.selectedItems.length > 0) {
			items = (
				<div>
					{ this.props.selectedItems.map(this.renderItem) }
				</div>
			);
		}

		return items;
	},
	render: function () {
		return (
			<div>
				<Autocomplete
					serviceFilter	= { this.props.serviceFilter }
					serverField		= { this.props.serverField }
					onSelect		= { this.props.handleSelectItem }
					placeholder		= { this.props.placeholder }
					clearAfterSelect= { true }
				/>
				{ this.renderItems() }
			</div>
		);
	}
});

module.exports = MultiselectWithAutocomplete;