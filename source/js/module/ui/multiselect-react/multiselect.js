/**
 * Created by Anatoly on 08.08.2016.
 */

const   classNames  = require('classnames'),
        React 		= require('react');

const MultiSelectReact = React.createClass({
	displayName: 'MultiSelectReact',
	propTypes: {
		items: React.PropTypes.array.isRequired,
		selections: React.PropTypes.array,
		placeholder: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		onFilterChange: React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			items: [],
			placeholder: 'Enter some filter text'
		}
	},
	componentWillMount: function () {
		this.init(this.props);
	},
	componentWillReceiveProps: function (nextProps) {
		this.init(nextProps);
	},
	init: function (props) {
		const items = props.items || [],
			selections = props.selections || [];

		this.setState({
			items: items,
			selections: selections,
			filter: '',
			count: selections.length
		});
	},
	handleItemClick: function (item) {
		const selected = this.state.selections.indexOf(item.key) !== -1;

		this.setSelected(item, !selected);
	},
	handleFilterChange: function (event) {
		// Keep track of every change to the filter input
		const state = this.state;

		state.filter = event.target.value;
		this.setState(state);
	},
	escapeRegExp: function (str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	},
	createItem: function (item) {
		const selected = this.state.selections.indexOf(item.key) !== -1,
			classes = classNames({
				eMultiSelect_item: true,
				mSelected: selected
			});

		return (
			<li key={item.key} className={classes} onClick={this.handleItemClick.bind(null, item)}>
				{item.value}
			</li>
		);
	},
	selectAll: function () {
		this.setSelected(this.props.items, true)
	},
	selectNone: function () {
		this.setSelected(this.props.items, false)
	},
	setSelected: function (items, selected) {
		// Accept an array or a single item
		if (!(items instanceof Array)) items = [items];

		const self = this,
			state = self.state;

		items.forEach(item => {
			if (selected && state.selections.indexOf(item.key) === -1) {
				state.selections.push(item.key);
			} else if (!selected && state.selections.indexOf(item.key) !== -1) {
				state.selections = state.selections.filter(key => key !== item.key);
			}
		});

		self.setState(state);
		self.props.onChange(state.selections);
	},
	render: function () {
		const self = this,
			state = self.state,
			count = state.selections.length;

		return (
			<div className={"bMultiSelect " + self.props.className}>
				<input onChange={this.handleFilterChange} value={state.filter} placeholder={this.props.placeholder}/>
				<ul>
					{state.items.map(this.createItem)}
				</ul>
				<button onClick={this.selectAll}>Select all</button>
				{count > 0 ?
					<button onClick={this.selectNone}>{'Unselect all(' + count + ')'}</button>
					: null}
			</div>
		)
	}
});

module.exports = MultiSelectReact;