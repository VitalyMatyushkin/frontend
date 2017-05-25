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
				 	sport === 'sprint  60m' || //TODO: replace extra spaces in sport name and then delete it
				 	sport === 'sprint 60m' ||
					sport === 'sprint (100 m)' ||
					sport === 'sprint 100m' ||
					sport === 'sprint (200 m)' ||
					sport === 'sprint 200m' ||
					sport === 'sprint (400 m)' ||
					sport === 'sprint 400m' ||
					sport === 'sprint  50m' || //TODO: replace extra spaces in sport name and then delete it
					sport === 'sprint 50m' ||
					sport === 'sprint 300m' ||
					sport === 'sprint  75m' || //TODO: replace extra spaces in sport name and then delete it
					sport === 'sprint 75m' ||
					sport === 'sprint  80m' || //TODO: replace extra spaces in sport name and then delete it
					sport === 'sprint 80m' ||
					sport === 'sprint  55m' || //TODO: replace extra spaces in sport name and then delete it
					sport === 'sprint 55m':
				icon = "road_running";
				break;
			case 	sport === 'relay (4x100 metres)' ||
					sport === 'relay (4x400 metres)':
				icon = "relay";
				break;
			case 	sport === 'hurdles (50 m)' ||
				 	sport === 'hurdles  50m' || //TODO: replace extra spaces in sport name and then delete it
				 	sport === 'hurdles 50m' ||
					sport === 'hurdles (55 m)' ||
					sport === 'hurdles  55m' || //TODO: replace extra spaces in sport name and then delete it
					sport === 'hurdles 55m' ||
					sport === 'hurdles (60 m)' ||
					sport === 'hurdles  60m' || //TODO: replace extra spaces in sport name and then delete it
					sport === 'hurdles 60m' ||
					sport === 'hurdles (80 m)' ||
					sport === 'hurdles  80m' || //TODO: replace extra spaces in sport name and then delete it
					sport === 'hurdles 80m' ||
					sport === 'hurdles (100 m)' ||
					sport === 'hurdles 100m' ||
					sport === 'hurdles (110 m)' ||
					sport === 'hurdles 110m' ||
					sport === 'hurdles (200 m)' ||
					sport === 'hurdles 200m' ||
					sport === 'hurdles (300 m)' ||
					sport === 'hurdles 300m' ||
					sport === 'hurdles (400 m)' ||
					sport === 'hurdles 400m':
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
					sport === 'chess (i)' ||
					sport === 'chess (team)' ||
					sport === 'chess (t)':
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
					sport === 'golf (i)' ||
					sport === 'golf (team)' ||
					sport === 'golf (t)':
				icon = "golf";
				break;
			case 	sport === 'tri golf (individual)' ||
					sport === 'tri golf (i)' ||
					sport === 'tri golf (team)' ||
					sport === 'tri golf (t)':
				icon = "tri_golf";
				break;
			case 	sport === 'orienteering (individual)' ||
				 	sport === 'orienteering (i)' ||
					sport === 'orienteering (team)' ||
					sport === 'orienteering (t)' ||
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
			case 	sport === 'swimming relays' ||
					sport === 'swimming freestyle   50m'|| //TODO: replace extra spaces in sport name and then delete it
					sport === 'swimming freestyle 50m' ||
					sport === 'swimming freestyle  100m' || //TODO: replace extra spaces in sport name and then delete it
					sport === 'swimming freestyle 100m' ||
					sport === 'swimming freestyle  200m' ||  //TODO: replace extra spaces in sport name and then delete it
					sport === 'swimming freestyle 200m' ||
					sport === 'swimming freestyle  400m' || //TODO: replace extra spaces in sport name and then delete it
					sport === 'swimming freestyle 400m' ||
					sport === 'swimming freestyle  800m' || //TODO: replace extra spaces in sport name and then delete it
					sport === 'swimming freestyle 800m' ||
					sport === 'swimming freestyle 1500m' ||
					sport === 'swimming backstroke  50m' || //TODO: replace extra spaces in sport name and then delete it
					sport === 'swimming backstroke 50m' ||
					sport === 'swimming backstroke 100m' ||
					sport === 'swimming backstroke 200m' ||
					sport === 'swimming breaststroke  50m' ||  //TODO: replace extra spaces in sport name and then delete it
					sport === 'swimming breaststroke 50m' ||
					sport === 'swimming breaststroke 100m' ||
					sport === 'swimming breaststroke 200m' ||
					sport === 'swimming butterfly  50m' ||  //TODO: replace extra spaces in sport name and then delete it
					sport === 'swimming butterfly 50m' ||
					sport === 'swimming butterfly 100m' ||
					sport === 'swimming butterfly 200m' ||
					sport === 'swimming relays 4×100m freestyle' ||
					sport === 'swimming relays 4×200m freestyle' ||
					sport === 'swimming relays 4×100m medley' ||
					sport === 'swimming individual medley 100m' ||
					sport === 'swimming individual medley 200m' ||
					sport === 'swimming individual medley 400m':
				icon = "swimming";
			break;
			case 	sport === 'bowling (individual)' ||
					sport === 'bowling (i)' ||
					sport === 'bowling (team)' ||
					sport === 'bowling (t)':
				icon = "bowling";
				break;
			case 	sport === 'darts (individual)' ||
				 	sport === 'darts (i)' ||
					sport === 'darts (team)' ||
					sport === 'darts (t)':
				icon = "darts";
				break;
			case 	sport === 'mini golf (individual)' ||
				 	sport === 'mini golf (i)' ||
					sport === 'mini golf (team)' ||
					sport === 'mini golf (t)':
				icon = "mini_golf";
				break;
			case 	sport === 'rowing (individual)' ||
				 	sport === 'rowing (i)' ||
					sport === 'rowing (team)' ||
					sport === 'rowing (t)':
				icon = "rowing";
				break;
			case 	sport === 'shooting (individual)' ||
				 	sport === 'shooting (i)' ||
					sport === 'shooting (team)' ||
					sport === 'shooting (t)':
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
					sport === 'road running (marathon)' ||
					sport === 'road running  5km' || //TODO: replace extra spaces in sport name and then delete it
					sport === 'road running 5km' ||
					sport === 'road running  8km' || //TODO: replace extra spaces in sport name and then delete it
					sport === 'road running 8km' ||
					sport === 'road running 10km' ||
					sport === 'road running 12km' ||
					sport === 'road running 15km' ||
					sport === 'road running 16km' ||
					sport === 'road running 20km' ||
					sport === 'road running 25km' ||
					sport === 'road running 30km' ||
					sport === 'road running half-marathon' ||
					sport === 'road running marathon' :
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
			case 	sport === 'canoeing (individual)' ||
					sport === 'canoeing (i)':
				icon = "canoeing_individual";
				break;
			case 	sport === 'canoeing (team)' ||
					sport === 'canoeing (t)':
				icon = "canoening_team";
				break;
			case 	sport === 'boccia (1x1)':
				icon = "boccia_1x1";
				break;
			case 	sport === 'boccia (2x2)':
				icon = "boccia_2x2";
				break;
			case 	sport === 'boccia (team)' ||
					sport === 'boccia (t)' :
				icon = "boccia_team";
				break;
			case 	sport === 'stoolball':
				icon = "stoolball";
				break;
			case 	sport === 'cricket t20':
				icon = "cricket_2";
				break;
			case 	sport === 'golf sixes (individual)' ||
				 	sport === 'golf sixes (i)' ||
					sport === 'golf sixes (team)' ||
					sport === 'golf sixes (t)':
				icon = "golf_sixes";
				break;
			case 	sport === 'new age kurling':
				icon = "curling_newage";
				break;
			case 	sport === 'athletics (mini tournament)' ||
					sport === 'athletics (mt)':
				icon="athletics_mini_tournament";
				break;
			case 	sport === 'badminton (mini tournament)' ||
					sport === 'badminton (mt)':
				icon="badminton_mini_tournament";
				break;
			case 	sport === 'basketball (mini tournament)' ||
					sport === 'basketball (mt)':
				icon="basketball_mini_tournament";
				break;
			case 	sport === 'boccia (mini tournament)' ||
					sport === 'boccia (mt)':
				icon="boccia_mini_tournament";
				break;
			case 	sport === 'cricket (mini tournament)' ||
					sport === 'cricket (mt)':
				icon="cricket_mini_tournament";
				break;
			case 	sport === 'cricket sixes (mini tournament)' ||
					sport === 'cricket sixes (mt)':
				icon="cricket_sixes_mini_tournament";
				break;
			case 	sport === 'cricket t20 (mini tournament)' ||
					sport === 'cricket t20 (mt)':
				icon="cricket_2_mini_tournament";
				break;
			case 	sport === 'cross-country running (mini tournament)' ||
					sport === 'cross-country running (mt)':
				icon="cross-country_mini_tournament";
				break;
			case 	sport === 'football (mini tournament)' ||
					sport === 'football (mt)':
				icon="ball_mini_tournament";
				break;
			case 	sport === 'football 5-a-side (mini tournament)' ||
					sport === 'football 5-a-side (mt)':
				icon="football_five_mini_tournament";
				break;
			case 	sport === 'football indoor (mini tournament)' ||
					sport === 'football indoor (mt)':
				icon="ball_indoor_mini_tournament";
				break;
			case 	sport === 'futsal (mini tournament)' ||
					sport === 'futsal (mt)':
				icon="footsal_mini_tournament";
				break;
			case 	sport === 'golf (mini tournament)' ||
					sport === 'golf (mt)':
				icon="golf_mini_tournament";
				break;
			case 	sport === 'golf sixes (mini tournament)' ||
					sport === 'golf sixes (mt)':
				icon="golf_sixes_mini_tournament";
				break;
			case 	sport === 'hockey (mini tournament)' ||
					sport === 'hockey (mt)':
				icon="hockey_mini_tournament";
				break;
			case 	sport === 'hockey indoor (mini tournament)' ||
					sport === 'hockey indoor (mt)':
				icon="hockey_indoor_mini_tournament";
				break;
			case 	sport === 'mini golf (mini tournament)' ||
					sport === 'mini golf (mt)':
				icon="mini_golf_mini_tournament";
				break;
			case 	sport === 'mini olympic games (mini tournament)' ||
					sport === 'mini olympic games (mt)':
				icon="mini_olympic_games_mini_tournament";
				break;
			case 	sport === 'netball (mini tournament)' ||
					sport === 'netball (mt)':
				icon="netball_mini_tournament";
				break;
			case 	sport === 'netball high 5 (mini tournament)' ||
					sport === 'netball high 5 (mt)':
				icon="netball_five_mini_tournament";
				break;
			case 	sport === 'new age kurling (mini tournament)' ||
					sport === 'new age kurling (mt)':
				icon="curling_newage_mini_tournament";
				break;
			case 	sport === 'rounders (mini tournament)' ||
					sport === 'rounders (mt)':
				icon="rounders_mini_tournament";
				break;
			case 	sport === 'rowing (mini tournament)' ||
					sport === 'rowing (mt)':
				icon="rowing_mini_tournament";
				break;
			case 	sport === 'rugby league (mini tournament)' ||
					sport === 'rugby league (mt)':
				icon="rugby_mini_tournament";
				break;
			case 	sport === 'rugby union (mini tournament)' ||
					sport === 'rugby union (mt)':
				icon="rugby_union_mini_tournament";
				break;
			case 	sport === 'rugby sevens (mini tournament)' ||
					sport === 'rugby sevens (mt)':
				icon="rugby_sevens_mini_tournament";
				break;
			case 	sport === 'rugby tens (mini tournament)' ||
					sport === 'rugby tens (mt)':
				icon="rugby_tens_mini_tournament";
				break;
			case 	sport === 'sports hall athletics (mini tournament)' ||
					sport === 'sports hall athletics (mt)':
				icon="sports_hall_athletics_mini_tournament";
				break;
			case 	sport === 'stoolball (mini tournament)' ||
					sport === 'stoolball (mt)':
				icon="stoolball_mini_tournament";
				break;
			case sport === 'streetball':
				icon="streetball";
				break;
			case 	sport === 'swimming (mini tournament)' ||
					sport === 'swimming (mt)':
				icon="swimming_mini_tournament";
				break;
			case 	sport === 'swimming (team)' ||
					sport === 'swimming (t)':
				icon="swimming_team";
				break;
			case 	sport === 'tennis (mini tournament)' ||
					sport === 'tennis (mt)':
				icon="tennis_mini_tournament";
				break;
			case 	sport === 'table tennis (mini tournament)' ||
					sport === 'table tennis (mt)':
				icon="table_tennis_mini_tournament";
				break;
			case 	sport === 'hockey sevens (mini tournament)' ||
					sport === 'hockey sevens (mt)':
				icon="hockey_sevens_mini_tournament";
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

