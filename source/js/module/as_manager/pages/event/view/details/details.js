const	React			= require('react');

const	PencilButton	= require('../../../../../ui/pencil_button'),
		If				= require('../../../../../ui/if/if');

const	TextBlock		= require('./details_components/text_block/text_block'),
		TimeBlock		= require('./details_components/time_block/time_block'),
		Personal		= require('./details_components/personal/personal'),
		Consts			= require('./details_components/consts');

const	DetailsStyle	= require('../../../../../../../styles/ui/b_details.scss');

const Details = React.createClass({
	propTypes:{
		name:				React.PropTypes.string.isRequired,
		officialName:		React.PropTypes.string.isRequired,
		venue:				React.PropTypes.string.isRequired,
		description:		React.PropTypes.string,
		kitNotes:			React.PropTypes.string,
		comments:			React.PropTypes.string,
		teamDeparts:		React.PropTypes.string,
		teamReturns:		React.PropTypes.string,
		meetTime:			React.PropTypes.string,
		teaTime:			React.PropTypes.string,
		lunchTime:			React.PropTypes.string,
		staff:				React.PropTypes.array.isRequired,
		handleChange:		React.PropTypes.func.isRequired,
		onSave:				React.PropTypes.func.isRequired,
		onCancel:			React.PropTypes.func.isRequired,
		role:				React.PropTypes.string.isRequired,
		activeSchoolId:		React.PropTypes.string.isRequired
	},
	getInitialState: function() {
		return {
			viewMode: Consts.REPORT_FILED_VIEW_MODE.VIEW
		};
	},
	/**
	 * Get array of coaches from staff array
	 * @returns {*}
	 */
	getCoaches: function() {
		return this.props.staff.filter(s => s.staffRole === Consts.STAFF_ROLES.COACH);
	},
	/**
	 * Return active coach permission for active school from user object.
	 * @param user
	 * @returns {*}
	 */
	getCoachPermissionFromUser: function(user) {
		const permissions =  user.permissions.filter(p =>
			(p.preset === 'COACH' || p.preset === "TEACHER") &&
			p.schoolId === this.props.activeSchoolId &&
			p.status === 'ACTIVE'
		);

		// What if user has more then one active coach roles for current school?
		// It's impossible. But suddenly?
		return permissions.length !== 0 ? permissions[0] : {};
	},
	getMembersOfStaffPermissionFromUser: function(user) {
		const permissions =  user.permissions.filter(p =>
			p.schoolId === this.props.activeSchoolId &&
			p.status === 'ACTIVE'
		);

		//TODO What if user has more then one active roles for current school?
		return permissions[0];
	},
	/**
	 * Get array of staff members from staff array
	 * @returns {*}
	 */
	getMembersOfStaff: function() {
		return this.props.staff.filter(s => s.staffRole === Consts.STAFF_ROLES.MEMBER_OF_STAFF);
	},
	/**
	 * Click handler for edit button.
	 * Change view mode from view to edit and vice versa
	 */
	handleClickEditButton: function() {
		this.setState({viewMode: Consts.REPORT_FILED_VIEW_MODE.EDIT});
	},
	/**
	 * Handler for new coach.
	 * Add new coach to staff array and call handleChange for updStaff.
	 * @param user
	 */
	handleChangeCoaches: function(user) {
		const updStaff = this.props.staff;

		const permission = this.getCoachPermissionFromUser(user);

		if(typeof permission !== "undefined") {
			updStaff.push({
				userId			: user.id,
				permissionId	: permission.id,
				staffRole		: Consts.STAFF_ROLES.COACH,
				firstName		: user.firstName,
				lastName		: user.lastName
			});

			this.props.handleChange('staff', updStaff);
		}
	},
	/**
	 * Handler for delete any personal.
	 * Delete current personal from staff array and call handleChange for updStaff.
	 * @param user
	 */
	handleDeletePersonal: function(user) {
		let updStaff = this.props.staff;

		const foundStaffIndex = updStaff.findIndex(staff => staff.userId === user.userId && staff.permissionId === user.permissionId);
		updStaff.splice(foundStaffIndex, 1);

		this.props.handleChange('staff', updStaff);
	},
	/**
	 * Handler for new coach.
	 * It's handler for coaches.
	 * @param user
	 */
	handleChangeMembersOfStaff: function(user) {
		const updStaff = this.props.staff;

		const permission = this.getMembersOfStaffPermissionFromUser(user);

		updStaff.push({
			userId			: user.id,
			permissionId	: permission.id,
			staffRole		: Consts.STAFF_ROLES.MEMBER_OF_STAFF,
			firstName		: user.firstName,
			lastName		: user.lastName
		});

		this.props.handleChange('staff', updStaff);
	},
	onCancel: function() {
		this.setState({viewMode: Consts.REPORT_FILED_VIEW_MODE.VIEW});
		this.props.onCancel();
	},
	onSave: function() {
		this.setState({viewMode: Consts.REPORT_FILED_VIEW_MODE.VIEW});
		this.props.onSave();
	},
	renderControlButtons: function() {
		switch (this.state.viewMode) {
			case Consts.REPORT_FILED_VIEW_MODE.VIEW:
				return (
					<div className="eDetails_editButtonWrapper">
						<PencilButton handleClick={this.handleClickEditButton}/>
					</div>
				);
			case Consts.REPORT_FILED_VIEW_MODE.EDIT:
				return (
					<div className="eDetails_editButtonWrapper">
						<div	className	= "bButton mCancel mMarginRight"
								onClick		= {this.onCancel}
						>
							Cancel
						</div>
						<div	className	= "bButton"
								onClick		= {this.onSave}
						>
							Save
						</div>
					</div>
				);
		}
	},
	render: function() {
		return (
			<div className="bDetails">
				<div className="eDetails_column mBig">
					<div className="eDetails_columnContent">
						<div className="eDetails_textBlock">
							<h3 className="eDetails_header">
								{this.props.name}
							</h3>
							<h4 className="eDetails_header mSmall">
								{this.props.officialName}
							</h4>
							<div className="eDetails_body">
								{this.props.venue}
							</div>
						</div>
						<TextBlock	header={"Event Description"}
									text={this.props.description}
									mode={this.state.viewMode}
									handleChange={this.props.handleChange.bind(null, 'description')}
							/>
						<TextBlock	header={"Kit notes"}
									text={this.props.kitNotes}
									mode={this.state.viewMode}
									handleChange={this.props.handleChange.bind(null, 'kitNotes')}
							/>
						<TextBlock	header={"Comments"}
									text={this.props.comments}
									mode={this.state.viewMode}
									handleChange={this.props.handleChange.bind(null, 'comments')}
							/>
					</div>
				</div>
				<div className="eDetails_column">
					<div className="eDetails_columnContent mGrayBackground  mWithoutPadding">
							<If condition={this.props.role !=='PARENT' && this.props.role !== 'STUDENT'}>
								{this.renderControlButtons()}
							</If>
							<If condition={this.props.role === 'PARENT' || this.props.role === 'STUDENT'}>
								<div className="eDetails_spacing" />
							</If>
						<div className="eDetails_infoContainer">
							<div className="eDetails_header">
								Coach
							</div>
							<Personal	mode			= {this.state.viewMode}
										activeSchoolId	= {this.props.activeSchoolId}
										personalList	= {this.getCoaches()}
										personalType	= {Consts.STAFF_ROLES.COACH}
										handleChange	= {this.handleChangeCoaches}
										handleDelete	= {this.handleDeletePersonal}
							/>
						</div>
						<div className="eDetails_infoContainer">
							<div className="eDetails_header">
								Members of staff
							</div>
							<Personal	mode			= {this.state.viewMode}
										activeSchoolId	= {this.props.activeSchoolId}
										personalList	= {this.getMembersOfStaff()}
										personalType	= {Consts.STAFF_ROLES.MEMBER_OF_STAFF}
										handleChange	= {this.handleChangeMembersOfStaff}
										handleDelete	= {this.handleDeletePersonal}
							/>
						</div>
						<div className="eDetails_infoContainer">
							<TimeBlock	label={"Team departs"}
										dateString={this.props.teamDeparts}
										mode={this.state.viewMode}
										handleChange={this.props.handleChange.bind(null, 'teamDeparts')}
								/>
							<TimeBlock	label={"Team returns"}
										dateString={this.props.teamReturns}
										mode={this.state.viewMode}
										handleChange={this.props.handleChange.bind(null, 'teamReturns')}
								/>
							<TimeBlock	label={"Meet time"}
										dateString={this.props.meetTime}
										mode={this.state.viewMode}
										handleChange={this.props.handleChange.bind(null, 'meetTime')}
								/>
							<TimeBlock	label={"Tea time"}
										dateString={this.props.teaTime}
										mode={this.state.viewMode}
										handleChange={this.props.handleChange.bind(null, 'teaTime')}
								/>
							<TimeBlock	label={"Lunch time"}
										dateString={this.props.lunchTime}
										mode={this.state.viewMode}
										handleChange={this.props.handleChange.bind(null, 'lunchTime')}
								/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Details;

