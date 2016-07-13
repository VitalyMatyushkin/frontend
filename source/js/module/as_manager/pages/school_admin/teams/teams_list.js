const   Table           = require('module/ui/list/table'),
        TableField      = require('module/ui/list/table_field'),
        ListPageMixin   = require('module/mixins/list_page_mixin'),
		SVG 			= require('module/ui/svg'),
        Sport           = require('module/ui/icons/sport_icon'),
        React           = require('react');

const TeamsListPage = React.createClass({
    mixins: [Morearty.Mixin, ListPageMixin],
    serviceName: 'teams',
	filters:{
		limit: 100,
		where: {
			tempTeam: false,
			removed: false
		}
	},
	componentDidMount: function () {
		const   self          = this,
				binding       = self.getDefaultBinding();

		window.Server.sports.get().then(sports => binding.set('sports', sports));
	},
    _removeTeam: function(data){
        const   self    = this,
                binding = self.getDefaultBinding();

        if(data !== undefined){
            window.Server.team.delete( { schoolId: self.activeSchoolId, teamId: data.id } ).then(function(res){
                binding.update( 'data', teams => teams.filter( team => team.get('id') !== data.id ) );

                return res;
            });
        }
    },
    _getAges: function(data) {
        let result = '';

        if(data !== undefined) {
            result = data.map(elem => {
               return `Y${elem}`;
            }).join(";");
        }

        return result;
    },
	_getGender: function (gender) {
		var icon = gender === 'male' ? 'icon_man': 'icon_woman';

		return <SVG classes="bIcon-gender" icon={icon} />;
	},
    _getSport: function (sportId) {
		const   self    = this,
				binding = self.getDefaultBinding();

        const 	sports 	= binding.get('sports'),
				name 	= sports ? sports.find(s => s.id === sportId).name : '';

        return <Sport name={name} className="bIcon_invites" />;
    },
    getTableView: function() {
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <Table title="Teams"
                   binding={binding}
                   onItemEdit={self._getEditFunction()}
                   getDataPromise={self.getDataPromise}
                   onItemRemove={self._removeTeam}
            >
                <TableField dataField="sportId"
                            filterType="none"
                            parseFunction={self._getSport}>Sport</TableField>
                <TableField dataField="name">Team Name</TableField>
                <TableField dataField="description">Description</TableField>
                <TableField dataField="gender"
                            filterType="none"
                            parseFunction={self._getGender}>Gender</TableField>
                <TableField dataField="ages"
                            filterType="none"
                            parseFunction={self._getAges}>Ages</TableField>
            </Table>
        );
    }
});

module.exports = TeamsListPage;