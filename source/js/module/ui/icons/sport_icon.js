// @flow
/**
 * Created by Anatoly on 02.03.2016.
 */

const   React   = require('react'),
        SVG     = require('module/ui/svg');

/** Renders sport icon as SVG: ball, bat, and so on */
const SportIcon = React.createClass({
    propTypes: {
        name:       React.PropTypes.string.isRequired,
		title:		React.PropTypes.string,
        className:  React.PropTypes.string
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
					sport === 'futsal' ||
					sport === 'football 5-a-side' ||
					sport === 'football indoor':
                icon = "ball";
                break;
			case 	sport === 'rugby union' ||
					sport === 'tag rugby':
				icon = "rugby_union";
				break;
			case sport === 'rugby sevens':
				icon = "rugby_sevens";
				break;
			case sport === 'rugby tens':
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
			case sport === 'high 5 netball':
				icon = "netball";
				break;
			case sport === 'hockey indoor':
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
					sport === 'golf (team)' ||
					sport === 'tri golf (individual)' ||
					sport === 'tri golf (team)':
				icon = "golf";
				break;
			case 	sport === 'orienteering (individual)' ||
					sport === 'orienteering (team)' ||
					sport === 'orienteering':
				icon = "orienteering";
				break;
			//no icon
			case 	sport === 'swimming' ||
					sport === 'volleyball' ||
					sport === 'dodgeball' ||
					sport === 'sports hall athletics' ||
					sport === 'handball' ||
					sport === 'american football':
				icon = "empty";
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

