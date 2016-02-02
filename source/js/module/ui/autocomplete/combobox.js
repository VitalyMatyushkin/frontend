
var guid = 0;
var k = function () {
};
var addClass = require('./add-class');
var ComboboxOption = require('./option');
var React = require('react');
var ReactDOM = require('reactDom');

module.exports = React.createClass({
	propTypes: {
		/**
		 * Defaults to 'both'. 'inline' will autocomplete the first matched Option
		 * into the input value, 'list' will display a list of choices, and of
		 * course, both does both (do you have a soft 'L' in there when you say
		 * "both" out loud?)
		 */
		autocomplete: React.PropTypes.oneOf(['both', 'inline', 'list']),

		/**
		 * Called when the combobox receives user input, this is your chance to
		 * filter the data and rerender the options.
		 *
		 * Signature:
		 *
		 * ```js
		 * function(userInput){}
		 * ```
		 */
		onInput: React.PropTypes.func,

		/**
		 * Called when the combobox receives a selection. You probably want to reset
		 * the options to the full list at this point.
		 *
		 * Signature:
		 *
		 * ```js
		 * function(selectedValue){}
		 * ```
		 */
		onSelect: React.PropTypes.func,


		onFocus: React.PropTypes.func,
		/**
		 * The initial value of the component.
		 */
		value: React.PropTypes.any,

		/**
		 * Костыль для Morearty-совместимости
		 */
		binding: React.PropTypes.any
	},

	getDefaultProps: function () {

		return {
			autocomplete: 'both',
			onInput: k,
			onSelect: k,
			value: null
		};
	},

	getInitialState: function () {
		this.props.binding.set('inputValue', this.findInputValue());

		return {
			value: this.props.value,
			// the value displayed in the input
			inputValue: this.findInputValue(),
			isOpen: false,
			focusedIndex: null,
			matchedAutocompleteOption: null,
			// this prevents crazy jumpiness since we focus options on mouseenter
			usingKeyboard: false,
			activedescendant: null,
			listId: 'eCombobox_list-' + (++guid),
			menu: {
				children: [],
				activedescendant: null,
				isEmpty: true
			}
		};
	},

	componentWillMount: function () {
		var self = this;
		self.defaulInputLabel = self.props.value;
		self.setState({menu: this.makeMenu()});

	},
	componentWillUnmount:function(){
		var self = this;
		clearTimeout(self.defValueTimerId);
	},
	componentWillReceiveProps: function (newProps) {
		var self = this;
		self.setState({
			menu: self.makeMenu(newProps.children)
		});
		self.defValueTimerId = setTimeout(function(){
			ReactDOM.findDOMNode(self.refs.input).value=self.findInputValue(newProps.value);
		},200);
	},

	/**
	 * We don't create the <ComboboxOption> components, the user supplies them,
	 * so before rendering we attach handlers to facilitate communication from
	 * the ComboboxOption to the Combobox.
	 */
	makeMenu: function (children) {
		var activedescendant;
		var isEmpty = true;
		var self = this;
		//Locally scoped method for each menu entry
		//It may be redundant but lets keep it for now
		var testClick = function(evt){
			self.selectOption(arguments[0]);
		};
		children = children || self.props.children;
		//Using cloneWithProps TODO: update to cloneElement
		children = React.Children.map(children, function(child){
			return React.cloneElement(child,{
				onClick:testClick.bind(self,child)
			});
		});
		return {
			children: children,
			activedescendant: activedescendant,
			isEmpty: isEmpty
		};
	},

	getClassName: function () {
		var className = addClass(this.props.className, 'bCombobox');
		if (this.state.isOpen) {
			className = addClass(className, 'mOpen');
		}
		return className;
	},

	/**
	 * When the user begins typing again we need to clear out any state that has
	 * to do with an existing or potential selection.
	 */
	clearSelectedState: function (cb) {
		this.props.binding.set('inputValue', null);

		this.setState({
			focusedIndex: null,
			inputValue: null,
			value: null,
			matchedAutocompleteOption: null,
			activedescendant: null
		}, cb);
	},
	handleClick: function() {
		var self = this;
		self.props.onFocus && self.props.onFocus();
		this.showList();
	},
	handleInputChange: function (event) {
		var value = this.refs.input.value;
		this.clearSelectedState(function () {
			this.setState({
				inputValue: value
			});
			this.props.binding.set('inputValue', value);


			this.props.onInput(value);
			if (!this.state.isOpen) {
				this.showList();
			}
		}.bind(this));
	},

	handleInputBlur: function (evt) {
		var focusedAnOption = this.state.focusedIndex != null;
		if (focusedAnOption) {
			return;
		}
		this.maybeSelectAutocompletedOption();
		this.hideList();
	},

	handleOptionBlur: function () {
		// don't want to hide the list if we focused another option
		this.blurTimer = setTimeout(this.hideList, 0);
	},

	handleOptionFocus: function () {
		// see `handleOptionBlur`
		clearTimeout(this.blurTimer);
	},

	handleInputKeyUp: function (event) {
		if (
			this.state.menu.isEmpty ||
				// autocompleting while backspacing feels super weird, so let's not
			event.keyCode === 8 /*backspace*/ || !this.props.autocomplete.match(/both|inline/)
		) {
			return;
		}
		this.autocompleteInputValue();
	},

	/**
	 * Autocompletes the input value with a matching label of the first
	 * ComboboxOption in the list and selects only the fragment that has
	 * been added, allowing the user to keep typing naturally.
	 */
	autocompleteInputValue: function () {
		if (
			this.props.autocomplete == false ||
			this.props.children.length === 0
		) {
			return;
		}
		var input = this.refs.input;
		var inputValue = input.value;
		var firstChild = this.props.children.length ?
			this.props.children[0] :
			this.props.children;
		var label = getLabel(firstChild);
		var fragment = matchFragment(inputValue, label);
		if (!fragment) {
			return;
		}
		input.value = label;
		input.setSelectionRange(inputValue.length, label.length);
		this.setState({matchedAutocompleteOption: firstChild});
	},

	handleButtonClick: function () {
		this.state.isOpen ? this.hideList() : this.showList();
		this.focusInput();
	},

	showList: function () {
		if (this.props.autocomplete.match(/both|list/)) {
			this.setState({isOpen: true});
		}
	},

	hideList: function () {
		this.setState({isOpen: false});
	},

	hideOnEscape: function () {
		this.hideList();
		this.focusInput();
	},

	focusInput: function () {
		this.refs.input.focus();
	},

	selectInput: function () {
		this.refs.input.select();
	},

	inputKeydownMap: {
		38: 'focusPrevious',
		40: 'focusNext',
		27: 'hideOnEscape',
		13: 'selectOnEnter'
	},

	optionKeydownMap: {
		38: 'focusPrevious',
		40: 'focusNext',
		13: 'selectOption',
		27: 'hideOnEscape'
	},

	handleKeydown: function (event) {
		var handlerName = this.inputKeydownMap[event.keyCode];
		if (!handlerName) {
			return
		}
		event.preventDefault();
		this.setState({usingKeyboard: true});
		this[handlerName].call(this);
	},

	handleOptionKeyDown: function (child, event) {
		var handlerName = this.optionKeydownMap[event.keyCode];
		if (!handlerName) {
			// if the user starts typing again while focused on an option, move focus
			// to the input, select so it wipes out any existing value
			this.selectInput();
			return;
		}
		event.preventDefault();
		this.setState({usingKeyboard: true});
		this[handlerName].call(this, child);
	},

	handleOptionMouseEnter: function (index) {
		if (this.state.usingKeyboard) {
			this.setState({usingKeyboard: false});
		} else {
			this.focusOptionAtIndex(index);
		}
	},

	selectOnEnter: function () {
		this.maybeSelectAutocompletedOption();
		this.refs.input.select();
	},

	maybeSelectAutocompletedOption: function () {
		if (!this.state.matchedAutocompleteOption) {
			return;
		}
		this.selectOption(this.state.matchedAutocompleteOption, {focus: false});
	},

	selectOption: function (child, options) {
		var self = this;
		options = options || {};
		this.props.binding.set('inputValue', getLabel(child));

		self.setState({
			value: child.props.value,
			inputValue: getLabel(child),
			matchedAutocompleteOption: null
		}, function () {
			self.props.onSelect(child.props.value, child);
			this.hideList();
			if (options.focus !== false) {
				this.selectInput();
			}

			if (self.props.clearAfterSelect) {
				self.props.binding.set('inputValue', '');
				this.selectInput();
			}
		}.bind(this));
	},

	focusNext: function () {
		if (this.state.menu.isEmpty) {
			return;
		}
		var index = this.state.focusedIndex == null ?
			0 : this.state.focusedIndex + 1;
		this.focusOptionAtIndex(index);
	},

	focusPrevious: function () {
		if (this.state.menu.isEmpty) {
			return;
		}
		var last = this.props.children.length - 1;
		var index = this.state.focusedIndex == null ?
			last : this.state.focusedIndex - 1;
		this.focusOptionAtIndex(index);
	},

	focusSelectedOption: function () {
		var selectedIndex;
		React.Children.forEach(this.props.children, function (child, index) {
			if (child.props.value === this.state.value) {
				selectedIndex = index;
			}
		}.bind(this));
		this.showList();
		this.setState({
			focusedIndex: selectedIndex
		}, this.focusOption);
	},

	findInputValue: function (value) {
		value = value || this.props.value;
		// TODO: might not need this, we should know this in `makeMenu`
		var inputValue;
		React.Children.forEach(this.props.children, function (child) {
			if (child.props.value === value) {
				inputValue = getLabel(child);
			}
		});
		return inputValue || '';
	},

	focusOptionAtIndex: function (index) {
		if (!this.state.isOpen && this.state.value) {
			return this.focusSelectedOption();
		}
		this.showList();
		var length = this.props.children.length;
		if (index === -1) {
			index = length - 1;
		} else if (index === length) {
			index = 0;
		}
		this.setState({
			focusedIndex: index
		}, this.focusOption);
	},

	focusOption: function () {
		var index = this.state.focusedIndex;

		if (this.refs.list.childNodes[index]) {
			this.refs.list.childNodes[index].focus();
		}
	},
	//mixins: [Morearty.Mixin],
	render: function () {
		var self = this,
			childrenToCheck = self.props.children,
			childrensCount = childrenToCheck.length,
			defaultInputState = '';

		// Костыль, позволяющий устанавливать начальное значение асинхронно, требуется из-за плохой совместимости с Morearty
		if (!self.defaulInputLabel && self.props.value) {
			if (childrenToCheck.length) {
				childrenToCheck = childrenToCheck[0];
			}

			if (childrenToCheck.props && childrenToCheck.props.value) {
				self.defaulInputLabel = self.props.value;
				defaultInputState = self.findInputValue(self.props.value);
				/*self.setState({
					inputValue: self.findInputValue(self.props.value)
				});  */
			}
		}
		return (
			<div className={this.getClassName()}>
				<input
					ref="input"
					className="eCombobox_input"
					defaultValue={this.props.value}
					value={self.props.binding.get('inputValue') || defaultInputState}
					onChange={this.handleInputChange}
					onKeyDown={this.handleKeydown}
					onKeyUp={this.handleInputKeyUp}
					onClick={this.handleClick}
					role="combobox"
                    placeholder={self.props.placeholderText || ''}
					aria-activedescendant={this.state.menu.activedescendant}
					aria-autocomplete={this.props.autocomplete}
					aria-owns={this.state.listId}
				/>
				<span
					aria-hidden="true"
					className="eCombobox_button"
					onClick={this.handleButtonClick}
				>▾</span>
				<div
					id={this.state.listId}
					ref="list"
					className="eCombobox_list"
					aria-expanded={this.state.isOpen + ''}
					role="listbox"
				>{this.state.menu.children}</div>
			</div>
		);
	}
});

function getLabel(component) {
	var hasLabel = component.props.label != null;
	return hasLabel ? component.props.label : component.props.children;
}

function matchFragment(userInput, firstChildLabel) {
	userInput = userInput.toLowerCase();
	firstChildLabel = firstChildLabel.toLowerCase();
	if (userInput === '' || userInput === firstChildLabel) {
		return false;
	}
	if (firstChildLabel.toLowerCase().indexOf(userInput.toLowerCase()) === -1) {
		return false;
	}
	return true;
}

