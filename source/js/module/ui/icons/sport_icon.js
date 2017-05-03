// @flow
/**
 * Created by Anatoly on 02.03.2016.
 */

const 	React 	= require('react'),
		SVG 	= require('module/ui/svg');

/** Renders sport icon as SVG: ball, bat, and so on */
const SportIcon = React.createClass({
	propTypes: {
		name: 		React.PropTypes.string.isRequired,
		title:		React.PropTypes.string,
		className: 	React.PropTypes.string
	},
	/**
	 * Picking proper sport icon by sport name
	 * @param sport {string} sport name
	 * @returns {string} style name to apply on SVG
	 */
	getSportIcon:function(sport: string): string {
		let icon;
		sport = sport ? sport.trim().toLowerCase() : '';
		switch (true){
			case 	sport === 'football':
				icon = "ball";
				break;
			case 	sport === 'football indoor':
				icon = "ball_indoor";
				break;
			case 	sport === 'futsal':
				icon = "footsal";
				break;
			case sport === 'football 5-a-side':
				icon = "football_five";
				break;
			case 	sport === 'rugby union' ||
					sport === 'tag rugby' ||
					sport === 'rugby league':
				icon = "rugby_union";
				break;
			case 	sport === 'rugby sevens':
				icon = "rugby_sevens";
				break;
			case 	sport === 'rugby tens':
				icon = "rugby_tens";
				break;
			case 	sport === 'sprint (60 m)' ||
					sport === 'sprint (100 m)' ||
					sport === 'sprint (200 m)' ||
					sport === 'sprint (400 m)':
				icon = "road_running";
				break;
			case 	sport === 'relay (4x100 metres)' ||
					sport === 'relay (4x400 metres)':
				icon = "relay";
				break;
			case 	sport === 'hurdles (50 m)' ||
					sport === 'hurdles (55 m)' ||
					sport === 'hurdles (60 m)' ||
					sport === 'hurdles (80 m)' ||
					sport === 'hurdles (100 m)' ||
					sport === 'hurdles (110 m)' ||
					sport === 'hurdles (200 m)' ||
					sport === 'hurdles (300 m)' ||
					sport === 'hurdles (400 m)':
				icon = "hourdles";
				break;
			case 	sport === 'tennis singles' ||
					sport === 'tennis doubles' ||
					sport === 'tennis mixed doubles':
				icon = "tennis";
				break;
			case 	sport === 'table tennis singles' ||
					sport === 'table tennis doubles':
				icon = "table_tennis";
				break;
			case 	sport === 'netball high 5':
				icon = "netball_five";
				break;
			case 	sport === 'hockey indoor':
				icon = "hockey_indoor";
				break;
			case 	sport === 'chess (individual)' ||
					sport === 'chess (team)':
				icon = "chess";
				break;
			case 	sport === 'badminton singles' ||
					sport === 'badminton doubles':
				icon = "badminton";
				break;
			case 	sport === 'squash singles' ||
					sport === 'squash doubles':
				icon = "squash";
				break;
			case 	sport === 'golf (individual)' ||
					sport === 'golf (team)':
				icon = "golf";
				break;
			case 	sport === 'tri golf (individual)' ||
					sport === 'tri golf (team)':
				icon = "tri_golf";
				break;
			case 	sport === 'orienteering (individual)' ||
					sport === 'orienteering (team)' ||
					sport === 'orienteering':
				icon = "orienteering";
				break;
			case 	sport === 'american football':
				icon = "american_football";
				break;
			case 	sport === 'sports hall athletics':
				icon = "athletics";
				break;
			case 	sport === 'hammer throw':
				icon = "hammer_throw";
				break;
			case 	sport === 'water polo':
				icon = "water_polo";
				break;
			case 	sport === 'mini golf':
				icon = "mini_golf";
				break;
			case 	sport === 'javelin throw':
				icon = "javelin_throw";
				break;
			case 	sport === 'discus throw':
				icon = "discus_throw";
				break;
			case 	sport === 'shot put':
				icon = "shot_put";
				break;
			case 	sport === 'long jump':
				icon = "long_jump";
				break;
			case 	sport === 'high jump':
				icon = "high_jump";
				break;
			case 	sport === 'cycling':
				icon = "bicycling";
			break;
			case 	sport === 'swimming relays':
				icon = "swimming";
			break;
			case 	sport === 'bowling (individual)' ||
					sport === 'bowling (team)':
				icon = "bowling";
				break;
			case 	sport === 'darts (individual)' ||
					sport === 'darts (team)':
				icon = "darts";
				break;
			case 	sport === 'mini golf (individual)' ||
					sport === 'mini golf (team)':
				icon = "mini_golf";
				break;
			case 	sport === 'rowing (individual)' ||
					sport === 'rowing (team)':
				icon = "rowing";
				break;
			case 	sport === 'shooting (individual)' ||
					sport === 'shooting (team)':
				icon = "shooting";
				break;
			case 	sport === 'dressage' ||
					sport === 'cross-country equestrianism' ||
					sport === 'show jumping':
				icon = "equestrian";
				break;
			case 	sport === 'road running (5 kilometres, 3.1 mi)' ||
					sport === 'road running (8 kilometres, 5.0 mi)' ||
					sport === 'road running (10 kilometres, 6.2 mi)' ||
					sport === 'road running (12 kilometres, 7.5 mi)' ||
					sport === 'road running (15 kilometres, 9.3 mi)' ||
					sport === 'road running (16 kilometres, 10 mi)' ||
					sport === 'road running (20 kilometres, 12 mi)' ||
					sport === 'road running (half-marathon)' ||
					sport === 'road running (25 kilometres, 16 mi)' ||
					sport === 'road running (30 kilometres, 19 mi)' ||
					sport === 'road running (marathon)':
				icon = "road_running";
				break;
			case 	sport === 'fives (eton)' ||
					sport === 'fives (rugby)':
				icon = "fives";
				break;
			case 	sport === 'hockey sevens':
				icon = "hockey_sevens";
				break;
			case 	sport === 'cross-country running':
				icon = "cross-country";
				break;
			case 	sport === 'canoeing (individual)':
				icon = "canoening_individual";
				break;
			case 	sport === 'canoeing (team)':
				icon = "canoening_team";
				break;
			case 	sport === 'boccia (1x1)':
				icon = "boccia_1x1";
				break;
			case 	sport === 'boccia (2x2)':
				icon = "boccia_2x2";
				break;
			case 	sport === 'boccia (team)':
				icon = "boccia_team";
				break;
			case 	sport === 'stoolball':
				icon = "stoolball";
				break;
			case 	sport === 'cricket t20':
				icon = "cricket_2";
				break;
			case 	sport === 'golf sixes (individual)' ||
					sport === 'golf sixes (team)':
				icon = "golf_sixes";
				break;
			case 	sport === 'new age kurling':
				icon = "curling_newage";
				break;
			case sport === 'athletics (mini tournament)':
				icon="athletics_mini_tournament";
				break;
			case sport === 'badminton (mini tournament)':
				icon="badminton_mini_tournament";
				break;
			case sport === 'basketball (mini tournament)':
				icon="basketball_mini_tournament";
				break;
			case sport === 'boccia (mini tournament)':
				icon="boccia_mini_tournament";
				break;
			case sport === 'cricket (mini tournament)':
				icon="cricket_mini_tournament";
				break;
			case sport === 'cricket sixes (mini tournament)':
				icon="cricket_sixes_mini_tournament";
				break;
			case sport === 'cricket t20 (mini tournament)':
				icon="cricket_2_mini_tournament";
				break;
			case sport === 'cross-country running (mini tournament)':
				icon="cross-country_mini_tournament";
				break;
			case sport === 'football (mini tournament)':
				icon="ball_mini_tournament";
				break;
			case sport === 'football 5-a-side (mini tournament)':
				icon="football_five_mini_tournament";
				break;
			case sport === 'football indoor (mini tournament)':
				icon="ball_indoor_mini_tournament";
				break;
			case sport === 'futsal (mini tournament)':
				icon="footsal_mini_tournament";
				break;
			case sport === 'golf (mini tournament)':
				icon="golf_mini_tournament";
				break;
			case sport === 'golf sixes (mini tournament)':
				icon="golf_sixes_mini_tournament";
				break;
			case sport === 'hockey (mini tournament)':
				icon="hockey_mini_tournament";
				break;
			case sport === 'hockey indoor (mini tournament)':
				icon="hockey_indoor_mini_tournament";
				break;
			case sport === 'mini golf (mini tournament)':
				icon="mini_golf_mini_tournament";
				break;
			case sport === 'mini olympic games (mini tournament)':
				icon="mini_olympic_games_mini_tournament";
				break;
			case sport === 'netball (mini tournament)':
				icon="netball_mini_tournament";
				break;
			case sport === 'netball high 5 (mini tournament)':
				icon="netball_five_mini_tournament";
				break;
			case sport === 'new age kurling (mini tournament)':
				icon="curling_newage_mini_tournament";
				break;
			case sport === 'rounders (mini tournament)':
				icon="rounders_mini_tournament";
				break;
			case sport === 'rowing (mini tournament)':
				icon="rowing_mini_tournament";
				break;
			case sport === 'rugby league (mini tournament)':
				icon="rugby_mini_tournament";
				break;
			case sport === 'rugby union (mini tournament)':
				icon="rugby_union_mini_tournament";
				break;
			case sport === 'rugby sevens (mini tournament)':
				icon="rugby_sevens_mini_tournament";
				break;
			case sport === 'rugby tens (mini tournament)':
				icon="rugby_tens_mini_tournament";
				break;
			case sport === 'sports hall athletics (mini tournament)':
				icon="sports_hall_athletics_mini_tournament";
				break;
			case sport === 'stoolball (mini tournament)':
				icon="stoolball_mini_tournament";
				break;
			case sport === 'streetball':
				icon="streetball";
				break;
			case sport === 'swimming (mini tournament)':
				icon="swimming_mini_tournament";
				break;
			case sport === 'tennis (mini tournament)':
				icon="tennis_mini_tournament";
				break;
			default:
				icon = sport;
				break;
		}
		return ("icon_" + icon);
	},
	render:function(){
		const icon = this.getSportIcon(this.props.name);

		if(!!this.props.name) {
			return <SVG title={this.props.title} classes={this.props.className} icon={icon} />;
		} else {
			return null;
		}
	}
});

module.exports = SportIcon;

