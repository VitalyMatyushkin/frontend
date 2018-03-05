const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		RadioGroup 	= require('module/ui/radiogroup/radiogroup'),
		Morearty    = require('morearty'),
		React 		= require('react');

const TypeRadio = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	propTypes: {
		sourcePromise: React.PropTypes.func,
        id:			   React.PropTypes.string
	},
	bindToAutcomplete: function() {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				defaultValue 	= binding.get('defaultValue');

		if (defaultValue) {
			binding.sub('radio').set('defaultId', defaultValue);
		}

		binding.sub('radio').addListener('selectedId', function() {
			const newSelectedId = binding.get('radio.selectedId');

			self.setValue(newSelectedId);
		});

	},
	render: function() {
		this.bindToAutcomplete();

		return (
			<RadioGroup sourcePromise={this.props.sourcePromise} binding={this.getDefaultBinding().sub('radio')} id={this.props.id}/>
		);
	}
});

module.exports = TypeRadio;
