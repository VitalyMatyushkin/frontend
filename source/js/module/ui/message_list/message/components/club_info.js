const	React			= require('react'),
		{ DateHelper }	= require('module/helpers/date_helper'),
		SchoolConst		= require('module/helpers/consts/schools'),
		ClubsConst		= require('module/helpers/consts/clubs'),
		propz			= require('propz'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const ClubInfo = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	getClubAges: function(club) {
		const data = typeof club.ages !== 'undefined' ? club.ages : [];

		return data
			.map(elem => elem === 0 ? 'Reception' : 'Y' + elem)
			.join(", ");
	},
	getGender: function (club) {
		const genders = {
			"MALE_ONLY":	'Boys',
			"FEMALE_ONLY":	'Girls',
			'MIXED':		'Mixed'
		};

		return genders[club.gender];
	},
	getStuff: function (club) {
		if(club.staff.length > 0) {
			return (
				<span>
					Stuff: <br/>
					<ul>
						{ club.staff.map(staff => <li> {staff.firstName} {staff.lastName} </li>) }
					</ul>
				</span>
			);
		} else {
			return null;
		}
	},
	getStartDate: function (club) {
		return DateHelper.toLocalWithMonthName(club.startDate);
	},
	getWeekDays: function (club) {
		return club.days.map(d => ClubsConst.WEEK_DAYS_MAP[d]).join(', ');
	},
	render: function() {
		const club = this.props.message.clubData;

		const clubName = club.name;
		const stuff = this.getStuff(club);
		const gender = this.getGender(club);
		const clubAges = this.getClubAges(club);
		const startTime = `Start time: ${ this.getStartDate(club) }`;
		const weekDays = `Week days: ${ this.getWeekDays(club) }`;

		return (
			<div className="eInvite_content mMessage mMarginBottom">
				<h4>
					A new club is available for booking
				</h4>

				{ clubName } <br/>
				{ `${gender} ${clubAges}` } <br/>
				{ startTime } <br/>
				{ weekDays }  <br/>
				{ stuff }
			</div>
		);
	}
});

module.exports = ClubInfo;