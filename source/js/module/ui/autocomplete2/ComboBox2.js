/**
 * Created by wert on 26.01.16.
 */

/** using bluebird promise cancellation here, though this is not cleaner way I believe */

const	React	= require('react'),
		Lazy	= require('lazy.js');

const ComboBox2 = React.createClass({

	isMouseDown: false,

	propTypes: {
		/** piece of data to display as initial portion */
		defaultItem:		React.PropTypes.object,
		/**
		 * Placeholder text displayed when input area is empty
		 */
		placeholder:		React.PropTypes.string,
		/**
		 * True when combobox expect data from an async request
		 */
		isLoading:			React.PropTypes.bool,
		/**
		 * Function that return sync and async result of search.
		 * @param searchText - text for search request
		 * @returns {sync:[...], async:Promise}
		 */
		searchFunction:		React.PropTypes.func,
		/**
		 * Call when user click on element in list.
		 * @param id 		- element id from search result
		 * @param element	- element from search result
		 */
		onSelect:			React.PropTypes.func,
		onEscapeSelection:	React.PropTypes.func,
		/**
		 * Function return element representaition in combobox list.
		 * @param element - element from search result.
		 * @returns text element representation
		 */
		getElementTitle:	React.PropTypes.func.isRequired,
		getElementTooltip:	React.PropTypes.func,
		clearAfterSelect:	React.PropTypes.bool,
		extraCssStyle:		React.PropTypes.string,
		/**
		 * Combobox doesn't react on click if true.
		 * False by default.
		 */
		isBlocked:			React.PropTypes.bool
	},
	getInitialState: function(){
		return {
			dataList:				[],
			isLoading:				false,
			isOpen:					false,
			prevText:				'',
			currentText:			undefined,
			currentTooltip:			undefined,
			currentIndex:			undefined,
			currentAsyncRequest:	undefined
		};
	},
	getDefaultProps: function(){
		return {
			isBlocked: false
		};
	},
	componentDidMount: function () {
		window.addEventListener('mousedown', this.handlePageClick, false);
	},
	componentWillUnmount: function() {
		window.removeEventListener('mousedown', this.handlePageClick);
	},
	handlePageClick: function() {
		if (!this.isMouseDown) {
			this.closeMenu();
			this.restorePrevSelectedText();
		}
	},
	handleMouseUp: function() {
		this.isMouseDown = false;
	},
	handleMouseDown: function() {
		this.isMouseDown = true;
	},
	/** Checks on mount if we need to set default item */
	componentWillMount: function(){
		if(this.props.defaultItem && this.props.onSelect) {
			this.props.onSelect(this.props.defaultItem.id, this.props.defaultItem);
			if(typeof this.props.defaultItem !== "undefined" && typeof this.props.getElementTooltip !== "undefined") {
				this.setState({
					currentTooltip: this.props.getElementTooltip(this.props.defaultItem)
				});
			}
		}
	},
	/** Checks on new props if we need to set default item */
	componentWillReceiveProps: function(nextProps) {
		/* eliminating infinite looping by checking if really props update take place */
		if(nextProps.defaultItem && nextProps.onSelect && JSON.stringify(nextProps.defaultItem) !== JSON.stringify(this.props.defaultItem)) {
			nextProps.onSelect(nextProps.defaultItem.id, nextProps.defaultItem);
			/**
			 * Change current text (value in input field) on props.defaultItem, if received new props.defaultItem
			 */
			this.setState({currentText: this.props.getElementTitle(nextProps.defaultItem)});
			if(typeof nextProps.getElementTooltip !== "undefined") {
				this.setState({
					currentTooltip: nextProps.getElementTooltip(nextProps.defaultItem)
				});
			}
		}
	},
	/** Calculates current text.
	 *  If there is some text in state will return it,
	 *  otherwise fallback to initialValue from props,
	 *  otherwise just ''
	 * @returns {*|string}
	 */
	getCurrentText: function(){
		switch (true) {
			case typeof this.state.currentText !== 'undefined':
				return this.state.currentText;
			case typeof this.props.defaultItem !== 'undefined':
				return this.props.getElementTitle(this.props.defaultItem);
			default:
				return '';
		}
	},
	/**
	 * Will trigger on input end. Strictly saying on focus loose.
	 * @param event
	 */
	onChange: function(event){
		const self = this;

		self.props.onEscapeSelection();
		self.search(event.target.value);
	},
	search: function(searchText) {
		const self = this;

		if(searchText !== null && searchText !== undefined) {
			const searchResult  = self.props.searchFunction(searchText);

			self.state.currentAsyncRequest && self.state.currentAsyncRequest.cancel();

			self.setState({
				isLoading: 				typeof searchResult.async !== 'undefined',      // if there is something to load - mark ourself as loading
				currentAsyncRequest:	searchResult.async,                             // storing promise to be able reject it later
				dataList:				searchResult.sync,
				currentText:			searchText,
				currentIndex:			undefined
			});
			searchResult.async.then((data) => {
				self.setState({
					isLoading:	false,
					isOpen:		true,
					dataList:	self.state.dataList.concat(data)
				});
			});
		}
	},
	onKeyUp: function(e){
		const self = this;
		let currentIndex = self.state.currentIndex;

		switch (e.key) {
			case 'Enter':
				if(self.state.isOpen && currentIndex !== undefined) {
					self.selectElement(currentIndex);
					self.closeMenu();
				} else {
					self.search(self.getCurrentText());
				}
				break;
			case 'Escape':
				if(self.state.isOpen) {
					self.restorePrevSelectedText();
					self.closeMenu();
				}
				break;
			case 'ArrowUp':
				if(!self.state.isOpen) {
					self.search(self.getCurrentText());
				} else {
					if(currentIndex === undefined || currentIndex  === 0) {
						currentIndex = self.state.dataList.length - 1;
					} else {
						currentIndex -= 1;
					}
				}
				self.markElement(currentIndex);
				break;
			case 'ArrowDown':
				if(!self.state.isOpen) {
					self.search(self.getCurrentText());
				} else {
					if(currentIndex === undefined || currentIndex + 1 === self.state.dataList.length) {
						currentIndex = 0;
					} else {
						currentIndex += 1;
					}
				}
				self.markElement(currentIndex);
				break;
		}
	},
	/**
	 * Restore prev text. So if user press escape button we should show prev request.
	 */
	restorePrevSelectedText: function() {
		const self = this;

		self.setState({
			currentText		: self.state.prevText,
			prevText		: undefined,
			currentIndex	: undefined
		});
	},
	/**
	 * Select element in datalist. Strictly saying trigger props.onSelect function and clear dataList and currentIndex     *
	 * @param index - index of selected element
	 */
	selectElement: function(index) {
		const self			= this,
			currentElement	= self.state.dataList[index];

		self.props.onSelect(currentElement.id, currentElement);
		if(self.props.clearAfterSelect) {
			self.setState({
				dataList:		[],
				currentIndex:	undefined,
				currentText:	''
			});
		} else {
			self.setState({
				dataList		: [],
				currentIndex	: undefined,
				currentText		: self.props.getElementTitle(self.state.dataList[index]),
				currentTooltip	: self.props.getElementTooltip(self.state.dataList[index])
			});
		}

	},
	/**
	 * Mark element in data list
	 * @param index
	 */
	markElement: function(index) {
		const self = this;

		self.setState({
			currentIndex: index,
			currentText:  self.props.getElementTitle(self.state.dataList[index])
		});
	},
	/**
	 * Handles left mouse button click on text input
	 */
	onInputClick: function() {
		if(!this.props.isBlocked) {
			const currentText = this.getCurrentText();

			this.setState({prevText: currentText});
			this.search(currentText);
		}
	},
	/**
	 * Handles left mouse button click on triangle button
	 */
	onTriangleClick: function(){
		const self = this;

		if(!this.props.isBlocked && !self.state.isOpen) {
			self.refs.input.focus();
			self.refs.input.click();
		}
	},
	/**
	 * Handles left mouse button click on list element
	 * @param index - index of element from data list
	 */
	onListItemClick: function(index){
		const self = this;

		self.selectElement(index);
		self.closeMenu();
	},
	onBlur: function(){
		const self = this;

		self.closeMenu();
	},
	/**
	 * Toggle dropdown menu: show/hidden
	 */
	toggleMenu: function(){
		const self = this;

		if(self.canOpenMenu()) {
			self.openMenu();
		} else if(self.state.isOpen) {
			self.closeMenu();
		}
	},
	/**
	 * Open dropdown menu
	 */
	openMenu: function(){
		const self = this;

		self.setState({
			isOpen: true
		});
	},
	/**
	 * Close dropdown menu
	 */
	closeMenu: function(){
		const self = this;

		self.setState({
			isOpen: false
		});
	},
	/**
	 * Will check if it's possible to open menu?
	 * @returns {boolean}
	 */
	canOpenMenu: function() {
		const self = this;

		return !self.state.isOpen && self.state.dataList !== undefined && self.state.dataList.length !== 0;
	},
	renderMenuItems: function() {
		const self = this;

		if(self.state.dataList.length == 0) {
			return (
				<div className="eCombobox_list" role="listbox">
					<div className='eCombobox_option'>
						No matches found
					</div>
				</div>
			);
		} else {
			return (
				<div className="eCombobox_list" role="listbox">
					{self.state.dataList.map(self.renderMenuItem)}
				</div>
			);
		}
	},
	getMenuItemText: function(currentMenuItem) {
		const	title		= this.props.getElementTitle(currentMenuItem),
				tooltip 	= typeof this.props.getElementTooltip !== 'undefined' ? this.props.getElementTooltip(currentMenuItem) : '';

		return `${title}${tooltip}`;
	},
	renderMenuItem: function(data){
		const self = this;
		let cssStyle = 'eCombobox_option';

		const index = Lazy(self.state.dataList).indexOf(data);

		if(index === self.state.currentIndex) {
			cssStyle += " mSelected";
		}

		const key = data.id ? data.id : self.props.getElementTitle(data);
		return (
			<div key={key} className={cssStyle} onMouseDown={self.onListItemClick.bind(self, index)}>
				{this.getMenuItemText(data)}
			</div>
		);
	},
	getPlaceHolder: function() {
		const   self = this;

		if(self.getCurrentText() === '') {
			return self.props.placeholder;
		} else {
			return undefined;
		}
	},
	getExtraCssStyle: function() {
		const self = this;

		return typeof self.props.extraCssStyle !== 'undefined' ? self.props.extraCssStyle : '';
	},
	getComboboxCssStyle: function() {
		const self = this;

		return "bCombobox " + self.getExtraCssStyle();
	},
	getLoaderCssStyle: function() {
		const self = this;

		return "eCombobox_loader " + self.getExtraCssStyle();
	},
	getTriangleButtonCssStyle: function() {
		const self = this;

		return "eCombobox_button " + self.getExtraCssStyle();
	},
	getInputCssStyle: function() {
		const self = this;

		return "eCombobox_input " + self.getExtraCssStyle();
	},
	getInputText: function() {
		if(this.state.isOpen) {
			return this.getCurrentText();
		} else {
			const tooltip = typeof this.state.currentTooltip !== 'undefined' ? this.state.currentTooltip : '';
			return this.getCurrentText() + tooltip;
		}
	},
	render: function(){
		const	self			= this,
				placeholder 	= self.getPlaceHolder(),
				value			= self.getInputText(),
				isOpenCN 		= self.state.isOpen === true ? 'mOpen' : '';

		const hintStyle = {
			position:	'absolute',
			opacity:	0,
			color:		"#ccd6dd",
			tabIndex:	-1
		};
		const inputStyle = {
			position: 'relative'
		};
		// this will act instead of loader spinner for a while
		const loaderStyle = {
			display: self.state.isLoading ? undefined : "none"
		};
		const triangleStyle = {
			display: !self.state.isLoading ? 'inline-block' : "none"
		};

		return (
			<div	className	= {`${this.getComboboxCssStyle()} ${isOpenCN}`}
					onMouseDown	= {this.handleMouseDown}
					onMouseUp	= {this.handleMouseUp}
			>
				<div className="eCombobox_inputContainer">
					<input	type			= 'text'
							style			= { hintStyle }
							defaultValue	= { placeholder }
							readOnly
					/>
					<input  style		= {inputStyle}
							ref			= "input"
							className	= {self.getInputCssStyle()}
							placeholder	= {placeholder}
							value		= {value}
							onChange	= {self.onChange}
							onKeyUp		= {self.onKeyUp}
							onClick		= {self.onInputClick}
							role		= "combobox"
					/>
					<img className		= {self.getLoaderCssStyle()}
						 style			= {loaderStyle}
						 src			= "/images/spinner.gif"
					/>
				</div>
				<div
					className	= {self.getTriangleButtonCssStyle()}
					style		= {triangleStyle}
					onClick		= {self.onTriangleClick}
				>
				</div>
				{self.renderMenuItems()}
			</div>
		);
	}
});

module.exports = ComboBox2;
