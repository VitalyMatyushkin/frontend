const   Logo            = require('module/as_manager/head/logo'),
        TopMenu         = require('module/ui/menu/top_menu'),
        UserBlock       = require('module/as_manager/head/user_block'),
        Autocomplete    = require('module/ui/autocomplete2/OldAutocompleteWrapper'),
        If              = require('module/ui/if/if'),
        React           = require('react'),
        ReactDOM        = require('reactDom'),
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
            icon: 'icon_calendar',
            href: '/#events/calendar',
            name: 'Calendar',
            key: 'Calendar',
            authorization: true
        }, {
            href: '/#events/challenges',
            name: 'Fixtures',
            key: 'Fixtures',
            authorization: true
        }, {
            href: '/#events/achievement',
            name: 'Achievements',
            key: 'Achievements',
            authorization: true
        }];
    },
    componentDidMount: function () {
    },
    setActiveChild: function() {
        var self = this,
            binding = self.getDefaultBinding();
        binding
            .atomically()
            .set('events.activeChildId', Immutable.fromJS(arguments[0]))
            .set('sync', true)
            .commit();

        window.Server.studentEvents.get({id: arguments[0]}).then(function (data) {
            binding
                .atomically()
                .set('events.models', Immutable.fromJS(data))
                .set('sync', true)
                .commit();
            React.findDOMNode(self.refs.checkAll).checked = false; //Toggle checkbox off
        });
    },
    toggleCheckAllBox:function(evt){
        var checkBoxAttr = evt.currentTarget.checked,
            self = this,
            binding = self.getDefaultBinding();
        if(checkBoxAttr){
            self.persistChildId = binding.get('events.activeChildId');
            binding
                .atomically()
                .set('events.activeChildId','all')
                .set('events.models',binding.get('events.persistEventModels'))
                .set('sync',true)
                .commit();
        }else{
            if(binding.get('events.activeChildId')==='all' && self.persistChildId === undefined){
                alert('Please choose a student');
                evt.currentTarget.checked = true;
            }else{
                window.Server.studentEvents.get({id: self.persistChildId}).then(function (data) {
                    binding
                        .atomically()
                        .set('events.activeChildId',self.persistChildId)
                        .set('events.models', Immutable.fromJS(data))
                        .set('sync', true)
                        .commit();
                });
            }
        }
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
