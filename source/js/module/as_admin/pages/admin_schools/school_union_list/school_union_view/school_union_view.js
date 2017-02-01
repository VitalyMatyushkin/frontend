const React = require('react');

const SchoolUnionView = React.createClass({
	propTypes: {
		schoolUnion: React.PropTypes.object.isRequired
	},
	render: function() {
		return (
			<div className="bForm">
				<div className="eForm_atCenter">
					<h2>
						View school union
					</h2>
					<div className="eForm_fieldColumn">
						<div className="eForm_blazonUpload">
							<div className="eForm_blazonPreview">
								<div	className	= "eImg"
										style		= {{'background-image': `url(${this.props.schoolUnion.pic}?sizing=minvalue&value=170)`}}
								>
								</div>
							</div>
						</div>
					</div>
					<div className="eForm_fieldColumn">
						<div className="eForm_field">
							<div className="eForm_fieldName">
								Name
							</div>
							<div className="eForm_fieldSet">
								<input	type		= "text"
										value		= {this.props.schoolUnion.name}
										disabled	= {true}
								/>
							</div>
						</div>
						<div className="eForm_field">
							<div className="eForm_fieldName">
								Description
							</div>
							<div className="eForm_fieldSet">
						<textarea	type		= "text"
									value		= {this.props.schoolUnion.description}
									disabled	= {true}
						/>
							</div>
						</div>
						<div className="eForm_field">
							<div className="eForm_fieldName">
								Phone
							</div>
							<div className="eForm_fieldSet">
								<input	type		= "text"
										value		= {this.props.schoolUnion.phone}
										disabled	= {true}
								/>
							</div>
						</div>
						<div className="eForm_field">
							<div className="eForm_fieldName">
								Address
							</div>
							<div className="eForm_fieldSet">
								<input	className	= "eManager_field"
										type		= "text"
										value		= {this.props.schoolUnion.address}
										disabled	= {true}
								/>
							</div>
						</div>
						<div className="eForm_field">
							<div className="eForm_fieldName">
								School Union Official Email
							</div>
							<div className="eForm_fieldSet">
								<input	className	= "eManager_field"
										type		= "text"
										value		= {this.props.schoolUnion.email}
										disabled	= {true}
								/>
							</div>
						</div>
						<div className="eForm_field">
							<div className="eForm_fieldName">
								Sports Union Department Email
							</div>
							<div className="eForm_fieldSet">
								<input	className	= "eManager_field"
										type		= "text"
										value		= {this.props.schoolUnion.sportsDepartmentEmail}
										disabled	= {true}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = SchoolUnionView;