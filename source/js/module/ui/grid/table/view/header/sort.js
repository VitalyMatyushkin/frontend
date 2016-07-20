/**
 * Created by Anatoly on 20.07.2016.
 */

const   React       = require('react');

const Sort = React.createClass({
    propTypes:{
        onSort: React.PropTypes.func,
		sortValue:React.PropTypes.string,
        dataField:React.PropTypes.string
    },
    onClick:function(e){
		const 	self 	= this,
				value 	= self.props.sortValue,
				field 	= self.props.dataField;

		self.props.onSort && self.props.onSort(field,value);

        e.stopPropagation();
    },
    render: function () {
        const self = this,
			value = self.props.sortValue,
			classes = value ? 'eSort m' + value : 'eSort';
        return (
            <span className={classes} onClick={self.onClick}/>
        );
    }
});
module.exports = Sort;