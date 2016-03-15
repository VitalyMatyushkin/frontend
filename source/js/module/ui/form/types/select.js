const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		Select 		= require('module/ui/select/select'),
		React 		= require('react');

const TypeSelect = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	propTypes: {
		sourceArray:	React.PropTypes.array
	},
    componentDidMount: function(){
        const self = this,
            binding = self.getDefaultBinding();

        self.addBindingListener(binding, 'defaultValue', changes => binding.set('select.defaultId', changes.getCurrentValue()));
        self.addBindingListener(binding, 'select.selectedId', changes => self.setValue(changes.getCurrentValue()));
    },
	render: function() {
		var self = this;

		return (
			<Select sourceArray={self.props.sourceArray}  binding={self.getDefaultBinding().sub('select')} />
		);
	}
});

module.exports = TypeSelect;
