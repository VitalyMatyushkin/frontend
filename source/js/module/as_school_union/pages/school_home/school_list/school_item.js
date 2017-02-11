const	React								= require('react'),
		DomainHelper						= require('module/helpers/domain_helper'),
		PublicSchoolUnionSchoolItemStyle	= require('../../../../../../styles/ui/b_public_school_union_school_item.scss');

const SchoolItem = React.createClass({
	propTypes: {
		school: React.PropTypes.object.isRequired
	},
	getPublicSchoolSiteLink: function() {
		const schoolDomain = this.props.school.domain;
		
		return typeof schoolDomain !== "undefined" ? DomainHelper.getSubDomain(schoolDomain) : '';
	},
	onClick: function(){
		const publicSchoolSiteLink = "//" + this.getPublicSchoolSiteLink();
		
		if (publicSchoolSiteLink !== "//") {
			window.open(publicSchoolSiteLink);
		}
	},
	render: function() {
		return (
			<div className="bPublicSchoolUnionSchoolItem" onClick={this.onClick}>
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

module.exports = SchoolItem;