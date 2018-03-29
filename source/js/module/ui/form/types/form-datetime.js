/**
 * Created by vitaly on 23.08.17.
 */
const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		DateTime 	= require('module/ui/form/types/datetime'),
		React 		= require('react'),
		Morearty	= require('morearty');

const TypeDate =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	propTypes: {
		id:				React.PropTypes.string,		// just old good html id
		region:         React.PropTypes.string
	},
	render: function () {
		const 	self = this,
				binding = self.getDefaultBinding(),
				value = binding.get('value');

		return (
			<DateTime value={value} region={this.props.region} validateOn={false} id={self.props.id} onChange={self.changeValue} onBlur={self.setValue} />
		)
	}
});


module.exports = TypeDate;