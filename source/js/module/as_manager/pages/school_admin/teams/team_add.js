const   TeamForm             = require('module/as_manager/pages/school_admin/teams/team_form'),
        Immutable            = require('immutable'),
        MoreartyHelper       = require('module/helpers/morearty_helper'),
        TeamHelper           = require('./team_helper'),
        React                = require('react');

const TeamAddPage = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        const self = this,
            binding = self.getDefaultBinding();

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
                    .set('teamForm.availableAges',       Immutable.fromJS(TeamHelper.getAges(schoolData)))
                    .set('teamForm.selectedRivalIndex',  Immutable.fromJS(self._getFakeRivalIndex()))
                    .set('teamForm.rival',               Immutable.fromJS(self._getFakeRivalObject()))
                    .set('teamForm.isHouseFilterEnable', Immutable.fromJS(false))
                    .set('teamForm.isHouseSelected',     Immutable.fromJS(false))
                    .set('teamForm.houses',              Immutable.fromJS({}))
                    .set('teamForm.error',               Immutable.fromJS(self._getErrorObject()))
                    .commit();
            });
        });
    },
    /**
     * Get fake rival object, fake - because team manager element require rival object.
     * @returns {{id: number}}
     * @private
     */
    _getFakeRivalObject: function() {
        return {id:0};
    },
    /**
     * Get fake rival index, fake - because team manager element require rival index.
     * @returns {number}
     * @private
     */
    _getFakeRivalIndex: function() {
        return 0;
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
    _submitAdd: function() {
        const self = this,
            binding = self.getDefaultBinding();

        TeamHelper.validate(binding);

        if(!binding.toJS('teamForm.error.isError')) {
            const team = {
                name:        binding.get('teamForm.name'),
                description: binding.get('teamForm.description'),
                sportId:     binding.get('teamForm.sportId'),
                schoolId:    self.activeSchoolId,
                ages:        binding.toJS('teamForm.ages'),
                gender:      binding.get('teamForm.gender'),
                houseId:     TeamHelper.getHouseId(binding)
            };

            window.Server.teams.post(team).then(function (teamsResult) {
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
                    ).then(function (playerResult) {
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
    render: function() {
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <TeamForm title="Add new team..." onFormSubmit={self._submitAdd} binding={binding.sub('teamForm')} />
        )
    }
});


module.exports = TeamAddPage;