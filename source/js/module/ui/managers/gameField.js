const React = require('react');

const GameField = React.createClass({
    mixins: [Morearty.Mixin],
    _getGameFieldImg: function() {
        const self = this,
            bindingData = self.getDefaultBinding().toJS();

        let src;

        if(bindingData !== undefined) {
            src = bindingData;//window.Server.images.getResizedToBoxUrl(bindingData, 490, 600);
        } else {
            src = '';
        }

        return src;
    },
    render: function() {
        return (
            <div className="bGameField">
                <img src='/images/plug_footballfield.png'/>
            </div>
        );
    }
});

module.exports = GameField;