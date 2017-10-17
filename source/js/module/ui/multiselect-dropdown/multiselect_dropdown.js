const	React						= require('react'),

		classNames					= require('classnames'),

		InputItem					= require('./input_item'),
		AddButton					= require('./add_button'),
		MultiselectDropdownStyles	= require('../../../../styles/ui/multiselect_dropdown/bMultiSelectDropdown.scss');

const MultiselectDropdown = React.createClass({

	isMouseDown: false,

	propTypes: {
		items:				React.PropTypes.array.isRequired,
		selectedItems:		React.PropTypes.array.isRequired,
		handleClickItem:	React.PropTypes.func.isRequired,
		extraStyle:			React.PropTypes.string
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
	handleClickRemoveItem: function(item) {
		this.props.handleClickItem(item);
	},
	getInputView: function() {
		return this.props.items
			.filter(i => {
				// selectedItem.id == item.id
				const foundItem = this.props.selectedItems.find(si => si.id === i.id);

				return typeof foundItem !== 'undefined';
			})
			.map(item => this.renderItem(item));
	},
	renderItem: function(item) {
		return (
			<InputItem	key						= {item.id}
						text					= {item.value}
						handleClickRemoveItem	= {this.handleClickRemoveItem.bind(null, item)}
			/>
		);
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
			"fa fa-check-circle"	: isItemSelected,
			"fa fa-circle-o"		: !isItemSelected
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
	handleClickAddButton: function(eventDescritor) {
		this.setState({isOpen: !this.state.isOpen});
		eventDescritor.stopPropagation();
	},
	getExtraStyle: function () {
		return typeof this.props.extraStyle !== 'undefined' ? this.props.extraStyle : '';
	},
	render: function() {
		const inputClassName = classNames({
			eMultiSelectDropdown_input	: true,
			mFocus						: this.state.isOpen,
			mOpen						: this.state.isOpen
		});

		return (
			<div
				className	= { "bMultiSelectDropdown " + this.getExtraStyle() }
				onMouseDown	= { this.handleMouseDown }
				onMouseUp	= { this.handleMouseUp }
			>
				<div className={inputClassName}>
					<AddButton handleClick={this.handleClickAddButton}/>
					{this.getInputView()}
				</div>
				{ this.renderItems() }
			</div>
		)
	}
});

module.exports = MultiselectDropdown;