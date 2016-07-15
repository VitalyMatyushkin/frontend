/**
 * Created by Anatoly on 09.06.2016.
 */
const 	React 		= require('react'),
		SVG 		= require('module/ui/svg');

const Avatar = React.createClass({
	propTypes:{
		pic:React.PropTypes.string,
		minValue:React.PropTypes.string
	},
	getDefaultProps: function () {
		return {
			minValue: 50
		};
	},
	render:function(){
		let img = null;

		if(this.props.pic) {
			const style = {backgroundImage: `url(${window.Server.images.getResizedToMinValueUrl(this.props.pic, this.props.minValue)})`};
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