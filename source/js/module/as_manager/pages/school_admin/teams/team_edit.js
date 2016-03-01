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
            sportsData,
            team;

        window.Server.school.get(MoreartyHelper.getActiveSchoolId(self), {
            filter: {
                include: 'forms'
            }
        }).then((_schoolData) => {
            schoolData = _schoolData;

            return window.Server.sports.get();
        }).then((_sportsData) => {
            sportsData = _sportsData;
            !schoolData.forms && (schoolData.forms = []);

            return window.Server.team.get(teamId,{
                filter: {
                    include: [
                        'house',
                        'sport',
                        {'players': ['user', 'form']}
                    ]
                }
            });
        }).then((_team) => {
            team = _team;

            return window.Server.players.get({
                filter: {
                    where: {
                        teamId: team.id
                    }
                }
            });
        }).then((_players) => {
            return binding
                .atomically()
                .set('teamForm.team', Immutable.fromJS(team))
                .set('teamForm.name', Immutable.fromJS(team.name))
                .set('teamForm.description', Immutable.fromJS(team.description))
                .set('teamForm.sportId', Immutable.fromJS(team.sportId))
                .set('teamForm.sportModel', Immutable.fromJS(team.sport))
                .set('teamForm.gender', Immutable.fromJS(team.gender))
                .set('teamForm.ages', Immutable.fromJS(team.ages))
                .set('teamForm.availableAges', Immutable.fromJS(TeamHelper.getAges(schoolData)))
                .set('teamForm.rival', Immutable.fromJS(self._getFakeRival(team)))
                .set('teamForm.default', Immutable.fromJS(self._getDefaultObject(schoolData, team)))
                .set('teamForm.sports', Immutable.fromJS(sportsData))
                .set('teamForm.players', Immutable.fromJS(TeamHelper.getPlayers(_players, team)))
                .set('initialPlayers', Immutable.fromJS(TeamHelper.getPlayers(_players, team)))
                .set('teamForm.isHouseFilterEnable', Immutable.fromJS(self._isHouseFilterEnable(team)))
                .set('teamForm.isHouseSelected', Immutable.fromJS(self._isHouseSelected(team)))
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
        let rival = {id:0};

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
            binding = self.getDefaultBinding();

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

            window.Server.team.put(
                {
                    teamId:binding.get('teamForm.team.id')
                },
                updatedTeam
            ).then(() => {
                const players = binding.get('teamForm.players').toJS(),
                    initialPlayers =  binding.get('initialPlayers').toJS();

                initialPlayers.forEach((initialPlayer) => {
                    let findedPlayer = Lazy(players).findWhere({id:initialPlayer.id});

                    if(findedPlayer) {
                        //Mmm, check for modifications
                        let changes = {};
                        if(findedPlayer.position !== initialPlayer.position) {
                            changes.position = findedPlayer.position;
                        }
                        if(findedPlayer.sub !== initialPlayer.sub) {
                            changes.sub = findedPlayer.sub;
                        }
                        if(!changes.position || !changes.sub) {
                            self._changePlayer(
                                binding.get('teamForm.team.id'),
                                initialPlayer.playerModelId,
                                changes
                            );
                        }
                        players.splice(
                            Lazy(players).indexOf(findedPlayer),
                            1
                        );
                    } else {
                        //So, user delete player, let's delete player from server
                        self._deletePlayer(
                            binding.get('teamForm.team.id'),
                            initialPlayer.id
                        );
                    }
                });
                if(players.length > 0) {
                    //Hmmm...new players!
                    players.forEach((player) => {
                        self._addPlayer(
                            binding.get('teamForm.team.id'),
                            player
                        );
                    });
                }

                document.location.hash = '/#school_admin/teams';
                binding.clear();
                binding.meta().clear();
            });
        }
    },
    _addPlayer: function(teamId, player) {
        window.Server.playersRelation.put(
            {
                teamId: teamId,
                studentId: player.id
            },{
                position:  player.position,
                sub:       player.sub
            }
        );
    },
    _deletePlayer: function(teamId, playerId) {
        window.Server.playersRelation.delete({
            teamId: teamId,
            studentId: playerId
        });
    },
    _changePlayer: function(teamId, playerId, changes) {
        window.Server.exactlyPlayersByTeam.put(
            {
                teamId:    teamId,
                playerId:  playerId
            },
            {
                position:  changes.position,
                sub:       changes.sub
            }
        )
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