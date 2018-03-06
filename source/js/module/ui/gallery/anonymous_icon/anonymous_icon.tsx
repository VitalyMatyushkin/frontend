import * as React from 'react';
import { Stage, Layer, Group, Circle, Image } from 'react-konva';
import 'styles/ui/gallery/b_anonymous_icon.scss';
import * as Loader from 'module/ui/loader';

interface AnonymousIconProps {
	getUrlPhoto: () => Promise<string>
	handleSaveClick: (file: any) => void
	handleCancelClick: () => void
	widthImgContainer: number
	heightImgContainer: number
	photoContainerStyle: any
}

interface AnonymousIconState {
	isSync: boolean
	loadImage: HTMLImageElement
	activeIconIndex: number
	icons: Icon[]
	imgWidth: number
	imgHeight: number
	isLoading: boolean
}

interface Icon {
	img: HTMLImageElement
	x: number
	y: number
	width: number
	height: number
	active: boolean
	anchors: {
		name: string
		x: number
		y: number
	}[]
}

export class AnonymousIcon extends React.Component<AnonymousIconProps, AnonymousIconState> {
	readonly widthIcon = 50;
	readonly anchorRadius = 5;
	stageRef: any;

	constructor(props) {
		super(props);
		this.state = {
			isSync: false,
			loadImage: null,
			icons: [],
			activeIconIndex: -1,
			imgWidth: 0,
			imgHeight: 0,
			isLoading: false
		};
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.widthImgContainer !== this.props.widthImgContainer || nextProps.heightImgContainer !== this.props.heightImgContainer) {
			const {imgWidth, imgHeight} = this.getImgParameters(this.state.loadImage, nextProps.widthImgContainer, nextProps.heightImgContainer)
			this.setState({imgWidth, imgHeight});
		}
	}

	componentDidMount() {
		this.props.getUrlPhoto()
			.then(imgServerUrl => {
				return (window as any).Server.images.getOriginalUrlByImgServerUrl(`${imgServerUrl}?direct_url=true`)
			})
			.then(data => {
			const picUrl = `${data.data.url}?t=${Date.now()+(Math.random() + 1).toString(36).substring(2)}`,
			image = new (window as any).Image();
			image.crossOrigin = 'anonymous';
			image.src = picUrl;
			image.onload = () => {
				// setState will redraw layer
				// because "image" property is changed
				const {imgWidth, imgHeight} = this.getImgParameters(image, this.props.widthImgContainer, this.props.heightImgContainer);
				this.setState({loadImage: image, isSync: true, imgWidth, imgHeight});
			};
			image.onerror = e => {
				if (e.xhr.status === 413) {
					window.simpleAlert(
						'Too large photo size',
						'Ok',
						() => this.props.handleCancelClick()
					)
				}
			};
		});
	}

	getImgParameters(image, widthImgContainer, heightImgContainer) {
		const   containerRatio = widthImgContainer/ heightImgContainer,
				ratioImg = image.width / image.height;

			let imgWidth, imgHeight;
			if (containerRatio < ratioImg) {
				imgWidth = widthImgContainer;
				imgHeight = Math.floor(1 / ratioImg * widthImgContainer);
			} else {
				imgHeight = heightImgContainer;
				imgWidth = Math.floor(ratioImg * heightImgContainer);
			}

			return {imgWidth, imgHeight};
	}

	addAnonymousIcon(): void {
		const   image = new (window as any).Image(),
				icons = this.state.icons;
		image.crossOrigin = 'anonymous';
		image.src = '/images/smile.png';
		image.onload = () => {
			// setState will redraw layer
			// because "image" property is changed
			const   iconX = this.state.imgWidth/2 - this.widthIcon/2,
					iconY = this.state.imgHeight/2 - this.widthIcon/2,
					anchors = [ {name: 'topLeft', x: iconX, y: iconY},
								{name: 'topRight', x:  this.widthIcon+iconX, y: iconY},
								{name: 'bottomRight', x:  this.widthIcon+iconX, y:  this.widthIcon+iconY},
								{name: 'bottomLeft', x: iconX, y:  this.widthIcon+iconY}];
			icons.push({img: image, x: iconX, y: iconY, width: this.widthIcon, height: this.widthIcon, active: false, anchors: anchors});
			this.setState({
				isSync: true,
				icons,
				activeIconIndex: icons.length-1
			})
		};
	}

	deleteAnonymousIcon(): void {
		const   icons = this.state.icons;

		icons.splice(this.state.activeIconIndex, 1);
		this.setState({
			icons,
			activeIconIndex: -1
		})
	}

	handleSaveClick(): void {
		window.confirmAlert(
			"You can not reverse the changes after saving. Are you sure?",
			"Ok",
			"Cancel",
			() => {
				this.setState({isLoading: true});
				const   scale = this.state.loadImage.width/this.state.imgWidth,
						icons = this.state.icons;
				icons.forEach(icon => {
					icon.width *= scale;
					icon.height *= scale;
					icon.x *= scale;
					icon.y *= scale;
				});
				this.setState({
					activeIconIndex: -1,
					imgWidth: this.state.loadImage.width,
					imgHeight: this.state.loadImage.height,
					icons
				});
				setTimeout(() => {
				const file = this.dataURLtoBlob(this.stageRef.getStage().toDataURL({mimeType: 'image/jpeg', quality: 1}));
				this.props.handleSaveClick(file)
					}, 1500)
			},
			() => {}
		);

	}

	dataURLtoBlob(dataUrl): Blob {
		const 	arrayFromDataUrl	= dataUrl.split(','),
				mimeType 			= arrayFromDataUrl[0].match(/:(.*?);/)[1], //mime type: image/jpeg
				stringFromDataUrl	= window.atob(arrayFromDataUrl[1]); //function decodes a string of data which has been encoded using base-64 encoding

		let 	stringFromDataUrlLength		= stringFromDataUrl.length,
				u8arr 						= new (window as any).Uint8Array(stringFromDataUrlLength);

		while (stringFromDataUrlLength--) {
			u8arr[stringFromDataUrlLength] = stringFromDataUrl.charCodeAt(stringFromDataUrlLength);
		}

		return new (window as any).Blob([u8arr], {type:mimeType});
	}

	handleDragEndIcon(e, index: number): void {
		const   icons = this.state.icons,
				currentIcon = this.state.icons[index];
		currentIcon.x = e.target.x();
		currentIcon.y = e.target.y();
		currentIcon.anchors[0].x = e.target.x();
		currentIcon.anchors[0].y = e.target.y();
		currentIcon.anchors[1].x = e.target.x() + currentIcon.width;
		currentIcon.anchors[1].y = e.target.y();
		currentIcon.anchors[2].x = e.target.x() + currentIcon.width;
		currentIcon.anchors[2].y = e.target.y() + currentIcon.height;
		currentIcon.anchors[3].x = e.target.x();
		currentIcon.anchors[3].y = e.target.y() + currentIcon.height;
		icons[index] = currentIcon;
		this.setState({icons})
	}

	renderAnchors(icon: Icon, index: number): React.ReactNode {
		return icon.anchors.map(anchor => {
			return(
				<Circle
					x={anchor.x}
					y={anchor.y}
					stroke='#666'
					fill='#ddd'
					strokeWidth={2}
					radius={5}
					key={`${anchor.name}${index}`}
					name={`${anchor.name}${index}`}
					draggable={true}
					onDragMove={(e) => this.updateAnchor(e, anchor.name, index)}
				/>
			);
		});
	}

	updateAnchor(e, name: string, index: number): void {
		const   anchorX = e.target.x() < 0 ? 0 : (e.target.x() > this.state.imgWidth ? this.state.imgWidth : e.target.x()),
				icons = this.state.icons,
				currentIcon = this.state.icons[index];

		let differenceX;
		switch (name) {
			case 'topLeft':
				differenceX = anchorX - currentIcon.anchors[0].x;
				if (this.checkYCoordinate(currentIcon.anchors[0].y + differenceX)){
					currentIcon.anchors[0].x = anchorX;
					currentIcon.anchors[0].y += differenceX;
					currentIcon.anchors[1].y += differenceX;
					currentIcon.anchors[3].x = anchorX;
				}
				break;
			case 'topRight':
				differenceX = anchorX - currentIcon.anchors[1].x;
				if (this.checkYCoordinate(currentIcon.anchors[1].y - differenceX)) {
					currentIcon.anchors[1].x = anchorX;
					currentIcon.anchors[1].y -= differenceX;
					currentIcon.anchors[0].y -= differenceX;
					currentIcon.anchors[2].x = anchorX;
				}
				break;
			case 'bottomRight':
				differenceX = anchorX - currentIcon.anchors[2].x;
				if (this.checkYCoordinate(currentIcon.anchors[2].y + differenceX)) {
					currentIcon.anchors[2].x = anchorX;
					currentIcon.anchors[2].y += differenceX;
					currentIcon.anchors[3].y += differenceX;
					currentIcon.anchors[1].x = anchorX;
				}
				break;
			case 'bottomLeft':
				differenceX = anchorX - currentIcon.anchors[3].x;
				if (this.checkYCoordinate(currentIcon.anchors[3].y - differenceX)) {
					currentIcon.anchors[3].x = anchorX;
					currentIcon.anchors[3].y -= differenceX;
					currentIcon.anchors[2].y -= differenceX;
					currentIcon.anchors[0].x = anchorX;
				}
				break;
		}

		currentIcon.width = currentIcon.anchors[1].x - currentIcon.anchors[0].x;
		currentIcon.height = currentIcon.anchors[3].y - currentIcon.anchors[0].y;

		if(currentIcon.width && currentIcon.height) {
			currentIcon.x = currentIcon.anchors[0].x;
			currentIcon.y = currentIcon.anchors[0].y;

			icons[index] = currentIcon;
			this.setState({
				icons: icons
			});
		}
	}

	checkYCoordinate(y: number): boolean {
		return 	y < 0 ? false : y <= this.state.imgHeight;

	}

	setActive(index: number): void {
		const activeIndex = index === this.state.activeIconIndex ? -1 : index;
		this.setState({
			activeIconIndex: activeIndex
		})
	}

	dragBoundFunc (pos: {x: number, y: number}, icon: Icon, index) {
		//You can not drag the icon outside the image
		if (this.state.activeIconIndex === index) {
			const   width = this.state.imgWidth - icon.width,
					height = this.state.imgHeight - icon.height,
					newY = pos.y < 0 ? 0 : (pos.y > height ? height : pos.y),
					newX = pos.x < 0 ? 0 : (pos.x > width ? width : pos.x);
			return {
				x: newX,
				y: newY
			};
		} else {
			return {
				x: icon.x,
				y: icon.y
			};
		}
	}

	getPhotoStyle() {
		return {height: this.props.heightImgContainer};
	}

	onClickImage(e): void {
		if (e.target.attrs.id === 'coverImg') {
			this.setState({
				activeIconIndex: -1
			})
		}
	}

	render() {
		if (this.state.isSync) {
			return (
				<div className={`eFullScreenPhoto_photoContainer ${this.state.isLoading ? "isLoading" : ""}`}
				     style={this.props.photoContainerStyle}
				>
					<div	className	= 'eFullScreenPhoto_photo'
					        style		= {this.getPhotoStyle() }
					>
						<Stage width={this.state.imgWidth} height={this.state.imgHeight} ref={node => {
							this.stageRef = node}}
						>
							<Layer>
								<Image id="coverImg" onClick={e => this.onClickImage(e)} image={this.state.loadImage} width={this.state.imgWidth} height={this.state.imgHeight}/>
								{
									this.state.icons.map((icon, index) => {
										return (
											<Group
											>
												<Image
													key={index}
													image={icon.img}
													width={icon.width}
													height={icon.height}
													x={icon.x}
													y={icon.y}
													onClick={() => this.setActive(index)}
													draggable={true}
													dragBoundFunc = {pos => this.dragBoundFunc(pos, icon, index)}
													onDragMove={(e) => this.handleDragEndIcon(e, index)}
												/>
												{this.state.activeIconIndex === index ? this.renderAnchors(icon, index) : null}
											</Group>
										);
									})
								}
							</Layer>
						</Stage>
						<Loader/>
					</div>
					<div className='eFullScreenPhoto_sideContainer'  style={{heigth: this.props.heightImgContainer-10}}>
						<div className="bAnonymousIconHeaderText">
							Click on "Add icon" to add an icon.
							Select the added icon and drag it to the desired location.<br/>
							You can add an unlimited number of icons.<br/>
							In order to delete the icon, select the desired one and click "Delete icon".
						</div>
						<div className="bAnonymousIconControlButtonWrapper">
							<button className="bButton" onClick={() => this.addAnonymousIcon()}>Add icon</button>
							<button className={`bButton ${this.state.activeIconIndex === -1 ? "mDisable" : "mDelete"}`} onClick={() => this.deleteAnonymousIcon()}>Delete icon</button>
						</div>
						<div className="bAnonymousIconMainButtonWrapper">
							<button className="bButton" onClick={() => {this.handleSaveClick()}}>Save</button>
							<button className="bButton mCancel" onClick={() => this.props.handleCancelClick()}>Cancel</button>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<Loader/>
			);
		}
	}
}