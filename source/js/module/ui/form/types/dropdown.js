/**
 * Created by bridark on 23/07/15.
 */
var TypeDrop,
    React  = require('react'),
    ReactDOM = require('reactDom');
TypeDrop = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        optionChildren: React.PropTypes.array.isRequired,
        defaultSelect: React.PropTypes.string
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
    },
    componentDidMount:function(){
        //var self = this,
        //    binding = self.getDefaultBinding(),
        //    el = React.findDOMNode(self.refs.dropSelect);
        //console.log(el.options);
    },
    _renderChildOptions:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return self.props.optionChildren.map(function(optionNode){
            return(
                <option value={optionNode}>{optionNode}</option>
            )
        });
    },
    _handleDropChange:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            el = React.findDOMNode(self.refs.dropSelect);
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            options = self._renderChildOptions();
        return (
            <select ref="dropSelect" onChange={self._handleDropChange.bind(null,this)}>
                {options}
            </select>
        );
    }
});
module.exports = TypeDrop;