/**
 * Created by Anatoly on 29.05.2016.
 */

const 	React 	= require('react');


const Head = React.createClass({
    mixins: [Morearty.Mixin],

    render: function() {
        return (
            <div className="bTopPanel">
                <div className="bTopLogo">SquadInTouch</div>
            </div>
        )
    }
});

module.exports = Head;