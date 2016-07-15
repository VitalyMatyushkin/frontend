/**
 * Created by bridark on 23/07/15.
 */
    /*
    This select button can be reused in situations where you want to provide select options that are not based on
    a collection in the database:
    For example a school status in the database is represented by a string field but we want administrator to have
    options that would enable them to change that string value.
    To customise: provide your own array of options @userProvidedOptions:Array, and selected or active selected option
    @userActiveState:String
     */
const   React       = require('react'),
        Morearty    = require('morearty'),
        TypeMixin   = require('module/ui/form/types/type_mixin');

const TypeDrop = React.createClass({
    mixins:[Morearty.Mixin, TypeMixin],
    propTypes:{
        userProvidedOptions:React.PropTypes.array,
        userActiveState:React.PropTypes.string
    },
    getInitialState:function(){
        return{
            activeValue:'Active'
        }
    },
    getDefaultProps:function(){
        return{
            defaultSelectOptions:[
                'Active',
                'Inactive',
                'Suspended',
                'Email Notifications'
            ]
        }
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        self.optionsToMap = self.props.defaultSelectOptions;
        binding.addListener('defaultValue',function(){
           self.isMounted()&&self.setState({activeValue:binding.get('defaultValue')});
        });
    },
    componentDidMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        //If initial option list is provided
        if(self.props.userProvidedOptions !== undefined && self.props.userActiveState!==undefined){
            self.optionsToMap = self.props.userProvidedOptions;
            binding.set('defaultValue', self.props.userActiveState);
        }
    },
    _renderChildOptions:function(){
        var self = this;
        return self.optionsToMap.map(function(optionNode,i){
            return(
                <option key={i} value={optionNode}>{optionNode}</option>
            )
        });
    },
    _handleDropChange:function(e){
        var self = this,
            binding = self.getDefaultBinding(),
            value = e.currentTarget.value;
        binding.set('defaultValue',value);
        self.setValue(value);
    },
    render:function(){
        var self = this,
            options = self._renderChildOptions();
        return (
            <select value={self.state.activeValue} ref="dropSelect" onChange={self._handleDropChange}>
                {options}
            </select>
        );
    }
});
module.exports = TypeDrop;