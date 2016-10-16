/**
 * Created by Anatoly on 09.06.2016.
 * Updated by Alex on 14.10.2016
 */
const 	React 				= require('react'),
		SVG 				= require('module/ui/svg'),
		DEFAULT_PIC_SIZE	= 50;	// very default value

function Avatar(props) {
	let 	img			= null,
			minValue	= props.minValue || DEFAULT_PIC_SIZE;

	if(props.pic) {
		const style = {backgroundImage: `url(${window.Server.images.getResizedToMinValueUrl(props.pic, minValue)})`};
		img = <div className="eImg" style={style}></div>;
	}

	return (
		<div className="eAvatar">
			<SVG icon="icon_avatar_plug"/>
			{img}
		</div>
	);
}

Avatar.propTypes = {
	pic:		React.PropTypes.string,
	minValue:	React.PropTypes.number
};

module.exports = Avatar;