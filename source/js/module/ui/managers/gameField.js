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
        const self = this;

        return (
            <div className="bGameField">
                <img height="600" width="490" src={self._getGameFieldImg()}/>
            </div>
        );
    }
});

module.exports = GameField;