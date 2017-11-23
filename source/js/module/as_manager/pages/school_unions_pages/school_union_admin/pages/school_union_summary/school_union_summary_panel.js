const	React					= require('react'),
		SVG						= require('module/ui/svg'),
	{If}					= require('module/ui/if/if'),
		SchoolUnionSummaryStyle	= require('../../../../../../../../styles/ui/b_school_union_summary.scss');

const SchoolUnionSummaryPanel = React.createClass({
	SCHOOL_UNION_SUMMARY_EDIT_LINK: '/#school_union_admin/summary/edit',
	MAX_DESCRIPTION_SIZE: 900,
	propTypes: {
		activeSchoolUnionId			: React.PropTypes.string.isRequired,
		publicSchoolUnionSiteLink	: React.PropTypes.string.isRequired,
		schoolUnionPicture			: React.PropTypes.string,
		schoolName					: React.PropTypes.string.isRequired,
		postcode					: React.PropTypes.string,
		address						: React.PropTypes.string.isRequired,
		description					: React.PropTypes.string,
		isShowEditButton			: React.PropTypes.bool.isRequired
	},
	getInitialState: function() {
		return {
			expanded: false
		};
	},
	expandedText: function() {
		this.setState({
			expanded: !this.state.expanded
		});
	},
	getSchoolUnionEditPageLink: function() {
		return `${this.SCHOOL_UNION_SUMMARY_EDIT_LINK}?id=${this.props.activeSchoolUnionId}`;
	},
	getCutDescriptionText: function(descriptionText) {
		return descriptionText.slice(0, this.MAX_DESCRIPTION_SIZE)  + '...' ;
	},
	renderEditButton: function() {
		if(this.props.isShowEditButton === true) {
			return (
				<div className="eSchoolUnionSummary_editButton">
					<a href={this.getSchoolUnionEditPageLink()}>
						<div	className			= "bButton mCircle bTooltip"
								data-description	= "Edit"
						>
							<i className="fa fa-pencil" aria-hidden="true"/>
						</div>
					</a>
				</div>
			);
		} else {
			return null;
		}
	},
	renderSchoolUnionPicture: function() {
		const schoolUnionPicture = this.props.schoolUnionPicture;

		if(typeof schoolUnionPicture !== "undefined") {
			return (
				<img	className	= "eSchoolUnionSummary_picture"
						src			= {schoolUnionPicture}
				/>
			);
		} else {
			return null;
		}
	},
	renderDescription: function () {
		const description = this.props.description;
		let linkText, text;

		if (this.state.expanded) {
			text		= description;
			linkText	= 'Show Less';
		} else {
			text		= typeof description !== 'undefined' ? this.getCutDescriptionText(description) : null;
			linkText	= 'Read More';
		}
		return (
			<div className="eSchoolUnionSummary_description">
				{text}
				<If condition={description && description.length > this.MAX_DESCRIPTION_SIZE}>
					<a className="eDescription_link" onClick={this.expandedText}> { linkText } </a>
				</If>
			</div>
		);
	},
	renderSiteLink: function () {
		const publicSchoolUnionSiteLink = this.props.publicSchoolUnionSiteLink;
		if(publicSchoolUnionSiteLink !== '') {
			return (
				<p className="eSchoolUnionSummary_footer">
					Site:
					<a	className	= "bSchoolLink"
						href		= {'//' + publicSchoolUnionSiteLink}
						target		= "blank" title={publicSchoolUnionSiteLink}
					>
						{publicSchoolUnionSiteLink}
						<SVG icon="icon_sch_link"/>
					</a>
				</p>
			);
		} else {
			return (
				<p className="eSchoolUnionSummary_footer">
					Site:
					School Union has no active domain
				</p>
			);
		}
	},
	render: function () {
		return (
			<div className="bSchoolUnionSummary">
				<div className="eSchoolUnionSummary_header">
					<div className="eSchoolUnionSummary_headerLeftSide">
						{this.renderSchoolUnionPicture()}
					</div>
					<div className="eSchoolUnionSummary_headerRightSide">
						<div className="eSchoolUnionSummary_nameWrapper">
							<h1 className="eSchoolUnionSummary_name">
								{this.props.schoolName}
							</h1>
							{this.renderEditButton()}
						</div>
						<div className="eSchoolUnionSummary_addressBlock">
							<p className="eSchoolUnionSummary_postcode">{this.props.postcode}</p>
							<p className="eSchoolUnionSummary_address">{this.props.address}</p>
						</div>
					</div>
				</div>
				{this.renderDescription()}
				{this.renderSiteLink()}
			</div>
		);
	}
});

module.exports = SchoolUnionSummaryPanel;