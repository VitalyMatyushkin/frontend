/**
 * Created by Bright on 01/03/2016.
 */
const   React           = require('react'),
        Immutable       = require('immutable'),
        Morearty        = require('morearty'),
        classNames      = require('classnames'),
        UserRole        = require('./user_roles'),
        TabItemDetails  = require('./user_edit_tabDetails');

const EditUser = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        onCancel: React.PropTypes.func.isRequired
    },
    getDefaultState:function(){
        return Immutable.fromJS({
            tabDetail:true,
            tabRole :false
        });
    },
    _toggleTabMenu:function(tabClicked){
        var self = this,
            binding = self.getDefaultBinding();
        switch (tabClicked){
            case 'detailTab':
                binding.set('tabDetail',true).set('tabRole',false);
                break;
            case 'roleTab':
                binding.set('tabRole',true).set('tabDetail',false);
                break;
            default:
                binding.set('tabDetail',true).set('tabRole',false);
                break;
        }
    },
    _renderActiveTabContent: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        let result;

        switch (true) {
            case binding.get('tabDetail'):
                result = <TabItemDetails binding={binding} onCancel={this.props.onCancel}/>;
                break;
            case binding.get('tabRole'):
                result = <UserRole binding={binding} />;
                break;
        }

        return result;
    },
    render: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        const   detailTabClass = classNames({
                    bPopupEdit_tab: true,
                    bPopupEdit_active: binding.get('tabDetail')
                }),
                permissionTabClass = classNames({
                    bPopupEdit_tab: true,
                    bPopupEdit_active: binding.get('tabRole')
                });

        return (
            <div className="bPopupEdit_container">
                <div className="bPopupEdit_row mTab">
                    <div className={detailTabClass}
                         onClick={self._toggleTabMenu.bind(self, 'detailTab')}
                    >
                        Detail
                    </div>
                    <div className={permissionTabClass}
                         onClick={self._toggleTabMenu.bind(self, 'roleTab')}
                    >
                        Permissions
                    </div>
                </div>
                {self._renderActiveTabContent()}
            </div>
        );
    }
});
module.exports = EditUser;