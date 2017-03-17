/**
 * Created by Woland on 10.02.2017.
 */

const 	React 					= require('react'),
		Morearty				= require('morearty'),
		IntegrationPageClass	= require('./integration-page-class'),
		Grid 					= require('module/ui/grid/grid'),
		If						= require('module/ui/if/if'),
		ConfirmPopup			= require('module/ui/confirm_popup'),
		Button					= require('module/ui/button/button'),
		SchoolHelper			= require('module/helpers/school_helper'),
		SVG						= require('module/ui/svg');

const 	Styles					= require('styles/pages/integrations/b_integrations.scss');

const IntegrationPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new IntegrationPageClass(this);
	},
	onTwitterClick: function(){
		const 	activeSchoolId 	= SchoolHelper.getActiveSchoolId(this),
				binding 		= this.getDefaultBinding();
		//it dirty way, but browser blocked opening window in async request
		const windowTwitter = window.open("","_blank");
		
		window.Server.integrationTwitter.post({schoolId: activeSchoolId}).then( link => {
			const linkTwitter = link.url;
			windowTwitter.location.href = linkTwitter;
			binding.set('isPopupOpen', false);
		});
	},
	
	onGoogleCalendarClick: function(){
		const 	activeSchoolId 	= SchoolHelper.getActiveSchoolId(this),
				binding 		= this.getDefaultBinding();
		//it dirty way, but browser blocked opening window in async request
		const googleWindow = window.open("","_blank");
		
		window.Server.integrationGoogleCalendar.post({schoolId: activeSchoolId}).then( link => {
			const linkGoogleCalendar = link.url;
			googleWindow.location.href = linkGoogleCalendar;
			binding.set('isPopupOpen', false);
		});
	},
	
	onClickClose: function(){
		const binding = this.getDefaultBinding();
		binding.set('isPopupOpen', false);
	},
	
	render: function () {
		const binding = this.getDefaultBinding();
		
		if (typeof this.model.grid !== 'undefined') {
			return (
				<div className="bIntegrations">
					<Grid model={this.model.grid}/>
					<If condition={Boolean(binding.toJS('isPopupOpen'))}>
						<ConfirmPopup
							customStyle={'ePopup'}
							isShowButtons={false}
						>
							<div className="eClose" onClick={this.onClickClose}>
								<SVG icon="icon_delete"/>
							</div>
							<div className="eHeader">Choose integration and click it!</div>
							<Button
								onClick				= { this.onGoogleCalendarClick }
								text				= { [<i key="Google Calendar" className='fa fa-google' aria-hidden='true'></i>, " ", "Google Calendar"] }
								extraStyleClasses 	= 'eGoogleCalendar'
							/>
							<Button
								onClick				= { this.onTwitterClick }
								text				= { [<i key="Twitter" className='fa fa-twitter' aria-hidden='true'></i>, " ", "Twitter"] }
								extraStyleClasses 	= 'eTwitter'
							/>
						</ConfirmPopup>
					</If>
				</div>
			)
		} else {
			return null
		}
	}
});

module.exports = IntegrationPage;