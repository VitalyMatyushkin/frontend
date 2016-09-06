/**
 * Created by Anatoly on 02.03.2016.
 */

const   React   = require('react'),
        SVG     = require('module/ui/svg'),
        If      = require('module/ui/if/if');

/** Renders sport icon as SVG: ball, bat, and so on */
const SportIcon = React.createClass({
    propTypes: {
        name:       React.PropTypes.string.isRequired,
        className:  React.PropTypes.string
    },
	/**
	 * Picking proper sport icon by sport name
	 * @param sport {string} sport name
	 * @returns {string} style name to apply on SVG
	 */
    getSportIcon:function(sport){
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

        return(
            <If condition={!!this.props.name}>
                <SVG classes={this.props.className} icon={icon} ></SVG>
            </If>
        );
    }
});

module.exports = SportIcon;

