/**
 * Created by bridark on 27/07/15.
 */
const   React       = require('react'),
        Morearty    = require('morearty');

const SortColumn = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        onSort: React.PropTypes.func,
        fieldName:React.PropTypes.string
    },
    onClick:function(e){
        const self = this,
            binding = self.getDefaultBinding(),
            value = binding.get(self.props.fieldName);

        let res = value && value == 'ASC' ? 'DESC' : 'ASC';

        binding.clear();
        binding.set(self.props.fieldName, res);

        self.props.onSort && self.props.onSort(self.props.fieldName, res);
        e.stopPropagation();
    },
    getClasses:function(){
        const self = this,
            binding = self.getDefaultBinding(),
            value = binding.get(self.props.fieldName);

        let res = 'eSort';
        res += value ? ' m'+value: '';

        return res;
    },
    render: function () {
        const self = this;
        return (
            <span className={self.getClasses()} onClick={self.onClick}/>
        );
    }
});
module.exports = SortColumn;