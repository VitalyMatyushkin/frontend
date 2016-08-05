const   TeamForm		= require('module/as_manager/pages/school_admin/teams/team_form'),
        Immutable		= require('immutable'),
        MoreartyHelper	= require('module/helpers/morearty_helper'),
        TeamHelper 		= require('module/ui/managers/helpers/team_helper'),
        Morearty		= require('morearty'),
        React			= require('react');

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
                return window.Server.schoolForms.get(self.activeSchoolId, {filter:{limit:1000}});
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
                    .set('teamForm.school',                             Immutable.fromJS(schoolData))
                    .set('teamForm.sports',                             Immutable.fromJS(sportsData))
                    .set('teamForm.availableAges',                      Immutable.fromJS(TeamHelper.getAges(schoolData)))
                    .set('teamForm.___teamManagerBinding.teamStudents', Immutable.fromJS([]))
                    .set('teamForm.___houseAutocompleteBinding',        Immutable.fromJS({}))
                    .set('teamForm.error',                              Immutable.fromJS(self._getErrorObject()))
                    .commit();
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
    convertPlayersToServerValue: function(players) {
        return players.map(p => TeamHelper.getBodyForAddPlayersRequest(p));
    },
    _submitAdd: function() {
        const self = this,
            binding = self.getDefaultBinding();

        TeamHelper.validate(binding);

        if(!binding.toJS('teamForm.error.isError')) {
            const team = {
                name:           binding.toJS('teamForm.name'),
                description:    binding.toJS('teamForm.description'),
                sportId:        binding.toJS('teamForm.sportId'),
                schoolId:       self.activeSchoolId,
                ages:           binding.toJS('teamForm.ages'),
                gender:         TeamHelper.convertGenderToServerValue(binding.toJS('teamForm.gender')),
                players:        self.convertPlayersToServerValue(binding.toJS('teamForm.___teamManagerBinding.teamStudents'))
            };

            // Set houseId if team is house team
            binding.get('teamForm.houseId') && (team.houseId = binding.get('teamForm.houseId'));

            window.Server.teamsBySchoolId.post(self.activeSchoolId, team)
                .then(team => {
                    document.location.hash = '/#school_admin/teams';

                    return team;
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