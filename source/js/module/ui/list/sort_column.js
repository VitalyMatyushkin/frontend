/**
 * Created by bridark on 27/07/15.
 */
var SortColumn;
SortColumn = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        onSort: React.PropTypes.func,
        orderSort:React.PropTypes.string
    },
    render: function () {
        var self = this;
        return (
            <div className="sortGroup">
                <span className="caret caret_down" onClick={function(evt){self.props.onSort(evt,self.props.orderSort)}}/>
                <span className="caret caret_up" onClick={function(evt){self.props.onSort(evt,self.props.orderSort)}}/>
            </div>
        );
    }
});
module.exports = SortColumn;