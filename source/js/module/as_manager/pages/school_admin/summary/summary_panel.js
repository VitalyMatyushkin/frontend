/**
 * Created by wert on 08.09.16.
 */

const 	React	= require('react'),
		Map		= require('module/ui/map/map'),
		SVG		= require('module/ui/svg'),
		If		= require('module/ui/if/if');

const SummaryPanel = React.createClass({

	propTypes: {
		showEditButton: React.PropTypes.bool.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired,
		schoolPic:		React.PropTypes.string,
		schoolName:		React.PropTypes.string.isRequired,
		postcode:		React.PropTypes.string,
		address:		React.PropTypes.string.isRequired,
		description:	React.PropTypes.string,
		siteLink:		React.PropTypes.string.isRequired,
		geoPoint:		React.PropTypes.any,
		binding:		React.PropTypes.any 		// yes, it will be here for a while. Need to pass it down to map
	},

	renderEditButton: function() {
		if(this.props.showEditButton === true) {
			return (
				<div className="editSchool">
					<a href={'/#schools/edit?id=' + this.props.activeSchoolId}>
						<div className="bEditButton bTooltip" data-description="Edit">
							<SVG icon="icon_edit"/>
						</div>
					</a>
				</div>
			);
		} else {
			return null;
		}
	},

	renderSiteLink: function () {
		const siteLink = this.props.siteLink;
		if(siteLink !== '') {
			return (
				<p>
					Site:
					<a	href={'//' + siteLink}
						  target="blank" title={siteLink}
						  className="bSchoolLink">
						{siteLink}
						<SVG icon="icon_sch_link" />
					</a>
				</p>
			);
		} else {
			return (
				<p>
					Site:
					School has no active domain
				</p>
			);
		}
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

	renderDescription: function () {
		const description = this.props.description;
		let linkText, text;

		if (this.state.expanded) {
			text = description;
			linkText = 'Show Less';
		} else {
			text = typeof description !== 'undefined' ? description.slice(0, 200) + '...' : undefined;
			linkText = 'Read More';
		}
		return (
			<div className="eDescription">
				{ text }
			<If condition={description && description.length > 200}>
				<a className="eDescription_link" onClick={this.expandedText}> { linkText } </a>
			</If>
		</div>
		);
	},

	render: function () {
		const 	schoolPic	= this.props.schoolPic,
				schoolName	= this.props.schoolName,
				postcode	= this.props.postcode,
				address		= this.props.address,
				geoPoint	= this.props.geoPoint;

		return (
			<div>
				<div className="eSchoolMaster_summary mClearFix">
					<div className="summary_inside">
						{this.renderEditButton()}
						<div>
							{schoolPic ? <div className="eSchoolMaster_flag"><img src={schoolPic}/></div> : ''}
							<h1 className="eSchoolMaster_title"> {schoolName}</h1>

							<div className="eSchoolAddress">
								<p>{postcode}</p>
								<p>{address}</p>
							</div>
						</div>
						{ this.renderDescription() }
						{ this.renderSiteLink() }
					</div>
						<If condition={geoPoint !== undefined}>
							<Map binding={this.props.binding} point={geoPoint}/>
						</If>
				</div>
			</div>
		);
	}

});


module.exports = SummaryPanel;