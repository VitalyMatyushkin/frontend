const	React				= require('react'),
		Morearty			= require('morearty'),

		RoleHelper			= require('../helpers/role_helper'),

		ParentRouter		= require('./routes/parent_router'),
		StudentRouter		= require('./routes/student_router'),
		SchoolWorkerRouter	= require('./routes/school_worker_router'),
		SchoolUnionsRouter	= require('./routes/school_unions_router'),
		NobodyRouter		= require('./routes/nobody_router'),

		Bowser				= require('bowser'),
		{ IeAlertContent }	= require('module/ui/ie_alert_content/ie_alert_content'),

		NotificationAlert	= require('./../ui/notification_alert/notification_alert'),
		SliderAlert			= require('module/ui/training_slider/slider_alert'),
		ConfirmAlert		= require('./../ui/confirm_alert/confirm_alert');

const Center = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	componentDidMount: function () {
		if (Bowser.msie && Bowser.version <= 11) {
			window.simpleAlert(
				<IeAlertContent
					handleLinkClick = { this.handleLinkClick }
				/>
			);
		}
	},
	handleLinkClick: function () {
		const binding = this.getDefaultBinding();

		binding.set('notificationAlertData.isOpen', false);
	},
	getRouter: function() {
		const binding = this.getDefaultBinding();

		const	role		= RoleHelper.getLoggedInUserRole(this),
				schoolKind	= RoleHelper.getActiveSchoolKind(this);

		switch (true) {
			// for parents
			case role === "PARENT":
				return (
					<ParentRouter binding={binding}/>
				);
			// for students
			case role === "STUDENT":
				return (
					<StudentRouter binding={binding}/>
				);
			// for workers of school
			case typeof role !== "undefined" && schoolKind === "School":
				return (
					<SchoolWorkerRouter binding={binding}/>
				);
			// for workers of school union
			case typeof role !== "undefined" && schoolKind === "SchoolUnion":
				return (
					<SchoolUnionsRouter binding={binding}/>
				);
			case typeof role === "undefined":
				return (
					<NobodyRouter binding={binding}/>
				);
		}
	},
	render: function() {
		const	self		= this,
				binding		= self.getDefaultBinding();

		const	currentPage	= binding.get('routing.currentPageName') || '',
				mainClass	= `bMainLayout mClearFix m${currentPage.charAt(0).toUpperCase()}${currentPage.slice(1)}`;

		return (
			<div className={mainClass}>
				<div className="bPageWrap">
					{self.getRouter()}
				</div>
				<SliderAlert binding={binding.sub('sliderHelpAlert')} />
				<NotificationAlert binding={binding.sub('notificationAlertData')} />
				<ConfirmAlert binding={binding.sub('confirmAlertData')} />
			</div>
		);
	}
});

module.exports = Center;