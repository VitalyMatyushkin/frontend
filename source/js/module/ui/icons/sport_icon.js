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
			case 	sport === 'football' ||
					sport === 'football indoor':
				icon = "ball";
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
				icon = "canoening";
				break;
			case 	sport === 'canoeing (team)':
				icon = "canoening_2";
				break;
			case 	sport === 'boccia (1x1)':
				icon = "boccia_1x1";
				break;
			case 	sport === 'boccia (2x2)':
				icon = "boccia_2x2";
				break;
			case 	sport === 'boccia (boccia_team)':
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

