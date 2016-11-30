const	React						= require('react'),

		classNames					= require('classnames'),

		MultiselectDropdownStyles	= require('../../../../styles/ui/bMultiSelectDropdown.scss');

const MultiselectDropdown = React.createClass({

	isMouseDown: false,

	propTypes: {
		items:				React.PropTypes.array.isRequired,
		selectedItems:		React.PropTypes.array.isRequired,
		handleClickItem:	React.PropTypes.func.isRequired
	},

	componentDidMount: function () {
		window.addEventListener('mousedown', this.handlePageClick, false);
	},
	componentWillUnmount: function() {
		window.removeEventListener('mousedown', this.handlePageClick);
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
	isItemSelected: function(item) {
		const foundItem = this.props.selectedItems.find(i => item.id === i.id);

		return typeof foundItem !== 'undefined';
	},
	renderMenuItem: function(item) {
		const isItemSelected = this.isItemSelected(item);

		const circleClassName = classNames({
			"fa fa-circle"		: isItemSelected,
			"fa fa-circle-o"	: !isItemSelected
		});

		return (
			<div	key			= {item.id}
					className	= 'eMultiSelectDropdown_item'
					onMouseDown	= {this.handleClickItem.bind(this, item)}
			>
				<div className="eMultiSelectDropdown_itemIcon">
					<i	className	= {circleClassName}
						aria-hidden	= "true"
					>
					</i>
				</div>
				<div className="eMultiSelectDropdown_itemText">
					{this.getItemView(item)}
				</div>
			</div>
		);
	},
	handleClickInput: function() {
		this.setState({isOpen: !this.state.isOpen});
	},
	handleClickItem: function(item) {
		this.props.handleClickItem(item);
	},
	handlePageClick: function() {
		if (!this.isMouseDown) {
			this.setState({isOpen: false});
		}
	},
	handleMouseUp: function() {
		this.isMouseDown = false;
	},
	handleMouseDown: function() {
		this.isMouseDown = true;
	},

	render: function() {
		const inputClassName = classNames({
			eMultiSelectDropdown_input	: true,
			mFocus						: this.state.isOpen,
			mOpen						: this.state.isOpen
		});

		return (
			<div	className	= "bMultiSelectDropdown"
					onMouseDown	= {this.handleMouseDown}
					onMouseUp	= {this.handleMouseUp}
			>
				<input	className	= {inputClassName}
						type		= 'text'
						onClick		= {this.handleClickInput}
						value		= {this.getInputView()}
						readOnly
				/>
				{ this.renderItems() }
			</div>
		)
	}
});

module.exports = MultiselectDropdown;