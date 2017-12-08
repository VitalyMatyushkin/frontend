
/**
 * Created by wert on 13.09.16.
 */

const 	React			= require('react'),
		{SVG}			= require('module/ui/svg'),
		sportConst		= require('module/helpers/consts/sport'),
		userConst		= require('module/helpers/consts/user'),
		ALLOWED_GENDERS	= sportConst.ALLOWED_GENDERS,	// Allowed sport genders, like: male only, female only, mixed..
		GENDERS			= userConst.GENDER;				// concrete user genders: male, female

/** Very simple component to show gender icon.
 * There was a lot of problem with proper gender detection, so I collect all checks and cases together
 * to show icons always right
 **/
function GenderIcon(props) {
	const 	gender 	= props.gender,
			classes	= props.classes;
	switch (true){
		case gender === ALLOWED_GENDERS.FEMALE_ONLY || gender === GENDERS.FEMALE:
			return <SVG classes={classes} icon="icon_woman"/>;
		case gender === ALLOWED_GENDERS.MALE_ONLY || gender === GENDERS.MALE:
			return <SVG classes={classes} icon="icon_man"/>;
		case gender === ALLOWED_GENDERS.MIXED:
			// it can be one icon, but we don't have such an icon
			return <SVG classes={classes} icon="icon_mixed"/>;
		default:
			return <SVG classes={classes} icon="icon_man"/>;
	}
}

GenderIcon.propTypes = {
	gender:		React.PropTypes.string.isRequired,
	classes:	React.PropTypes.string 				// css classes to pass to underlying SVG
};


module.exports = GenderIcon;