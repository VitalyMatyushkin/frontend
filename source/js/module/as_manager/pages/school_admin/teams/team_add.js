const TeamForm           = require('module/as_manager/pages/school_admin/teams/team_form'),
    TeamPlayersValidator = require('module/ui/managers/helpers/team_players_validator'),
    Immutable            = require('immutable'),
    MoreartyHelper       = require('module/helpers/morearty_helper'),
    React                = require('react');

const TeamAddPage = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        const self = this;

        self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

        self._initFormBinding();
    },
    /**
     * Initialize binding for team from
     * @private
     */
    _initFormBinding: function() {
        const self         = this,
            binding        = self.getDefaultBinding();

        window.Server.school.get(self.activeSchoolId, {
            filter: {
                include: 'forms'
            }
        }).then(function (schoolData) {
            return window.Server.sports.get().then(function (sportsData) {
                !schoolData.forms && (schoolData.forms = []);

                binding
                    .atomically()
                    .set('teamForm.default',             Immutable.fromJS(self._getDefaultObject(schoolData)))
                    .set('teamForm.sports',              Immutable.fromJS(sportsData))
                    .set('teamForm.players',             Immutable.fromJS([]))
                    .set('teamForm.availableAges',       Immutable.fromJS(self._getAges(schoolData)))
                    .set('teamForm.selectedRivalIndex',  Immutable.fromJS(0))
                    .set('teamForm.rival',               Immutable.fromJS({id:0}))
                    .set('teamForm.isHouseFilterEnable', Immutable.fromJS(false))
                    .set('teamForm.isHouseSelected',     Immutable.fromJS(false))
                    .set('teamForm.houses',              Immutable.fromJS({}))
                    .set('teamForm.error',               Immutable.fromJS(self._getErrorObject()))
                    .commit();
            });
        });
    },
    /**
     * Get object for default binding
     * @param schoolData - school instance
     * @returns {{schoolInfo: *, model: {}, players: Array}}
     * @private
     */
    _getDefaultObject: function(schoolData) {
        return {
            schoolInfo: schoolData,
            model: {},
            players: []
        };
    },
    /**
     * Get object for error binding
     * Error binding - container for validation data
     * @returns {{isError: boolean, text: string}}
     * @private
     */
    _getErrorObject: function() {
        return {
            isError: false,
            text: ''
        };
    },
    /**
     * Reduce available students ages for game from school object
     * @param schoolData
     * @returns {*}
     * @private
     */
    _getAges: function(schoolData) {
        return schoolData.forms.reduce(function (memo, form) {
            if (memo.indexOf(form.age) === -1) {
                memo.push(form.age);
            }

            return memo;
        }, []);
    },
    submitAdd: function() {
        const self = this,
            binding = self.getDefaultBinding();

        self._validate();

        if(!binding.toJS('teamForm.error.isError')) {
            var rivalModel = {
                name:        binding.get('teamForm.name'),
                description: binding.get('teamForm.description'),
                sportId:     binding.get('teamForm.sportId'),
                schoolId:    self.activeSchoolId,
                ages:        binding.get('teamForm.model.ages'),
                gender:      binding.get('teamForm.model.gender')
            };

            window.Server.teams.post(rivalModel).then(function (teamsResult) {
                let players = binding.get('teamForm.players').toJS();

                var i = 0;
                // TODO: fix me
                players.forEach((player) => {
                    window.Server.playersRelation.put(
                        {
                            teamId:    teamsResult.id,
                            studentId: player.id
                        },
                        {
                            position:  player.position,
                            sub:       player.sub ? player.sub : false
                        }
                    ).then(function (playerResult) {3
                        i += 1;

                        if (i === players.length) {
                            document.location.hash = '/#school_admin/teams';
                            binding.clear();
                            binding.meta().clear();
                        }
                        return playerResult;  // each then-callback should have explicit return
                    });
                });
                return teamsResult;
            });
        }
    },
    /**
     * Validate player objects
     * @private
     */
    _validate: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            limits = {
                maxPlayers: binding.get('teamForm.default.model.sportModel.limits.maxPlayers'),
                minPlayers: binding.get('teamForm.default.model.sportModel.limits.minPlayers'),
                maxSubs:    binding.get('teamForm.default.model.sportModel.limits.maxSubs')
            };

        const result = TeamPlayersValidator.validate(
            binding.toJS('teamForm.players'),
            limits
        );

        binding.set('teamForm.error',
            Immutable.fromJS(result)
        );
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <TeamForm title="Add new team..." onFormSubmit={self.submitAdd} binding={binding.sub('teamForm')} />
        )
    }
});


module.exports = TeamAddPage;