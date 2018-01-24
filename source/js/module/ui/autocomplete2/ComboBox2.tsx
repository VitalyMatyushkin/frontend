/**
 * Created by wert on 26.01.16.
 */

/** using bluebird promise cancellation here, though this is not cleaner way I believe */

import * as React    	from 'react';
import * as Lazy    	from 'lazy.js';

interface SearchItem {
	sync:  	any[],
	async:	any
}

interface ComboBoxProps {
	/** piece of data to display as initial portion */
	defaultItem?:			any,
	/**
	 * Placeholder text displayed when input area is empty
	 */
	placeholder?:			string,
	/**
	 * True when combobox expect data from an async request
	 */
	isLoading?:				boolean,
	/**
	 * Function that return sync and async result of search.
	 * @param searchText - text for search request
	 * @returns {sync:[...], async:Promise}
	 */
	searchFunction?:		(text: string) => SearchItem,
	/**
	 * Call when user click on element in list.
	 * @param id 		- element id from search result
	 * @param element	- element from search result
	 */
	onSelect?:				(id: string, element: any) => void,
	onEscapeSelection?:		() => void,
	/**
	 * Function return element representaition in combobox list.
	 * @param element - element from search result.
	 * @returns text element representation
	 */
	getElementTitle:	(	elem: any) => string,
	getElementTooltip?:		(elem: any) => string,
	clearAfterSelect?:		boolean,
	extraCssStyle?:			string,
	/**
	 * Combobox doesn't react on click if true.
	 * False by default.
	 */
	isBlocked?:				boolean,
	customListItem?:		any,
	/**
	 * html id
	 */
	id?:					string
}

interface ComboBoxState {
	isMouseDown:			boolean,
	dataList:				any[],
	isLoading:				boolean,
	isOpen:					boolean,
	prevText:				string,
	currentText:			string,
	currentTooltip:			string,
	currentIndex:			number,
	currentAsyncRequest:	any
}

export class ComboBox2 extends React.Component<ComboBoxProps, ComboBoxState> {
	constructor(props) {
		super(props);
		this.state = {
			isMouseDown:			false,
			dataList:				[],
			isLoading:				false,
			isOpen:					false,
			prevText:				'',
			currentText:			undefined,
			currentTooltip:			undefined,
			currentIndex:			undefined,
			currentAsyncRequest:	undefined
		};
	}
	
	static defaultProps: Partial<ComboBoxProps> = {isBlocked: false};
	
	componentDidMount() {
		window.addEventListener('mousedown', this.handlePageClick.bind(this), false);
	}
	
	componentWillUnmount() {
		window.removeEventListener('mousedown', this.handlePageClick.bind(this));
	}
	
	handlePageClick(): void {
		if (!this.state.isMouseDown && this.state.isOpen) {
			this.closeMenu();
			this.restorePrevSelectedText();
		}
	}
	
	handleMouseUp(): void {
		this.setState({
			isMouseDown: false
		});
	}
	
	handleMouseDown(): void {
		this.setState({
			isMouseDown: true
		});
	}
	
	/** Checks on mount if we need to set default item */
	componentWillMount() {
		if(typeof this.props.defaultItem !== 'undefined' && typeof this.props.onSelect !== 'undefined') {
			this.setState({prevText: this.props.getElementTitle(this.props.defaultItem)});
			if(typeof this.props.getElementTooltip !== "undefined") {
				this.setState({
					currentTooltip: this.props.getElementTooltip(this.props.defaultItem)
				});
			}
		}
	}
	
	/** Checks on new props if we need to set default item */
	componentWillReceiveProps(nextProps) {
		// Eliminating infinite looping by checking if really props update take place
		if(nextProps.defaultItem && nextProps.onSelect && JSON.stringify(nextProps.defaultItem) !== JSON.stringify(this.props.defaultItem)) {
			
			// Change current text (value in input field) on props.defaultItem, if received new props.defaultItem
			this.setState({currentText: this.props.getElementTitle(nextProps.defaultItem)});
			if(typeof nextProps.getElementTooltip !== "undefined") {
				this.setState({
					currentTooltip: nextProps.getElementTooltip(nextProps.defaultItem)
				});
			}
		}
	}
	
	/** Calculates current text.
	 *  If there is some text in state will return it,
	 *  otherwise fallback to initialValue from props,
	 *  otherwise just ''
	 * @returns {*|string}
	 */
	getCurrentText(): string {
		switch (true) {
			case typeof this.state.currentText !== 'undefined':
				return this.state.currentText;
			case typeof this.props.defaultItem !== 'undefined':
				return this.props.getElementTitle(this.props.defaultItem);
			default:
				return '';
		}
	}
	
	/**
	 * Will trigger on input end. Strictly saying on focus loose.
	 * @param event
	 */
	onChange(event): void {
		this.props.onEscapeSelection();
		this.search(event.target.value);
	}
	
	search(searchText: string): void {
		if(searchText !== null && searchText !== undefined) {
			const searchResult  =this.props.searchFunction(searchText);
			
			this.state.currentAsyncRequest && this.state.currentAsyncRequest.cancel();
			
			this.setState({
				isLoading: 				typeof searchResult.async !== 'undefined',      // if there is something to load - mark ourself as loading
				currentAsyncRequest:	searchResult.async,                             // storing promise to be able reject it later
				dataList:				searchResult.sync,
				currentText:			searchText,
				currentIndex:			undefined
			});
			searchResult.async.then((data) => {
				this.setState({
					isLoading:	false,
					isOpen:		true,
					dataList:	this.state.dataList.concat(data)
				});
			});
		}
	}
	
	onKeyUp(e): void {
		let currentIndex = this.state.currentIndex;
		
		switch (e.key) {
			case 'Enter':
				if(this.state.isOpen && currentIndex !== undefined) {
					this.selectElement(currentIndex);
					this.closeMenu();
				} else {
					this.search(this.getCurrentText());
				}
				break;
			case 'Escape':
				if(this.state.isOpen) {
					this.restorePrevSelectedText();
					this.closeMenu();
				}
				break;
			case 'ArrowUp':
				if(!this.state.isOpen) {
					this.search(this.getCurrentText());
				} else {
					if(currentIndex === undefined || currentIndex  === 0) {
						currentIndex = this.state.dataList.length - 1;
					} else {
						currentIndex -= 1;
					}
					(this.refs['option_'+currentIndex] as any).scrollIntoViewIfNeeded(true);
				}
				this.markElement(currentIndex);
				break;
			case 'ArrowDown':
				if(!this.state.isOpen) {
					this.search(this.getCurrentText());
				} else {
					if(currentIndex === undefined || currentIndex + 1 === this.state.dataList.length) {
						currentIndex = 0;
					} else {
						currentIndex += 1;
					}
					(this.refs['option_'+currentIndex] as any).scrollIntoViewIfNeeded(false);
				}
				this.markElement(currentIndex);
				break;
		}
	}
	
	/**
	 * Restore prev text. So if user press escape button we should show prev request.
	 */
	restorePrevSelectedText(): void {
		this.setState({
			currentText		: this.state.prevText,
			prevText		: undefined,
			currentIndex	: undefined
		});
	}
	
	/**
	 * Select element in datalist. Strictly saying trigger props.onSelect function and clear dataList and currentIndex     *
	 * @param index - index of selected element
	 */
	selectElement(index: number): void {
		const currentElement	= this.state.dataList[index];
		
		this.props.onSelect(currentElement.id, currentElement);
		if(this.props.clearAfterSelect) {
			this.setState({
				dataList:		[],
				currentIndex:	undefined,
				currentText:	''
			});
		} else {
			this.setState({
				dataList		: [],
				currentIndex	: undefined,
				currentText		: this.props.getElementTitle(this.state.dataList[index]),
				currentTooltip	: this.props.getElementTooltip(this.state.dataList[index])
			});
		}
		
	}
	
	/**
	 * Mark element in data list
	 * @param index
	 */
	markElement(index: number): void {
		this.setState({
			currentIndex: index,
			currentText:  this.props.getElementTitle(this.state.dataList[index])
		});
	}
	
	/**
	 * Handles left mouse button click on text input
	 */
	onInputClick(): void {
		if(!this.props.isBlocked) {
			const currentText = this.getCurrentText();
			
			this.setState({prevText: currentText});
			this.search(currentText);
		}
	}
	
	/**
	 * Handles left mouse button click on triangle button
	 */
	onTriangleClick(): void {
		if(!this.props.isBlocked && !this.state.isOpen) {
			(this.refs.input as any).focus();
			(this.refs.input as any).click();
		}
	}
	
	/**
	 * Handles left mouse button click on list element
	 * @param index - index of element from data list
	 */
	onListItemClick(index: number): void {
		this.selectElement(index);
		this.closeMenu();
	}
	
	onBlur(): void {
		this.closeMenu();
	}
	
	/**
	 * Toggle dropdown menu: show/hidden
	 */
	toggleMenu(): void {
		if(this.canOpenMenu()) {
			this.openMenu();
		} else if(this.state.isOpen) {
			this.closeMenu();
		}
	}
	
	/**
	 * Open dropdown menu
	 */
	openMenu(): void {
		this.setState({
			isOpen: true
		});
	}
	
	/**
	 * Close dropdown menu
	 */
	closeMenu(): void {
		this.setState({
			isOpen: false
		});
	}
	
	/**
	 * Will check if it's possible to open menu?
	 * @returns {boolean}
	 */
	canOpenMenu(): boolean {
		return !this.state.isOpen && this.state.dataList !== undefined && this.state.dataList.length !== 0;
	}
	
	renderMenuItems() {
		switch (true) {
			case this.state.dataList.length == 0:
				return (
					<div className="eCombobox_list" role="listbox">
						<div className='eCombobox_option'>
							No matches found
						</div>
					</div>
				);
			case typeof this.props.customListItem === 'undefined':
				return (
					<div className="eCombobox_list" role="listbox">
						{this.state.dataList.map(this.renderMenuItem.bind(this))}
					</div>
				);
			case typeof this.props.customListItem !== 'undefined':
				return (
					<div className="eCombobox_list" role="listbox">
						{this.state.dataList.map(this.renderCustomMenuItem.bind(this))}
					</div>
				);
		}
	}
	
	getMenuItemText(currentMenuItem: number): string {
		const	title		= this.props.getElementTitle(currentMenuItem),
				tooltip 	= typeof this.props.getElementTooltip !== 'undefined' ? this.props.getElementTooltip(currentMenuItem) : '';
		
		return `${title}${tooltip}`;
	}
	
	renderMenuItem(data: any) {
		let cssStyle = 'eCombobox_option';
		
		const index = Lazy(this.state.dataList).indexOf(data);
		
		if(index === this.state.currentIndex) {
			cssStyle += " mSelected";
		}
		
		const key = data.id ? data.id : this.props.getElementTitle(data);
		return (
			<div key={key} ref={'option_'+index} className={cssStyle} onMouseDown={this.onListItemClick.bind(this, index)}>
				{this.getMenuItemText(data)}
			</div>
		);
	}
	
	renderCustomMenuItem(data: any) {
		const index	= Lazy(this.state.dataList).indexOf(data);
		
		const isSelected = index === this.state.currentIndex;
		
		const	props = {
				key			: data.id ? data.id : this.props.getElementTitle(data),
				isSelected	: isSelected,
				onMouseDown	: this.onListItemClick.bind(this, index),
				data		: data
			},
			customMenuItem = React.createElement(this.props.customListItem, props);
		
		return customMenuItem;
	}
	
	getPlaceHolder(): string {
		if(this.getCurrentText() === '') {
			return this.props.placeholder;
		} else {
			return undefined;
		}
	}
	
	getExtraCssStyle(): string {
		return typeof this.props.extraCssStyle !== 'undefined' ? this.props.extraCssStyle : '';
	}
	
	getComboboxCssStyle(): string {
		return "bCombobox " + this.getExtraCssStyle();
	}
	
	getLoaderCssStyle(): string {
		return "eCombobox_loader " + this.getExtraCssStyle();
	}
	
	getTriangleButtonCssStyle(): string {
		return "eCombobox_button " + this.getExtraCssStyle();
	}
	
	getInputCssStyle(): string {
		return "eCombobox_input " +this.getExtraCssStyle();
	}
	
	getInputText(): string {
		if(this.state.isOpen) {
			return this.getCurrentText();
		} else {
			const tooltip = typeof this.state.currentTooltip !== 'undefined' ? this.state.currentTooltip : '';
			return this.getCurrentText() + tooltip;
		}
	}
	
	render(){
		const	placeholder	= this.getPlaceHolder(),
				value		= this.getInputText(),
				isOpenCN	= this.state.isOpen === true ? 'mOpen' : '';
		
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
			display: this.state.isLoading ? undefined : "none"
		};
		const triangleStyle = {
			display: !this.state.isLoading ? 'inline-block' : "none"
		};
		
		return (
			<div
				className	= {`${this.getComboboxCssStyle()} ${isOpenCN}`}
				id			= {this.props.id}
				onMouseDown	= {this.handleMouseDown.bind(this)}
				onMouseUp	= {this.handleMouseUp.bind(this)}
			>
				<div className="eCombobox_inputContainer">
					<input
						style			= {(hintStyle as any)}
						type			= 'text'
						defaultValue	= {placeholder}
						readOnly
					/>
					<input
						style			= {(inputStyle as any)}
						ref				= "input"
						className		= {this.getInputCssStyle()}
						placeholder		= {placeholder}
						value			= {value}
						onChange		= {this.onChange.bind(this)}
						onKeyUp			= {this.onKeyUp.bind(this)}
						onClick			= {this.onInputClick.bind(this)}
						role			= "combobox"
						disabled		= {this.props.isBlocked}
					/>
					<img
						className		= {this.getLoaderCssStyle()}
						style			= {loaderStyle}
						src				= "/images/spinner.gif"
					/>
				</div>
				<div
					className	= {this.getTriangleButtonCssStyle()}
					style		= {triangleStyle}
					onClick		= {this.onTriangleClick.bind(this)}
				>
				</div>
				{this.renderMenuItems()}
			</div>
		);
	}
}