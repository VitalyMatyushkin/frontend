const   React       = require('react');

const Pagination = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        onChange: React.PropTypes.func
    },
    _setVariables: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            totalCount = binding.get('totalCount');

        if(!totalCount)
            totalCount = 0;

        self.pageLimit = binding.get('pageLimit');
        if(!self.pageLimit)
            self.pageLimit = 20;
        self.totalPages = Math.floor(totalCount/self.pageLimit);
        if(self.totalPages === 0 || totalCount%self.pageLimit > 0)
            self.totalPages++;
        self.pageNumber = binding.get('pageNumber');
        if(!self.pageNumber || self.totalPages < self.pageNumber){
            self.pageNumber = 1;
            binding.set('pageNumber', 1);
        }
    },
    _onChange:function(e){
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('pageNumber', e.target.value);
        console.log('pageNumber = '+binding.get('pageNumber'));
        if(self.props.onChange)
            self.props.onChange(e);

        e.stopPropagation();
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding();

        self._setVariables();

        return (
            <div className="ePagination">
                <div ref="pageNumber" className="leftPagination">out of {self.totalPages}</div>
                <select ref="pageSelect" onChange={self._onChange} value={self.pageNumber}
                        className="pagination_select">
                    {function(){
                        var options = [];
                        for(var i=1; i <= self.totalPages; i++){
                            options.push(
                                <option key={i} value={i} >{i}</option>
                            );
                        }
                        return options;
                    }()}
                </select>
                <div className="rightPagination">Page</div>
            </div>
        );
    }
});
module.exports = Pagination;