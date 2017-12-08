/**
 * Created by bridark on 24/06/15.
 */
const   React       = require('react'),
        Morearty	= require('morearty'),
	    {SVG}         = require('module/ui/svg');

// TODO: WTF binding is here ????

const ConsoleList = React.createClass({
    mixins:[Morearty.Mixin],
    _renderListData:function(data){
        var self = this,
            binding = self.getDefaultBinding();

        return data.map(function(item){
            const revokeRole = function(userId, firstName,lastName){
                    return function(evt){
                        binding.set('currentAction','revoke');
                        binding.set('selectedUser', {userId:userId,userName:firstName+" "+lastName});
                        binding.set('popup',true);
                        evt.stopPropagation();
                    }
                };

            return(
                <div className="eDataList_listItem">
                    <div className="eDataList_listItemCell">
                        { `${item.principal.firstName} ${item.principal.lastName}` }
                    </div>
                    <div className="eDataList_listItemCell">
                        { item.principal.email }
                    </div>
                    <div className="eDataList_listItemCell">
                        {
                            item.principal.verified.email === false && item.principal.verified.phone === false ?
                                'Registered' :
                                'Active'
                        }
                    </div>
                    <div className="eDataList_listItemCell">
                        { item.school.name }
                    </div>
                    <div className="eDataList_listItemCell">
                        { item.preset }
                    </div>
                    <div className="eDataList_listItemCell mActions">
                        <span title="Add">
                            <SVG classes="bIcon-mod" icon="icon_plus"/>
                        </span>
                        <span   title   = "Delete"
                                onClick = { revokeRole(data.id, data.firstName, data.lastName) }
                        >
                            <SVG classes="bIcon-mod" icon="icon_trash" />
                        </span>
                        <span title="Block">
                            <SVG    classes = "bIcon-mod"
                                    icon    = { item.blocked ? "icon_user-minus" : "icon_user-check" }
                            />
                        </span>
                    </div>
                </div>
            );
        })
    },
    render:function(){
        const binding = this.getDefaultBinding();

        let permList = null;
        if (typeof binding.toJS('permissionData') !== 'undefined') {
            permList = this._renderListData( binding.toJS('permissionData') );
        }

        return (
            <div className="eDataList_console">
                { permList }
            </div>
        );
    }
});
module.exports = ConsoleList;