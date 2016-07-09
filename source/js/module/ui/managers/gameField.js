const React = require('react');

const GameField = React.createClass({
    mixins: [Morearty.Mixin],
    _getGameFieldImg: function() {
        const   self = this,
                bindingData = self.getDefaultBinding().toJS();

        let src;

        if(bindingData !== undefined) {
            src = bindingData;
        } else {
            src = '';
        }

        return src;
    },
    render: function() {
        const self = this;

        return (
            <div className="bGameField">
                <img width="343px" height="503px" src={self._getGameFieldImg()}/>
            </div>
        );
    }
});

module.exports = GameField;