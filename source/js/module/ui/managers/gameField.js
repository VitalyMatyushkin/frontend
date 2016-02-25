const React = require('react'),
    ImageHelper = require('module/helpers/imageHelper');

const GameField = React.createClass({
    mixins: [Morearty.Mixin],
    _getGameFieldImg: function() {
        const self = this,
            bindingData = self.getDefaultBinding().toJS();

        let src;

        if(bindingData !== undefined) {
            src = ImageHelper.formatSizedImageScr(bindingData, 490, 600);
        } else {
            src = '';
        }

        return src;
    },
    render: function() {
        const self = this;

        return (
            <div className="bGameField">
                <img src={self._getGameFieldImg()}/>
            </div>
        );
    }
});

module.exports = GameField;