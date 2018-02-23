import * as React from 'react';

interface PhotoData {
	id:             string
	name:           string
	description: 	string
	picUrl:         string
	ownerId:		string
}

interface PhotoEditComponentProps {
	photoData: PhotoData,
	albumId: string
	onSubmit: (PhotoData) => void
}

interface PhotoEditComponentState {
	name: string
	description: string
}

export class PhotoEditComponent extends React.Component<PhotoEditComponentProps, PhotoEditComponentState> {
	constructor(props) {
		super(props);
		this.state = {
			name: this.props.photoData.name,
			description: this.props.photoData.description
		};
	}

	handleChange(e): void {
		if (e.target.name === 'name') {
			this.setState({name: e.target.value});
		} else {
			this.setState({description: e.target.value});
		}
	}

	submitData(e): void {
		if (e.target.name === 'name') {
			this.props.onSubmit({name: this.state.name});
		} else {
			this.props.onSubmit({description: this.state.description});
		}
	}

	render() {
		return (
			<div className="bForm">
				<div className="eForm_field">
					<div className="eForm_fieldName">
						Name
					</div>
					<div className="eForm_fieldSet">
						<input
							type        = "text"
							name        = "name"
							value       = {this.state.name}
							onChange    = {(e) => this.handleChange(e)}
							onBlur      = {(e) => this.submitData(e)}
						/>
					</div>
				</div>
				<div className="eForm_field">
					<div className="eForm_fieldName">
						Description
					</div>
					<div className="eForm_fieldSet">
						<textarea
							name        = "description"
							value       = {this.state.description}
							onChange    = {(e) => this.handleChange(e)}
							onBlur      = {(e) => this.submitData(e)}
						/>
					</div>
				</div>
			</div>
		)
	}
}
