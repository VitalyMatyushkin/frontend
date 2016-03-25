const   Logo            = require('module/as_manager/head/logo'),
        TopMenu         = require('module/ui/menu/top_menu'),
        UserBlock       = require('module/as_manager/head/user_block'),
        React           = require('react'),
        Immutable       = require('immutable');

const Head = React.createClass({
    mixins: [Morearty.Mixin],
    getDefaultState: function() {
        return Immutable.fromJS({
            autocomplete: {}
        });
    },
    componentWillMount: function () {
        var self = this;

        self.menuItems =
        [{
            href: '/#events/calendar/all',
            name: 'Calendar',
            key: 'Calendar',
            authorization: true,
            routes: ['/events/calendar/:userId']
        }, {
            href: '/#events/fixtures/all',
            name: 'Fixtures',
            key: 'Fixtures',
            authorization: true,
            routes: ['/events/fixtures/:userId']
        }, {
            href: '/#events/achievement/all',
            name: 'Achievements',
            key: 'Achievements',
            authorization: true,
            routes: ['/events/achievement/:userId']
        }];
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <div className="bTopPanel">
                <Logo />
                <TopMenu items={self.menuItems} binding={binding.sub('routing')}/>
                <UserBlock binding={binding.sub('userData')}/>
            </div>
        )
    }
});

module.exports = Head;
