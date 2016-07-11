/**
 * Created by Anatoly on 09.06.2016.
 */
const 	React 			= require('react'),
		SVG 			= require('module/ui/svg');

const Avatar = React.createClass({
	propTypes:{
		pic:React.PropTypes.string
	},
	render:function(){
		let img = null;

		if(this.props.pic) {
			const style = {backgroundImage: `url(${window.Server.images.getResizedToBoxUrl(this.props.pic, 100, 100)})`};
			img = <div className="eImg" style={style}></div>;
		}

		return (
			<div className="eAvatar">
				<SVG icon="icon_avatar_plug"/>
				{img}
			</div>
		);
	}
});

module.exports = Avatar;