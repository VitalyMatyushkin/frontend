const	React			= require('react'),
		ComboBox		= require('../../../../../../../../ui/autocomplete2/ComboBox2'),
		User			= require('./user'),
		Consts			= require('./../../consts'),
		DetailsStyle	= require('../../../../../../../../../../styles/ui/b_details.scss');

const EditMode = React.createClass({
	propTypes: {
		activeSchoolId	: React.PropTypes.string.isRequired,
		personalList	: React.PropTypes.array,
		personalType	: React.PropTypes.string.isRequired,
		handleChange	: React.PropTypes.func.isRequired,
		handleDelete	: React.PropTypes.func.isRequired
	},
	getPlaceholder: function() {
		switch (this.props.personalType) {
			case Consts.STAFF_ROLES.COACH:
				return 'Add coach name';
			case Consts.STAFF_ROLES.MEMBER_OF_STAFF:
				return 'Add members of staff';
		};
	},
	/**
	 * Return title for element from combobox component
	 * @returns {string}
	 */
	getElementTitle: function(element) {
		return `${element.firstName} ${element.lastName}`;
	},
	/**
	 * Return plug tooltip for combobox component
	 * @returns {string}
	 */
	getElementTooltip: function() {
		return '';
	},
	/**
	 * Search function wrapper for combobox component
	 * @param searchText
	 * @returns {{sync: Array, async: *}}
	 */
	searchUsersWrapper: function(searchText) {
		return {
			sync:  [],
			async: this.searchUsers(searchText)
		};
	},
	/**
	 * Just search users. Call server.
	 * @param searchText
	 * @returns {*}
	 */
	searchUsers: function(searchText) {
		let roles;
		switch (this.props.personalType) {
			case Consts.STAFF_ROLES.COACH:
				roles = ["COACH", "TEACHER"];
				break;
			case Consts.STAFF_ROLES.MEMBER_OF_STAFF:
				roles = ["ADMIN","MANAGER","TEACHER"];
				break;
		};

		return window.Server.users.get({schoolId: this.props.activeSchoolId}, {
			filter: {
				where	: {
					_id: {
						$nin: this.getNinUserId()
					},
					permissions: {
						$elemMatch: {
							preset: { $in: roles },
							status: 'ACTIVE'
						}
					},
					$or: [
						{firstName: {like: searchText, options: 'i'}},
						{lastName: {like: searchText, options: 'i'}}
					]
				},
				limit: 20
			}
		}).then(users => {
			return users.filter(u => {
				const permissions = u.permissions.filter(p => {
					const	isActiveSchool	= p.schoolId === this.props.activeSchoolId,
							isHasRole		= roles.filter(r => r === p.preset).length !== 0;

					return isActiveSchool && isHasRole;
				});

				return permissions.length !== 0;
			});
		});
	},
	/**
	 * Get not include user ids for user search
	 * @returns {*}
	 */
	getNinUserId: function() {
		if(typeof this.props.personalList !== 'undefined') {
			return this.props.personalList.map(user => user.userId);
		} else {
			return [];
		}
	},
	handleSelectPersonal: function(userId, user) {
		this.props.handleChange(user);
	},
	renderPersonalList: function() {
		if(typeof this.props.personalList !== 'undefined') {
			return this.props.personalList.map(user =>
				<User key={user.userId} user={user} handleDelete={this.props.handleDelete} viewMode={Consts.REPORT_FILED_VIEW_MODE.EDIT}/>
			);
		} else {
			return null;
		}
	},
	renderAddPersonalContainer: function() {
		return (
			<div className="eDetails_comboboxWrapper">
				<ComboBox	placeholder			= {this.getPlaceholder()}
							searchFunction		= {this.searchUsersWrapper}
							onSelect			= {this.handleSelectPersonal}
							getElementTitle		= {this.getElementTitle}
							getElementTooltip	= {this.getElementTooltip}
							onEscapeSelection	= {() => {}}
							clearAfterSelect	= {true}
							extraCssStyle		= {'mMembersOfStaff'}
							isBlocked			= {false}
				/>
			</div>
		);
	},
	render: function(){
		return (
			<div>
				{this.renderPersonalList()}
				{this.renderAddPersonalContainer()}
			</div>
		);
	}
});

module.exports = EditMode;