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
            case sport === 'football':
                icon = "ball";
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

