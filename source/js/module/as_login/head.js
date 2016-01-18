/**
 * Created by wert on 16.01.16.
 */

const 	React 	= require('react');


const Head = React.createClass({
    mixins: [Morearty.Mixin],

    render: function() {
        return (
            <div className="bTopPanel">
                <div className="bTopLogo">SquadIntouch</div>
            </div>
        )
    }
});

module.exports = Head;