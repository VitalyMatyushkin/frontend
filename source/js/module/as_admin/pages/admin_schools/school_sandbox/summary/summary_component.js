const	React 							= require('react'),
		schoolSummaryStyles		= require('styles/pages/schools/b_school_summary.scss'),
		If										= require('module/ui/if/if');

const SummaryComponent = React.createClass({

	propTypes: {
		school: 	React.PropTypes.object
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

	render: function() {
		const self	= this,
				school	= self.props.school;


		let text, linkText, schoolImage;

			if (typeof school !== 'undefined') {
				schoolImage = school.pic + '?sizing=minvalue&value=170';
				if (this.state.expanded) {
						text = school.description;
						linkText = 'Show Less';
					} else {
						if (school.description.length > 200) {
							text = school.description.slice(0, 200) + '...';
						} else {
							text = school.description;
						}
						linkText = 'Read More';
					}
				return (
					<div>
						<div className='eSchoolSummary_wrap'>
							<h1 className='eSchoolSummary_title'>{school.name}</h1>
							<div className='eStrip'></div>
						</div>
						<div className="eSchoolSummary_main">
							<div className="eImg" style={{backgroundImage:'url(' + schoolImage + ')'}}></div>
							<div className="eText">
								<div className="eTextKey">School status</div>
								<div className="eTextValue">{school.status}</div>
								<div className="eTextKey">Phone</div>
								<div className="eTextValue">{school.phone}</div>
								<div className="eTextKey">Postcode</div>
								<div className="eTextValue">{school.postcode.postcode}</div>
								<div className="eTextKey">Address</div>
								<div className="eTextValue">{school.address}</div>
								<div className="eTextKey">Domain</div>
								<div className="eTextValue">{school.domain}</div>
								<div className="eTextKey">Public site access</div>
								<div className="eTextValue">{school.publicSite.status}</div>
								<div className="eTextKey">School Official Email</div>
								<div className="eTextValue">{school.email}</div>
								<div className="eTextKey">Sports Department Email</div>
								<div className="eTextValue">{school.sportsDepartmentEmail}</div>
								<div className="eTextKey">Notification Email</div>
								<div className="eTextValue">{school.notificationEmail}</div>
								<div className="eTextKey">Description</div>
								<div className="eTextValue">
									{text}
									<If condition={school.description && school.description.length > 200}>
										<a className="eDescription_link" onClick={self.expandedText}> {linkText} </a>
									</If>
								</div>
							</div>
						</div>
					</div>
				)
			} else {
				return null
			}
	}
});

module.exports = SummaryComponent;