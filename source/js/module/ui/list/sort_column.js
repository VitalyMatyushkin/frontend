/**
 * Created by bridark on 27/07/15.
 */
var SortColumn;
SortColumn = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        onSort: React.PropTypes.func.isRequired,
        orderSort:React.PropTypes.string.isRequired
    },
    render: function () {
        var self = this;
        return (
            <div className="sortGroup">
                <span className="caret caret_down" onClick={function(evt){self.props.onSort(evt,self.props.orderSort)}}></span>
                <span className="caret caret_up" onClick={function(evt){self.props.onSort(evt,self.props.orderSort)}}></span>
            </div>
        );
    }
});
module.exports = SortColumn;