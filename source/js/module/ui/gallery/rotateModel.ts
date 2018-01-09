/**
 * Created by vitaly on 15.09.17.
 */

import * as BPromise from 'bluebird';

export function isCanvasSupported() {
	return !!document.createElement('canvas').getContext;
}

export function rotateImage(picUrl: any, angle: number): BPromise<any> {
	const 	canvas = _addCanvasToPage(),
			image = document.createElement('img');
	return _loadImage(picUrl, image, canvas)
			.then(result => _drawRotateCanvas(angle, result.image, result.canvas))
			.finally(_deleteCanvasFromPage(canvas));
}

function _loadImage(picUrl: string, image: any, canvas: any): any{
	return new BPromise((resolve, reject) => {
		image.crossOrigin = 'anonymous';
		image.onload = () => {
			canvas.width = image.height;
			canvas.height = image.width;
			resolve({image, canvas});
		};
		image.src = picUrl;
		image.onerror = e => reject(e);
	});
}

function _addCanvasToPage(): any{
	const 	canvas = document.createElement('canvas'),
			body = document.getElementsByTagName("body")[0];

	(canvas as any).class = "mDisplayNone";
	body.appendChild(canvas);
	return canvas;
}

function _deleteCanvasFromPage(canvas: any): void{
	const body = document.getElementsByTagName("body")[0];
	body.removeChild(canvas);
}

function _drawRotateCanvas(angle: number, image: any, canvas: any): any{
	const ctx = canvas.getContext("2d");
	ctx.translate( image.height/2, image.width/2);
	ctx.rotate(angle);
	ctx.drawImage( image,-(image.width/2), -(image.height/2));
	return canvas.toDataURL("image/jpeg");
}