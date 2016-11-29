const	React						= require('react'),

		classNames					= require('classnames'),

		MultiselectDropdownStyles	= require('../../../../styles/ui/bMultiSelectDropdown.scss');

const MultiselectDropdown = React.createClass({
	propTypes: {
		items:				React.PropTypes.array.isRequired,
		selectedItems:		React.PropTypes.array.isRequired,
		handleClickItem:	React.PropTypes.func.isRequired
	},
	getDefaultProps: function () {
		return {
			items			: [],
			selectedItems	: []
		}
	},
	getInitialState: function(){
		return {
			isOpen: false
		};
	},

	getItemView: function(item) {
		return item.value;
	},
	getInputView: function() {
		return this.props.items
			.filter(i => {
				// selectedItem.id == item.id
				const foundItem = this.props.selectedItems.find(si => si.id === i.id);

				return typeof foundItem !== 'undefined';
			})
			.reduce((prevValue, currentValue, index) => {
				//if accumulator string is empty
				if(index === 0) {
					return `${currentValue.value}`;
				} else {
					return `${prevValue}, ${currentValue.value}`;
				}
			}, '');
	},

	renderItems: function() {
		const cssStyle = classNames({
			eMultiSelectDropdown_itemList	: true,
			mOpen							: this.state.isOpen
		});

		return (
			<div	className	= {cssStyle}
					role		= "listbox"
			>
				{this.props.items.map(this.renderMenuItem)}
			</div>
		);
	},
	renderMenuItem: function(item) {
		return (
			<div	key			= {item.id}
					className	= 'eMultiSelectDropdown_item'
					onMouseDown	= {this.handleClickItem.bind(this, item)}
			>
				{this.getItemView(item)}
			</div>
		);
	},
	handleClickInput: function() {
		this.setState({isOpen: !this.state.isOpen});
	},
	handleBlurInput: function() {
		this.setState({isOpen: false});
	},
	handleClickItem: function(item) {
		this.props.handleClickItem(item);
	},

	render: function () {
		return (
			<div className="bMultiSelectDropdown">
				<input	className	= "eMultiSelectDropdown_input"
						type		= 'text'
						onClick		= {this.handleClickInput}
						onBlur		= {this.handleBlurInput}
						value		= {this.getInputView()}
						readOnly
				/>
				{ this.renderItems() }
			</div>
		)
	}
});

module.exports = MultiselectDropdown;