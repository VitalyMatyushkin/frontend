const React = require('react');

const SchoolUnionSchoolViewWrapper = React.createClass({
	propTypes: {
		school: React.PropTypes.object.isRequired
	},
	render: function() {
		return (
			<div className="bForm">
				<div className="eForm_atCenter">
					<h2>
						View school
					</h2>
					<div className="eForm_fieldColumn">
						<div className="eForm_blazonUpload">
							<div className="eForm_blazonPreview">
								<div	className	= "eImg"
										style		= {{'background-image': `url(${this.props.school.pic}?sizing=minvalue&value=170)`}}
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
										value		= {this.props.school.name}
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
									 value		= {this.props.school.description}
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
										  value		= {this.props.school.phone}
										  disabled	= {true}
								/>
							</div>
						</div>
						<div className="eForm_field">
							<div className="eForm_fieldName">
								Postcode
							</div>
							<div className="eForm_fieldSet">
								<input	className	= "eManager_field"
										type		= "text"
										value		= {typeof this.props.school.postcode !== "undefined" ? this.props.school.postcode.postcode : ""}
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
										  value		= {this.props.school.address}
										  disabled	= {true}
								/>
							</div>
						</div>
						<div className="eForm_field">
							<div className="eForm_fieldName">
								School Official Email
							</div>
							<div className="eForm_fieldSet">
								<input	className	= "eManager_field"
										  type		= "text"
										  value		= {this.props.school.email}
										  disabled	= {true}
								/>
							</div>
						</div>
						<div className="eForm_field">
							<div className="eForm_fieldName">
								Sports Department Email
							</div>
							<div className="eForm_fieldSet">
								<input	className	= "eManager_field"
										  type		= "text"
										  value		= {this.props.school.sportsDepartmentEmail}
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

module.exports = SchoolUnionSchoolViewWrapper;