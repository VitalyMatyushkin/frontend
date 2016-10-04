/**
 * Created by Anatoly on 30.09.2016.
 */
const	Immutable		= require('immutable');

const MatchReportActions = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
	this.eventId = this.props.eventId;

	return this;
};

MatchReportActions.prototype.load = function() {
	const binding = this.getDefaultBinding();

	// loading match report
	return window.Server.schoolEventReport.get({
		schoolId: this.activeSchoolId,
		eventId: this.eventId
	}).then(report => {
		binding.set('model.matchReport', Immutable.fromJS(report.content));

		return report.content;
	});
};
/**Save match report
 * @param {string} report
 * @returns {Promise} schoolEventReport promise
 * */
MatchReportActions.prototype.save = function(report){
	return window.Server.schoolEventReport.put({
			schoolId: this.activeSchoolId,
			eventId: this.eventId
		},
		{
			content: report
		}
	);
};

MatchReportActions.prototype.isEditMode = function(){
	const 	self 		= this,
			binding 	= self.getDefaultBinding();

	return binding.toJS('mode') === 'report_edit';
};

MatchReportActions.prototype.onEdit = function(){
	const 	self 		= this,
			binding 	= self.getDefaultBinding();

	return binding.set('mode', 'report_edit');
};

MatchReportActions.prototype.onCancel = function(){
	const 	self 		= this,
			binding 	= self.getDefaultBinding();

	return binding.set('mode', 'general');
};

MatchReportActions.prototype.onSave = function(){
	const 	self 		= this,
			binding 	= self.getDefaultBinding(),
			report 		= binding.toJS('model.matchReport');

	this.save(report);
	this.onCancel();
};


module.exports = MatchReportActions;