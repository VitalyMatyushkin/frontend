/**
 * Created by Anatoly on 02.03.2016.
 */

const   React   = require('react'),
        SVG     = require('module/ui/svg'),
        If      = require('module/ui/if/if'),

SportIcon = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        className: React.PropTypes.string
    },
    getSportIcon:function(sport){
        let icon;
        switch (sport){
            case 'football':
                icon = "ball";
                break;
            default:
                icon = sport.trim();
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

