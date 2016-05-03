/**
 * Created by Bright on 01/03/2016.
 */
const   React           = require('react'),
        Immutable       = require('immutable'),
        UserRole        = require('./user_roles'),
        If              = require('module/ui/if/if'),
        TabItemDetails  = require('./user_edit_tabDetails');

const EditUser = React.createClass({
    mixins:[Morearty.Mixin],
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
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div className="bPopupEdit_container">
                <div className="bPopupEdit_row eTab">
                    <span className={binding.get('tabDetail')?'bPopupEdit_tab bPopupEdit_active':'bPopupEdit_tab'} onClick={self._toggleTabMenu.bind(null,'detailTab')}>Detail</span>
                    <span className={binding.get('tabRole')?'bPopupEdit_tab bPopupEdit_active':'bPopupEdit_tab'} onClick={self._toggleTabMenu.bind(null,'roleTab')}>Permissions</span>
                </div>
                <If condition={binding.get('tabDetail')}>
                    <TabItemDetails binding={binding}/>
                </If>
                <If condition={binding.get('tabRole')}>
                    <UserRole binding={binding} />
                </If>
            </div>
        );
    }
});
module.exports = EditUser;