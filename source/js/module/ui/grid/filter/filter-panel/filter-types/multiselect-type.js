/**
 * Created by Anatoly on 09.08.2016.
 */

const 	React 		= require('react'),
		classNames  = require('classnames'),
		MultiSelect = require('module/ui/multiselect-react/multiselect');

const FilterMultiSelectType = React.createClass({
	propTypes: {
		filterField: React.PropTypes.object.isRequired
	},
	componentWillMount:function(){
		this.model = new MultiSelectModel(this.props.filterField);
		this.model.onLoad = this.onLoad;
		this.model.loadData();
	},
	onLoad:function(){
		this.setState({model:this.model});
	},
	onChange:function(data){
		this.model.setSelections(data);
		this.setState({model:this.model});
	},
	render: function() {
		const 	model 		= this.model,
				items 		= model.items,
				selections 	= model.getSelections(),
				id			= model.filterField.id,
				classes = classNames({
					mHideFilter: model.hideFilter,
					mHideButtons: model.hideButtons
				});

		return (
			<MultiSelect items={items} selections={selections} onChange={this.onChange} id={id} className={classes} />
		);
	}
});

const MultiSelectModel = function(filterField){
	const options = filterField.typeOptions;

	this.filterField = filterField;
	this.getDataPromise = options.getDataPromise;
	this.valueField = options.valueField;
	this.keyField = options.keyField;
	this.items = options.items || [];
	this.hideFilter = !!options.hideFilter;
	this.hideButtons = !!options.hideButtons;

	this.onLoad = null;
};

MultiSelectModel.prototype.loadData = function() {
	const self = this;

	this.getDataPromise && this.getDataPromise.then(data => {
		const result = [];
		data && data.forEach(item => {
			result.push({
				key: item[self.keyField],
				value: item[self.valueField]
			});
		});

		this.items = result;
		this.onLoad && this.onLoad();
	});
};

MultiSelectModel.prototype.setSelections = function(data){
	const result = this.items.filter(item => data.indexOf(item.key) !== -1);
	this.filterField.onChange(result);
};

MultiSelectModel.prototype.getSelections = function(){
	const badge = this.filterField.getBadge();

	return badge && badge.values ? badge.values.map(item => item.key) : [];
};

module.exports = FilterMultiSelectType;
