const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		Select 		= require('../../select/select'),
		Morearty	= require('morearty'),
		React 		= require('react');

const TypeSelect = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	propTypes: {
		sourceArray:	React.PropTypes.array,
		isDisabled:		React.PropTypes.bool, 	//false - show field like disabled
		placeHolder:	React.PropTypes.string,
        id:			    React.PropTypes.string
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
			<Select	sourceArray	= {self.props.sourceArray}
					isDisabled	= {self.props.isDisabled}
					placeHolder	= {self.props.placeHolder}
					binding		= {self.getDefaultBinding().sub('select')}
					id 			= {self.props.id}
			/>
		);
	}
});

module.exports = TypeSelect;
