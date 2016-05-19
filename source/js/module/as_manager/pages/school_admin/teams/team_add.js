const   TeamForm             = require('module/as_manager/pages/school_admin/teams/team_form'),
        Immutable            = require('immutable'),
        MoreartyHelper       = require('module/helpers/morearty_helper'),
        TeamHelper           = require('module/ui/managers/helpers/team_helper'),
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
        const   self    = this,
                binding = self.getDefaultBinding();

        let schoolData;

        //get school data
        window.Server.school.get(self.activeSchoolId)
            .then(_schoolData => {
                schoolData = _schoolData;

                // get forms data
                return window.Server.schoolForms.get(self.activeSchoolId);
            })
            .then(formsData => {
                schoolData.forms = formsData;

                // get sports data
                return window.Server.sports.get();
            })
            .then(function (sportsData) {
                !schoolData.forms && (schoolData.forms = []);

                // prepare binding for battle:)
                // yep, it's very excess structure
                // it's effects of team manager element integration
                // in the future, after refactoring that will be fixed
                binding
                    .atomically()
                    .set('teamForm.default',                Immutable.fromJS(self._getDefaultObject(schoolData)))
                    .set('teamForm.sports',                 Immutable.fromJS(sportsData))
                    .set('teamForm.gender',                 Immutable.fromJS('male'))
                    .set('teamForm.players',                Immutable.fromJS([]))
                    .set('teamForm.availableAges',          Immutable.fromJS(TeamHelper.getAges(schoolData)))
                    .set('teamForm.selectedRivalIndex',     Immutable.fromJS(self._getFakeRivalIndex()))
                    .set('teamForm.rival',                  Immutable.fromJS(self._getFakeRivalObject()))
                    .set('teamForm.isHouseFilterEnable',    Immutable.fromJS(false))
                    .set('teamForm.isHouseSelected',        Immutable.fromJS(false))
                    .set('teamForm.isHouseAutocompleteInit',Immutable.fromJS(true))
                    .set('teamForm.houses',                 Immutable.fromJS({}))
                    .set('teamForm.error',                  Immutable.fromJS(self._getErrorObject()))
                    .commit();
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
                name:           binding.get('teamForm.name'),
                description:    binding.get('teamForm.description'),
                sportId:        binding.get('teamForm.sportId'),
                schoolId:       self.activeSchoolId,
                ages:           binding.toJS('teamForm.ages'),
                gender:         binding.get('teamForm.gender'),
                tempTeam:       false
            };

            // Set houseId if team is house team
            binding.get('teamForm.houseId') && (team.houseId = binding.get('teamForm.houseId'));

            window.Server.teamsBySchoolId.post( self.activeSchoolId, team )
                .then(team => {
                    const players = binding.get('teamForm.players').toJS();

                    return Promise.all(players.map( player => {
                        const body = {
                            userId:     player.id,
                            sub:        player.sub ? player.sub : false,
                            position:   player.position
                        };

                        return window.Server.teamPlayers.post(
                            {
                                schoolId:   self.activeSchoolId,
                                teamId:     team.id
                            },
                            body
                        );
                    })).then( _ => {
                        document.location.hash = '/#school_admin/teams';

                        return team;
                    });
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