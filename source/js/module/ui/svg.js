
//<svg class="bIcon"><use xlink:href="#icon_key"></use></svg>
const   React       = require('react'),
	    ReactDOM    = require('reactDom');

const SVG = React.createClass({
	propTypes: {
		icon: React.PropTypes.string.isRequired,
        classes: React.PropTypes.string
	},
	componentDidMount: function() {
		var self = this;
		ReactDOM.findDOMNode(self).firstElementChild.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + self.props.icon);
	},
	render: function() {
		var self = this,
            classes = self.props.classes ? 'bIcon ' + self.props.classes : 'bIcon';

		return <svg className={classes}>{React.createElement('use')}</svg>;
	}
});

module.exports = SVG;

