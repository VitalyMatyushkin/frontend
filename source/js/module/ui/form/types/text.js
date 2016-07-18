const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		React 		= require('react'),
		Morearty	= require('morearty');

const TypeText =  React.createClass({
	propTypes: {
		textType: 		React.PropTypes.string
	},
	mixins: [Morearty.Mixin, TypeMixin],
	componentWillMount: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		// For case when form filled async
		binding.addListener('defaultValue', function() {
			self.fullValidate(binding.get('defaultValue'));
		});
	},
	componentDidUpdate: function () {
		if(this.cursor >= 0){
			this.refs.input.setSelectionRange(this.cursor,this.cursor);
		}
	},
	handleBlur: function(event) {
		this.cursor = -1;
		this.setValue(event.target.value);
	},
	handleChange: function(event) {
		this.cursor = event.target.selectionStart;
		this.changeValue(event.target.value);
	},
	render: function () {
		const 	self 	= this,
				value 	= self.getDefaultBinding().get('value');

		return (
			<input ref="input" value={value} type={self.props.textType || 'text'} placeholder={self.props.placeholder}
				   onBlur={self.handleBlur} onChange={self.handleChange} />
		)
	}
});


module.exports = TypeText;