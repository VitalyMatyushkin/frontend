/**
 * Created by Anatoly on 08.08.2016.
 */

import * as classNames from 'classnames';
import * as React from 'react';

export interface MultiselectReactProps {
	items:			Item[]
	selections?:	string[]					// keys of what selected
	placeholder?:	string
	onChange:		(selections: string[]) => void
	onFilterChange?: () => void
	id?: string,
	className: string
}

interface MultiselectReactState {
	items:		Item[]
	selections:	string[]
	filter:		string
}

export interface Item {
	key: string
	value: string
}

export class MultiselectReact extends React.Component<MultiselectReactProps, MultiselectReactState> {

	public static defaultProps: Partial<MultiselectReactProps> = {
		items: [],
		placeholder: 'Enter some filter text'
	};

	constructor(props: MultiselectReactProps) {
		super(props);
	}

	componentWillMount() {
		this.init(this.props);
	}

	componentWillReceiveProps(nextProps: MultiselectReactProps) {
		this.init(nextProps);
	}

	init(props: MultiselectReactProps): void {
		const	items		= props.items || [],
				selections	= props.selections || [],
				filter		= this.state && this.state.filter || '';

		this.setState({
			items: items.filter(item => item.value.toLowerCase().indexOf(filter.toLowerCase()) !== -1),
			selections: selections,
			filter: filter
		});
	}

	handleItemClick(item: Item): void {
		const selected = this.state.selections.indexOf(item.key) !== -1;

		this.setSelected(item, !selected);
	}

	handleFilterChange(event) {
		// Keep track of every change to the filter input
		const	state = this.state,
				val = event.target.value,
				items = this.props.items.filter(item => item.value.toLowerCase().indexOf(val.toLowerCase()) !== -1);

		(state as any).filter = val;
		(state as any).items = items;
		this.setState(state);
	}

	createItem(item: Item) {
		const selected = this.state.selections.indexOf(item.key) !== -1,
			classes = classNames({
				eMultiSelect_item: true,
				mSelected: selected
			});

		return (
			<li key={item.key} className={classes} onClick={() => this.handleItemClick(item)}>
				{item.value}
			</li>
		);
	}
	selectAll () {
		this.setSelected(this.state.items, true)
	}

	selectNone () {
		this.setSelected(this.props.items, false)
	}

	setSelected(items: Item | Item[], selected: boolean) {
		// Accept an array or a single item
		if (!(items instanceof Array)) items = [items];

		const state = this.state;

		items.forEach(item => {
			if (selected && state.selections.indexOf(item.key) === -1) {
				state.selections.push(item.key);
			} else if (!selected && state.selections.indexOf(item.key) !== -1) {
				(state as any).selections = state.selections.filter(key => key !== item.key);
			}
		});

		this.setState(state);
		this.props.onChange(state.selections);
	}
	render () {
		const	state = this.state,
				count = state.selections.length;

		return (
			<div className={"bMultiSelect " + this.props.className} id={this.props.id}>
				<input onChange={e => this.handleFilterChange(e)} value={state.filter} placeholder={this.props.placeholder}/>
				<ul>
					{state.items.map(item => this.createItem(item))}
				</ul>
				<button onClick={() => this.selectAll()}>Select all</button>
				{count > 0 ?
					<button onClick={() => this.selectNone()}>{'Unselect all(' + count + ')'}</button>
					: null}
			</div>
		)
	}
}
