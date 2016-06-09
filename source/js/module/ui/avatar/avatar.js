/**
 * Created by Anatoly on 09.06.2016.
 */
const 	React 			= require('react'),
		SVG 			= require('module/ui/svg');

const Avatar = React.createClass({
	propTypes:{
		pic:React.PropTypes.string.isRequired
	},
	render:function(){
		let html;

		if(this.props.pic) {
			const style = {backgroundImage: `url(${window.Server.images.getResizedToBoxUrl(this.props.pic, 100, 100)})`};
			html = <div className="eAvatar" style={style}></div>;
		} else {
			html = (
					<div className="eAvatar">
						<SVG icon="icon_avatar_plug"/>
					</div>
			);
		}

		return html;
	}
});

module.exports = Avatar;