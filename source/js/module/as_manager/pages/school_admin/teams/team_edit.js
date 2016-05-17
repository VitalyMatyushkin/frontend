const	TeamForm             = require('module/as_manager/pages/school_admin/teams/team_form'),
        React                = require('react'),
        MoreartyHelper       = require('module/helpers/morearty_helper'),
        TeamHelper           = require('module/ui/managers/helpers/team_helper'),
        Immutable            = require('immutable'),
        Lazy                 = require('lazyjs');

const TeamEditPage = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        const   self          = this,
                binding       = self.getDefaultBinding();

        binding.clear();

        self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

        self._initFormBinding();
    },
    componentWillUnmount: function() {
        const self = this,
            binding = self.getDefaultBinding();

        binding.clear();
    },
    /**
     * Initialize binding for team from
     * @private
     */
    _initFormBinding: function() {
        const   self    = this,
                binding = self.getDefaultBinding(),
                teamId  = self._getTeamId();

        let schoolData,
            sports,
            team,
            players;

        //get school data
        window.Server.school.get(self.activeSchoolId)
            .then( _schoolData => {
                schoolData = _schoolData;

                // get forms data
                return window.Server.schoolForms.get(self.activeSchoolId);
            })
            .then( formsData => {
                schoolData.forms = formsData;

                // get sports data
                return window.Server.sports.get();
            })
            .then( _sportsData => {
                sports = _sportsData;
                !schoolData.forms && (schoolData.forms = []);

                return window.Server.team.get(
                    {
                        schoolId: self.activeSchoolId,
                        teamId: teamId
                    }
                );
            })
            .then( _team => {
                team = _team;

                if(team.houseId) {
                    return window.Server.schoolHouse.get({schoolId: self.activeSchoolId, houseId: team.houseId})
                        .then(house => team.house = house);
                } else {
                    return Promise.resolve(team);
                }
            })
            .then(_ => {
                // inject sport to team
                team.sport = TeamHelper.getSportById(team.sportId, sports);

                return window.Server.schoolStudents.get(self.activeSchoolId);
            })
            .then(users => {
                // inject users to players, because we need user info
                // yep, ugly method name
                let usersWithPlayerInfo = TeamHelper.getPlayersWithUserInfo(team.players, users);

                // inject forms to players
                usersWithPlayerInfo = TeamHelper.injectFormsToPlayers(usersWithPlayerInfo, schoolData.forms);

                return binding
                    .atomically()
                    .set('teamForm.team',                   Immutable.fromJS(team))
                    .set('teamForm.name',                   Immutable.fromJS(team.name))
                    .set('teamForm.description',            Immutable.fromJS(team.description))
                    .set('teamForm.sportId',                Immutable.fromJS(team.sportId))
                    .set('teamForm.sportModel',             Immutable.fromJS(team.sport))
                    .set('teamForm.gender',                 Immutable.fromJS(team.gender))
                    .set('teamForm.ages',                   Immutable.fromJS(team.ages))
                    .set('teamForm.availableAges',          Immutable.fromJS(TeamHelper.getAges(schoolData)))
                    .set('teamForm.rival',                  Immutable.fromJS(self._getFakeRival(team)))
                    .set('teamForm.default',                Immutable.fromJS(self._getDefaultObject(schoolData, team)))
                    .set('teamForm.sports',                 Immutable.fromJS(sports))
                    .set('teamForm.players',                Immutable.fromJS(usersWithPlayerInfo))
                    .set('initialPlayers',                  Immutable.fromJS(usersWithPlayerInfo))
                    .set('teamForm.isHouseFilterEnable',    Immutable.fromJS(self._isHouseFilterEnable(team)))
                    .set('teamForm.isHouseSelected',        Immutable.fromJS(self._isHouseSelected(team)))
                    .set('teamForm.isHouseAutocompleteInit',Immutable.fromJS(!self._isHouseSelected(team)))
                    .set('teamForm.removedPlayers',         Immutable.fromJS([]))
                    .commit();
            });
    },
    /**
     * Check status of house filter.
     * If houseId undefined then house filter disabled
     * @param team
     * @returns {boolean}
     * @private
     */
    _isHouseFilterEnable: function(team) {
        return !!team.houseId;
    },
    /**
     * Similar house filter
     * @param team
     * @returns {boolean}
     * @private
     */
    _isHouseSelected: function(team) {
        return !!team.houseId;
    },
    /**
     * Get object for default binding
     * @param schoolData - school instance
     * @returns {{schoolInfo: *, model: {}, players: Array}}
     * @private
     */
    _getDefaultObject: function(schoolData, team) {
        let type = '';

        if(team.houseId) {
            type = 'houses';
        }

        return {
            schoolInfo: schoolData,
            model: {
                type: type,
                ages: team.ages,
                gender: team.gender,
                sportModel: team.sport
            },
            players: []
        };
    },
    /**
     * Get fake rival object, fake - because team manager element require rival object.
     * @private
     */
    _getFakeRival: function(team) {
        let rival = { id: 0 };

        if(team.houseId) {
            rival = team.house;
        }

        return rival;
    },
    /**
     * Get id of current team
     * @returns {*}
     * @private
     */
    _getTeamId: function() {
        const self = this;

        return self.getMoreartyContext().getBinding().toJS('routing.parameters.id');
    },
    _submitEdit: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            teamId = binding.get('teamForm.team.id');

        TeamHelper.validate(binding);

        if(!binding.toJS('teamForm.error.isError')) {
            const updatedTeam = {
                name:        binding.get('teamForm.name'),
                description: binding.get('teamForm.description'),
                sportId:     binding.get('teamForm.sportId'),
                ages:        binding.toJS('teamForm.ages'),
                gender:      binding.get('teamForm.gender'),
                schoolId:    MoreartyHelper.getActiveSchoolId(self)
            };

            binding.get('teamForm.houseId') && (updatedTeam.houseId = binding.get('teamForm.houseId'));

            window.Server.team.put(
                {
                    schoolId: self.activeSchoolId,
                    teamId: teamId
                },
                updatedTeam
            ).then( _ => {
                const   players         = binding.get('teamForm.players').toJS(),
                        initialPlayers  =  binding.get('initialPlayers').toJS();

                Promise.all(
                    TeamHelper.commitPlayers(initialPlayers, players, teamId, self.activeSchoolId)
                ).then(() => {
                    document.location.hash = '/#school_admin/teams';
                    binding.clear();
                    binding.meta().clear();
                });
            });
        }
    },
    render: function() {
        const self = this,
            binding = self.getDefaultBinding();

        return (
            <TeamForm title="Edit team..." onFormSubmit={self._submitEdit} binding={binding.sub('teamForm')} />
        )
    }
});

module.exports = TeamEditPage;