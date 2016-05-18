/**
 * Created by vitaly on 17.05.16.
 */
const React           = require('react'),
    Immutable       = require('immutable');

var EventMenuName = [
    {
        title: 'Teams'
    },
    {
        title: 'Details'
    },
    {
        title: 'Gallery'
    },
    {
        title: 'Comments'
    }
];

var EventMenuItem = React.createClass({
    render:function(){
        var self = this;
        var data = self.props.data;
        var items = data.map(function(item, index) {
            return (
                    <div className="bEventMenu_item">{item.title}</div>
            )
        });
        return (
            <div className="bEventMenu">{items}</div>
        );
    }
});
var EventMenu = React.createClass({
    render: function() {
        return (
            <div>
                <EventMenuItem data = {EventMenuName}/>
            </div>
        );
    }
});
module.exports = EventMenu;