/**
 * Created by Anatoly on 21.04.2016.
 */

const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable');

const	Form				= require('module/ui/form/form'),
		FormField 			= require('module/ui/form/form_field'),
		SchoolListItem		= require('../../../ui/autocomplete2/custom_list_items/school_list_item/school_list_item'),
		roleList			= require('module/data/roles_data'),
		PostcodeSelector	= require('../../../ui/postcode_selector/postcode_selector'),
		GeoSearchHelper		= require('../../../helpers/geo_search_helper'),
    	FormBlock			= require('module/ui/form/form_block/form_block'),
		RoleHelper			= require('module/helpers/role_helper');

const MAX_SPORT_FIELD = 5;

const AddPermissionRequest = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes: {
		onSuccess:		React.PropTypes.func,
		onCancel:		React.PropTypes.func,
		activeSchool:	React.PropTypes.object.isRequired
	},
	getDefaultState:function() {
        return Immutable.Map({
			preset:		'',
			schoolId:	'',
			comment:	'',
			form:		{},
			postcode:	undefined
		});
	},
    componentWillMount:function(){
        this.initCountSportFieldsBlocks();
    },
	componentWillUnmount:function(){
		this.getDefaultBinding().clear();
	},
    initCountSportFieldsBlocks: function() {
        const binding = this.getDefaultBinding();

        const countSportFields = binding.toJS('countSportFields');

        if(typeof countSportFields === 'undefined' || countSportFields < 0) {
            binding.set('countSportFields', 0);
        }
    },
	continueButtonClick:function(model){
		model.preset = model.preset.toUpperCase();

		if(model.studentName)
			model.comment = `Request to be parent of [ ${model.studentName} ] \r\n` + model.comment;

        if (model.preset === RoleHelper.USER_PERMISSIONS.TEACHER ||
            model.preset === RoleHelper.USER_PERMISSIONS.COACH) {
            const sportIds = [];
            for (let field in model.sports) {
                if (typeof model.sports[field] !== 'undefined') {
                    sportIds.push(model.sports[field]);
                }
            }
            model.sportIds = sportIds;
        }
		delete model.sports;
		window.Server.profileRequests.post(model)
			.then(result => {
				return this.props.onSuccess && this.props.onSuccess(result);
			});
		},
	isSchoolSelected: function() {
		const formBinding = this.getDefaultBinding().sub('form');

		return typeof formBinding.meta().toJS('schoolId.value') !== 'undefined' &&
			formBinding.meta().toJS('schoolId.value') !== '';
	},
    isRoleCoachOrTeacherSelected: function() {
        const 	formBinding 	= this.getDefaultBinding().sub('form'),
				selectedRole 	= formBinding.meta().toJS('preset.value');
		return selectedRole === RoleHelper.USER_PERMISSIONS.TEACHER.toLowerCase()
				|| selectedRole === RoleHelper.USER_PERMISSIONS.COACH.toLowerCase();
    },
	getSchoolSelectedId: function() {
		const formBinding = this.getDefaultBinding().sub('form');

		return formBinding.meta().toJS('schoolId.value');
	},
	getPlaceHolderForRoleSelect: function() {
		return this.isSchoolSelected() ? 'Please select role' : "";
	},
    getPlaceHolderForSportSelect: function() {
        return this.isRoleCoachOrTeacherSelected() ? 'Please select sport' : "";
    },
	isRoleSelectDisabled: function() {
		return !this.isSchoolSelected();
	},
	getRoles: function() {
		const	formBinding		= this.getDefaultBinding().sub('form'),
				fullSchoolData	= formBinding.meta('schoolId.fullValue').toJS();
		
		// user roles for active school
		const currentRoles = this.getMoreartyContext().getBinding().toJS('userData.roleList.permissions')
			.filter(p => p.schoolId === this.getSchoolSelectedId())
			.map(p => p.role.toLowerCase());
		
		// if user also have role in this school, we must cut this role from role list
		// but this restriction don't act on parent
		const hasUserCurrentRole = currentRole => {
			if (currentRole !== 'parent') {
				return currentRoles.find(role => role === currentRole);
			}
		};
		// for school union we leave only admin role
		if (fullSchoolData && fullSchoolData.kind === 'SchoolUnion') {
			return roleList.filter(role => !hasUserCurrentRole(role.id) && role.id === 'admin');
		}
		
		//if in school disabled registration student, we must cut role 'student' from role list
		return roleList.filter(role => {
			if (fullSchoolData && fullSchoolData.studentSelfRegistrationEnabled === false && role.id === 'student') {
				return false;
			} else {
				return !hasUserCurrentRole(role.id);
			}
		});
	},
	schoolService: function(schoolName) {
		const postcode = this.getDefaultBinding().toJS('postcode');

		const filter = {
			filter: {
				where: {
					name: {
						like: schoolName,
						options: 'i'
					},
					kind: {
						$in: ['School', 'SchoolUnion']
					},
					/* this param was added later, so it is undefined on some schools. Default value is true.
					 * undefined considered as 'true'. So, just checking if it is not explicitly set to false
					 */
					availableForRegistration: { $ne: false }
				},
				limit: 20
			}
		};

		if(typeof postcode !== 'undefined') {
			filter.filter.where['postcode.point'] = GeoSearchHelper.getUnlimitedGeoSchoolFilter(postcode.point);
		} else {
			filter.filter.order = "name ASC";
		}

		return window.Server.publicSchools.get(filter);
	},
    sportsService: function(sportName) {
		const 	schoolId 	= this.getSchoolSelectedId(),
        		formBinding = this.getDefaultBinding().sub('form'),
				sports = [];
        for(let i = 0; i < MAX_SPORT_FIELD; i++) {
            sports.push(formBinding.meta().toJS(`sports.field${i}.value`));
        }

		const filter = {
			filter: {
				where: {
                    id: {
                        $nin: sports
                    },
					name: {
						like: sportName,
						options: 'i'
					}
				},
				limit: 100,
				order:'name ASC'
			}
		};


        return window.Server.publicSchoolSports.get(schoolId, filter);
    },
    onClickRemoveSportField: function() {
        const	binding					= this.getDefaultBinding(),
            	countSportField = binding.get('countSportFields');

        if (countSportField > 0){
            binding.set('countSportFields', countSportField - 1);
        }

        this.deleteLastSport();
    },
	deleteLastSport: function () {
		const 	binding  = this.getDefaultBinding(),
        		formData = binding.sub('form'),
            	countSportField = binding.get('countSportFields'),
        		fieldData = {
					active:	true,
					error:	false,
					value:	undefined
       			};
        formData.meta().set(`sports.field${countSportField}`,Immutable.fromJS(fieldData));
    },
    clearSports: function () {
        const 	binding  = this.getDefaultBinding(),
				formData = binding.sub('form'),
				countSportField = binding.get('countSportFields'),
				fieldData = {
					active:	true,
					error:	false,
					value:	undefined
				};
        for (let i=0; i<countSportField; ++i){
            formData.meta().set(`sports.field${i}`,Immutable.fromJS(fieldData));
        }
        binding.set('countSportFields', 0);
    },
    onClickAddSportField: function() {
        const 	binding			= this.getDefaultBinding(),
				countSportField = binding.get('countSportFields'),
            	previousField	= binding.sub('form').meta().toJS(`sports.field${countSportField-1}.value`);
        if (countSportField === 0 ||  (previousField !== undefined && countSportField < MAX_SPORT_FIELD)) {
            binding.set('countSportFields', countSportField + 1);
        }
    },
    renderSportBlock: function() {
        const	sportFields = [],
				isVisible = this.isRoleCoachOrTeacherSelected();

        for(let i = 0; i < MAX_SPORT_FIELD; i++) {
            sportFields.push(
                this.renderSportField(i)
            );
        }
        return (
			<FormBlock
				key					= 'sport_fields'
				isShowCloseButton	= { false }
				isVisible			= { isVisible }
			>
                { sportFields }
				{ this.renderAddDeleteSportField() }
			</FormBlock>
        );
    },
    renderSportField: function(i) {
		const	binding					= this.getDefaultBinding(),
            	countSportField 		= binding.get('countSportFields');

        const	isVisible				= i < countSportField;

        return (
			<FormField
				id				= {`sport${i}`}
				type			= "autocomplete"
				field			= {`sports.field${i}`}
				serviceFullData	= { this.sportsService }
				placeholder		= { this.getPlaceHolderForSportSelect() }
				condition       = { isVisible }
			>
				Sport
			</FormField>
		);
	},
    renderAddDeleteSportField: function() {
		return (
			<div>
				<input type			= "submit"
					   onClick		= { this.onClickAddSportField }
					   className	= "bButton"
					   id			= "add-sport-button"
					   value		= "Add Sport"
				/>
				<input type			= "submit"
					   onClick		= { this.onClickRemoveSportField }
					   className	= "bButton"
					   id			= "Delete-sport-button"
					   value		= "Delete Sport"
				/>
			</div>
		);
    },
	handleSelectPostcode: function(id, postcode) {
		this.getDefaultBinding().set('postcode', postcode);
	},
	handleEscapePostcode: function() {
		this.getDefaultBinding().set('postcode', undefined);
	},
	render: function() {
		const	binding		= this.getDefaultBinding(),
				formBinding	= binding.sub('form'),
				isParent	= 	formBinding.meta('preset.value').toJS() === 'parent'
								&& formBinding.meta('schoolId.value').toJS();

		return (
			<Form
				name			= "New Request"
				updateBinding	= { true }
				binding			= { binding.sub('form') }
				onSubmit		= { this.continueButtonClick }
				onCancel		= { this.props.onCancel }
				formStyleClass	= "bGrantContainer"
				defaultButton	= "Submit"
			>
				<div className="eForm_field">
					<div className="eForm_fieldName">
						Postcode
					</div>
					<PostcodeSelector	currentPostcode			= {binding.toJS('postcode')}
										handleSelectPostcode	= {this.handleSelectPostcode}
										handleEscapePostcode	= {this.handleEscapePostcode}
										extraCssStyle 			= {'mInline mRightMargin mWidth250'}
					/>
				</div>
				<FormField
					type			= "autocomplete"
					field			= "schoolId"
					serviceFullData	= { this.schoolService }
					customListItem	= { SchoolListItem }
					placeholder 	= { 'Please select school' }
					validation		= "required"
					onSelect		= { this.clearSports }
				>
					School
				</FormField>
				<FormField
					type		= "select"
					field		= "preset"
					sourceArray	= { this.getRoles() }
					placeHolder	= { this.getPlaceHolderForRoleSelect() }
					isDisabled	= { this.isRoleSelectDisabled() }
					validation	= "required"
				>
					Role
				</FormField>
				{ this.renderSportBlock() }
				<FormField
					type		= "text"
					field		= "studentName"
					isDisabled	= { !isParent }
				>
					Student
				</FormField>
				<FormField
					type	= "textarea"
					field	= "comment"
				>
					Comment
				</FormField>
			</Form>
		);
	}
});

module.exports = AddPermissionRequest;