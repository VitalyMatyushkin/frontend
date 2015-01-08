var SVG;
//<svg class="bIcon"><use xlink:href="#icon_key"></use></svg>

SVG = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		icon: React.PropTypes.string.isRequired
	},
	componentDidMount: function() {
		var self = this;

		self.getDOMNode().firstElementChild.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + self.props.icon);
	},
	render: function() {
		var self = this;

		return <svg className="bIcon">{React.createElement('use')}</svg>;
	}
});

module.exports = SVG;

