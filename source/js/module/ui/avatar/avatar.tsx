import * as React 	from 'react';
import {SVG} 		from 'module/ui/svg';

const DEFAULT_PIC_SIZE: number = 50;	// very default value

export interface StyleImg {
	backgroundImage: string
}

export interface AvatarProps {
	pic?: string,
	minValue?: number
}

export function Avatar(props: AvatarProps) {
	let 	img: any			= null,
			minValue: number 	= props.minValue || DEFAULT_PIC_SIZE;

	if(props.pic) {
		const style: StyleImg = {backgroundImage: `url(${(window as any).Server.images.getResizedToMinValueUrl(props.pic, minValue)})`};
		img = <div className="eImg" style={style}></div>;
	}

	return (
		<div className="eAvatar">
			<SVG icon="icon_avatar_plug"/>
			{img}
		</div>
	);
}