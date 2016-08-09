/**
 * Created by Anatoly on 08.08.2016.
 */

const   classNames  = require('classnames'),
        React 		= require('react');

const MultiSelectReact = React.createClass({
    displayName: 'MultiSelect react',
	propTypes:{
		items: 			React.PropTypes.array,
		selections: 	React.PropTypes.array,
		placeholder: 	React.PropTypes.string,
		onChange: 		React.PropTypes.func.isRequired,
		onFilterChange: React.PropTypes.func
	},
    getDefaultProps: function() {
        return {
            items: 			[],
            placeholder: 	'Enter some filter text'
        }
    },
    componentWillMount:function(){
        const   self   		= this,
				items 		= self.props.items || [],
				selections 	= self.props.selections || [];

		self.setState({
			items: 		items,
			selections: selections,
			filter:		'',
			count: 		selections.length
		});
    },
    handleItemClick: function(item) {
        const   self     =   this,
                selected =   self.state.selections.indexOf(item.id)!==-1;

        self.setSelected(item, !selected);
    },
    handleFilterChange: function(event) {
        // Keep track of every change to the filter input
        const   self    = this,
				state 	= self.state;

		state.filter = event.target.value;
        self.setState(state);
    },
    escapeRegExp: function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    createItem: function(item) {
		const 	selected = this.state.selections.indexOf(item.id) !== -1,
				classes = classNames({
					eMultiSelect_item: true,
					mSelected: selected
				});

		return (
			<li key={item.id} className={classes} onClick={this.handleItemClick(item)}>
				{this.props.text}
			</li>
		);
    },
    selectAll: function() {
        this.setSelected(this.props.items, true)
    },
    selectNone: function() {
        this.setSelected(this.props.items, false)
    },
    setSelected: function(items, selected) {
        // Accept an array or a single item
        if (!(items instanceof Array)) items = [items];

		const   self    = this,
				state 	= self.state;

		items.forEach(item => {
            if (selected && state.selections.indexOf(item.id) === -1) {
				state.selections.push(item.id);
            } else if (!selected && state.selections.indexOf(item.id) !== -1) {
				state.selections = state.selections.filter(function (itemId) {
                    return itemId !== item.id;
                });
            }
        });

		self.setState(state);
        self.props.onChange(selections);
    },
    render: function() {
		const   self    = this,
				state 	= self.state,
              	count 	= state.selections.length;
        return (
            <div className="bMultiSelect">
                <input onChange={this.handleFilterChange} value={state.filter} placeholder={this.props.placeholder} />
                <ul>
					{state.items.map(this.createItem)}
				</ul>
                <button onClick={this.selectAll}>Select all</button>&nbsp;
                {count > 0 ?
                    <button onClick={this.selectNone}>{'Unselect all(' + count + ')'}</button>
                : null}
            </div>
        )
    }
});

module.exports = MultiSelectReact;