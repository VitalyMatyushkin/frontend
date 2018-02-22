import * as React from 'react';
import { Stage, Layer, Group, Circle, Image } from 'react-konva';
import 'styles/ui/gallery/b_anonymous_icon.scss';
import * as Loader from 'module/ui/loader';

interface AnonymousIconProps {
	getUrlPhoto: () => Promise<string>
	handleSaveClick: (file: any) => void
	handleCancelClick: () => void
	widthImgContainer?: number
	heightImgContainer?: number
}

interface AnonymousIconState {
	isSync: boolean
	loadImage: HTMLImageElement
	activeIconIndex: number
	icons: Icon[]
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
	readonly widthIcon = 30;
	readonly anchorRadius = 5;
	stageRef: any;

	constructor(props) {
		super(props);
		this.state = {
			isSync: false,
			loadImage: null,
			icons: [],
			activeIconIndex: -1
		};
	}

	componentDidMount() {
		this.props.getUrlPhoto().then(picUrl => {
			const image = new (window as any).Image();
			image.crossOrigin = 'anonymous';
			image.onload = () => {
				// setState will redraw layer
				// because "image" property is changed
				this.setState({loadImage: image, isSync: true});
			};
			image.src = picUrl;
		});
	}

	addAnonymousIcon(): void {
		const   image = new (window as any).Image(),
				icons = this.state.icons;
		image.src = '/images/smile.png';
		image.crossOrigin = 'anonymous';
		image.onload = () => {
			// setState will redraw layer
			// because "image" property is changed
			const anchors = [   {name: 'topLeft', x: this.anchorRadius, y: this.anchorRadius},
								{name: 'topRight', x:  this.widthIcon+this.anchorRadius, y: this.anchorRadius},
								{name: 'bottomRight', x:  this.widthIcon+this.anchorRadius, y:  this.widthIcon+this.anchorRadius},
								{name: 'bottomLeft', x: this.anchorRadius, y:  this.widthIcon+this.anchorRadius}];
			icons.push({img: image, x: this.anchorRadius, y: this.anchorRadius, width: this.widthIcon, height: this.widthIcon, active: false, anchors: anchors});
			this.setState({
				isSync: true,
				icons,
				activeIconIndex: icons.length-1
			})
		}
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
		this.setState({
			activeIconIndex: -1
		});
		window.confirmAlert(
			"You can not reverse the changes after saving. Are you sure?",
			"Ok",
			"Cancel",
			() => {
				const file = this.dataURItoBlob(this.stageRef.getStage().toDataURL());
				this.props.handleSaveClick(file);
			},
			() => {}
		);

	}

	dataURItoBlob(dataURI): Blob {
		// convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
		const byteString = atob(dataURI.split(',')[1]);

		// separate out the mime component
		const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to an ArrayBuffer
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		//New Code
		return new Blob([ab], {type: mimeString});

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
		const   anchorX = e.target.x() < this.anchorRadius ? this.anchorRadius : (e.target.x() > this.state.loadImage.width - this.anchorRadius ? this.state.loadImage.width - this.anchorRadius : e.target.x()),
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
		return 	y < this.anchorRadius ? false : y <= this.state.loadImage.height - this.anchorRadius;

	}

	setActive(index: number): void {
		const activeIndex = index === this.state.activeIconIndex ? -1 : index;
		this.setState({
			activeIconIndex: activeIndex
		})
	}

	dragBoundFunc (pos: {x: number, y: number}, icon: Icon) {
		//You can not drag the icon outside the image
		const   width = this.state.loadImage.width - icon.width - this.anchorRadius,
				height = this.state.loadImage.height - icon.height - this.anchorRadius,
				newY = pos.y < this.anchorRadius ? this.anchorRadius : (pos.y > height ? height : pos.y),
				newX = pos.x < this.anchorRadius ? this.anchorRadius : (pos.x > width ? width : pos.x);
		return {
			x: newX,
			y: newY
		};
	}

	getImgWrapperStyle() {
		return {width: this.props.widthImgContainer ? (this.props.widthImgContainer > this.state.loadImage.width ? this.state.loadImage.width : this.props.widthImgContainer) : 'auto',
			height: this.props.heightImgContainer ? this.props.heightImgContainer : 'auto'};
	}

	render() {
		if (this.state.isSync) {
			return (
				<div className="bAnonymous_icon_wrapper ">
					<div className="bAnonymousIconHeaderText">
						Click on "Add icon" to add an icon.
						Select the added icon and drag it to the desired location.<br/>
						You can add an unlimited number of icons.<br/>
						In order to delete the icon, select the desired one and click "Delete icon".
					</div>
					<div className="bAnonymousIconControlButtonWrapper">
						<button className="bButton" onClick={() => this.addAnonymousIcon()}>Add icon</button>
						<button
							className={`bButton ${this.state.activeIconIndex === -1 ? "mDisable" : "eDelete_button"}`}
							onClick={() => this.deleteAnonymousIcon()}
						>
							Delete icon
						</button>
					</div>
					<div className="bAnonymousIconImg" style={this.getImgWrapperStyle()}
					>
						<Stage width={this.state.loadImage.width} height={this.state.loadImage.height} ref={node => {
							this.stageRef = node}}
						>
							<Layer>
								<Image image={this.state.loadImage} />
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
													dragBoundFunc = {pos => this.dragBoundFunc(pos, icon)}
													onDragMove={(e) => this.handleDragEndIcon(e, index)}
												/>
												{this.state.activeIconIndex === index ? this.renderAnchors(icon, index) : null}
											</Group>
										);
									})
								}
							</Layer>
						</Stage>
					</div>
					<div className="bAnonymousIconMainButtonWrapper">
						<button className="bButton" onClick={() => {
							this.handleSaveClick()
						}}>Save
						</button>
						<button className="bButton mCancel" onClick={() => this.props.handleCancelClick()}>Cancel</button>
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