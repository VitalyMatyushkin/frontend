import * as React from 'react';

import 'styles/ui/dropdown/dropdown.scss'

export interface Item {
	id: string,
	element: any
}

export interface DropdownProps {
	extraStyle?: string
	placeholder?: string
	selectedItemId?: string,
	handleClickItem: (id) => void
	items: Item[]
}

interface DropdownState {
	isOpen: boolean
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {
	componentWillMount() {
		this.setState({isOpen: false});
	}
	getExtraStyle() {
		return typeof this.props.extraStyle !== 'undefined' ? ' ' + this.props.extraStyle : '';
	}
	handleClickItem(id: string) {
		this.props.handleClickItem(id);
		this.setState({isOpen: false});
	}
	handleClick() {
		if(this.state.isOpen) {
			this.setState({isOpen: false});
		} else {
			this.setState({isOpen: true});
		}
	}
	handleBlur() {
		this.setState({isOpen: false});
	}
	renderItem(item: Item) {
		return (
			<div
				key={item.id}
				className={'eSimpleDropdown_item' + this.getExtraStyle()}
				onMouseDown={() => this.handleClickItem(item.id)}
			>
				{item.element}
			</div>
		);
	}
	renderSelectedItem() {
		const selectedItem = this.props.items.find(item => item.id === this.props.selectedItemId)

		if(typeof selectedItem !== 'undefined') {
			return selectedItem.element;
		} else {
			return (
				<div>{this.props.placeholder}</div>
			);
		}
	}
	renderDropdown() {
		if(this.state.isOpen) {
			return (
				<div className={'eSimpleDropdown_dropdown' + this.getExtraStyle()}>
					{this.props.items.map(item => this.renderItem(item))}
				</div>
			);
		} else {
			return null;
		}
	}
	render() {
		return (
			<div
				className={'bSimpleDropdown' + this.getExtraStyle()}
		        onBlur={() => this.handleBlur()}
			>
				<button
					className={'eSimpleDropdown_selected' + this.getExtraStyle()}
					onClick={() => this.handleClick()}
					onBlur={() => this.handleBlur()}
				>
					{this.renderSelectedItem()}
				</button>
				<div
					className='eSimpleDropdown_triangle'
					onClick={() => this.handleClick()}
					onBlur={() => this.handleBlur()}
				/>
				{this.renderDropdown()}
			</div>
		);
	}
}