import * as React from 'react';
import {SVG} from 'module/ui/svg';
import {If} from 'module/ui/if/if';

import '../../../../../../../../styles/ui/b_school_union_summary.scss';



export interface SchoolUnionSummaryPanelProps {
	activeSchoolUnionId: string
	publicSchoolUnionSiteLink: string
	schoolUnionPicture?: string
	schoolName: string
	postcode?: string
	address: string
	description?: string
	isShowEditButton: boolean
}

interface SchoolUnionSummaryPanelState {
    expanded: boolean
}


const SCHOOL_UNION_SUMMARY_EDIT_LINK = '/#school_union_admin/summary/edit';
const MAX_DESCRIPTION_SIZE = 900;

export class SchoolUnionSummaryPanel extends React.Component<SchoolUnionSummaryPanelProps, SchoolUnionSummaryPanelState>{
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };
    }

	expandedText() {
		this.setState({
			expanded: !this.state.expanded
		});
	}

	getSchoolUnionEditPageLink() {
		return `${SCHOOL_UNION_SUMMARY_EDIT_LINK}?id=${this.props.activeSchoolUnionId}`;
	}

	getCutDescriptionText(descriptionText: string): string {
        if(descriptionText.length > MAX_DESCRIPTION_SIZE) {
            return descriptionText.slice(0, MAX_DESCRIPTION_SIZE)  + '...' ;
        } else {
            return descriptionText;
        }

	}

	renderEditButton() {
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
	}

	renderSchoolUnionPicture() {
		const {schoolUnionPicture} = this.props;

		if(typeof schoolUnionPicture !== "undefined") {
			return (
				<img	className	= "eSchoolUnionSummary_picture"
						src			= {schoolUnionPicture}
				/>
			);
		} else {
			return null;
		}
	}

	renderDescription() {
		const {description} = this.props;
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
				<If condition={description && description.length > MAX_DESCRIPTION_SIZE}>
					<a className="eDescription_link" onClick={this.expandedText}> { linkText } </a>
				</If>
			</div>
		);
	}

	renderSiteLink() {
		const {publicSchoolUnionSiteLink} = this.props;
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
	}

	render() {
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
}