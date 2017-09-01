const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		Promise			= require('bluebird'),
		propz			= require('propz');

const	Loader			= require('module/ui/loader'),
		TeamForm		= require('module/as_manager/pages/school_admin/teams/team_form'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper');


const TeamEditPage = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        const   self    = this,
                binding = self.getDefaultBinding();

        binding.clear();

        self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

        self._initFormBinding();
    },
    componentWillUnmount: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        binding.clear();
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
     /**
     * Get id of current team
     * @returns {*}
     * @private
     */
    _getTeamId: function() {
        const self = this;

        return self.getMoreartyContext().getBinding().toJS('routing.parameters.id');
    },
    convertGenderToClientValue: function(gender) {
        switch (gender) {
            case 'MALE_ONLY':
                return 'maleOnly';
            case 'FEMALE_ONLY':
                return 'femaleOnly';
            case 'MIXED':
                return 'mixed';
        }
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
            team;

		binding.set('isSync', false);

        // TODO refactor
        //get school data
        window.Server.school.get(self.activeSchoolId)
            .then( _schoolData => {
                schoolData = _schoolData;

                // get forms data
                return window.Server.schoolForms.get(self.activeSchoolId, {filter:{limit:1000}});
            })
            .then( formsData => {
                schoolData.forms = formsData;

                // get sports data
                return window.Server.sports.get({
                    filter: {
                        where: {
                            players: {
                                $nin: ['1X1', 'INDIVIDUAL']
                            }
                        },
                        limit: 100
                    }
                });
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

                return window.Server.teamPlayers.get(
                    {
                        schoolId:	team.schoolId,
                        teamId:		team.id
                    },
                    {
                        filter: {
                            limit: 100
                        }
                    }
                )
            })
            .then(users => {
                const	gender	= self.convertGenderToClientValue(team.gender),
						houseId	= propz.get(team, ['house', 'id']),
						filter	= TeamHelper.getTeamManagerSearchFilter(
							schoolData,
							team.ages,
							gender,
							houseId
						);

                return binding
                    .atomically()
					.set('isSync',										true)
                    .set('teamForm.school',                             Immutable.fromJS(schoolData))
                    .set('teamForm.name',                               Immutable.fromJS(team.name))
                    .set('teamForm.description',                        Immutable.fromJS(team.description))
                    .set('teamForm.sportId',                            Immutable.fromJS(team.sportId))
                    .set('teamForm.sportModel',                         Immutable.fromJS(team.sport))
                    .set('teamForm.sports',                             Immutable.fromJS(sports))
                    .set('teamForm.gender',                             Immutable.fromJS(gender))
                    .set('teamForm.availableAges',                      Immutable.fromJS(TeamHelper.getAges(schoolData)))
                    .set('teamForm.ages',                               Immutable.fromJS(team.ages))
                    .set('teamForm.isHouseFilterEnable',                Immutable.fromJS(self._isHouseFilterEnable(team)))
                    .set('teamForm.isHouseSelected',                    Immutable.fromJS(self._isHouseFilterEnable(team)))
                    // TODO need comment
                    .set('teamForm.isHouseAutocompleteInit',            Immutable.fromJS(!self._isHouseFilterEnable(team)))
                    .set('teamForm.house',                              Immutable.fromJS(team.house))
                    .set('teamForm.___teamManagerBinding.teamStudents', Immutable.fromJS(users))
                    .set('teamForm.___teamManagerBinding.positions',    Immutable.fromJS(team.sport.field.positions))
                    .set('teamForm.___teamManagerBinding.filter',       Immutable.fromJS(filter))
                    .set('teamForm.___houseAutocompleteBinding',        Immutable.fromJS({}))
                    .set('initialPlayers',                              Immutable.fromJS(users))
                    .commit();
            });
    },
    _submitEdit: function() {
        const   self    = this,
                binding = self.getDefaultBinding(),
                teamId  = self._getTeamId();

        TeamHelper.validate(binding);

        if(!binding.toJS('teamForm.error.isError')) {
            const updatedTeam = {
                name:        binding.get('teamForm.name'),
                description: binding.get('teamForm.description'),
                sportId:     binding.get('teamForm.sportId'),
                ages:        binding.toJS('teamForm.ages'),
                gender:      TeamHelper.convertGenderToServerValue(binding.toJS('teamForm.gender')),
                schoolId:    MoreartyHelper.getActiveSchoolId(self)
            };

            binding.get('teamForm.houseId') && (updatedTeam.houseId = binding.get('teamForm.houseId'));

            window.Server.team.put(
                {
                    schoolId:   self.activeSchoolId,
                    teamId:     self._getTeamId()
                },
                updatedTeam
            ).then( () => {
                const   players         = binding.get('teamForm.___teamManagerBinding.teamStudents').toJS(),
                        initialPlayers  = binding.get('initialPlayers').toJS();

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
        const   self    = this,
                binding = self.getDefaultBinding();

		if(binding.toJS('isSync')) {
			return (
				<TeamForm
					title			= "Edit team..."
					onFormSubmit	= { self._submitEdit }
					binding			= { binding.sub('teamForm') }
				/>
			);
		} else {
			return (
				<div className="eSchoolMaster_loaderContainer">
					<Loader condition={true}/>
				</div>
			);
		}
    }
});

module.exports = TeamEditPage;