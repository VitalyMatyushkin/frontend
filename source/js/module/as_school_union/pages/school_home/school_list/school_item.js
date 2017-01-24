const	React								= require('react'),
		PublicSchoolUnionSchoolItemStyle	= require('../../../../../../styles/ui/b_public_school_union_school_item.scss');

const SchoolList = React.createClass({
	propTypes: {
		school: React.PropTypes.object.isRequired
	},
	render: function() {
		return (
			<div className="bPublicSchoolUnionSchoolItem">
				<div className="ePublicSchoolUnionSchoolItem_schoolPicture">
					<img	height	= "180px"
							width	= "180px"
							src		= {this.props.school.pic}
					/>
				</div>
				<div className="ePublicSchoolUnionSchoolItem_schoolName">
					{this.props.school.name}
				</div>
			</div>
		);
	}
});

module.exports = SchoolList;