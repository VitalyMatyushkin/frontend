/**
 * Created by Anatoly on 20.07.2016.
 */

const   React       = require('react');

const Sort = React.createClass({
    propTypes:{
        model: React.PropTypes.object.isRequired,
        dataField:React.PropTypes.string
    },
    onClick:function(e){
		const 	self 	= this,
				model 	= self.props.model,
				field 	= self.props.dataField;

		model.onSort && model.onSort(field);

        e.stopPropagation();
    },
    render: function () {
		const 	self 	= this,
				model 	= self.props.model,
				field 	= self.props.dataField,
				value 	= model.dataField === field ? model.value : null,
				classes = value ? 'eSort m' + value : 'eSort';

        return (
            <span className={classes} onClick={self.onClick}/>
        );
    }
});
module.exports = Sort;