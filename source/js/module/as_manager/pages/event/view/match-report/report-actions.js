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
		const 	data 	= Immutable.fromJS(report.content),
				isEdit 	= !report.content;

		binding.atomically()
			.set('content', data)
			.set('defaultContent', data)
			.set('isEditMode', isEdit)
			.commit();

		return report.content;
	});
};
/**Save match report
 * @param {string} report
 * @returns {Promise} schoolEventReport promise
 * */
MatchReportActions.prototype.save = function(report){
	const binding = this.getDefaultBinding();

	return window.Server.schoolEventReport.put({
			schoolId: this.activeSchoolId,
			eventId: this.eventId
		},
		{
			content: report
		}
	).then(data => {
		binding.set('defaultContent', Immutable.fromJS(data.content));

	});
};

MatchReportActions.prototype.isEditMode = function(){
	const 	self 		= this,
			binding 	= self.getDefaultBinding();

	return binding.toJS('isEditMode');
};

MatchReportActions.prototype.onEdit = function(){
	const 	self 		= this,
			binding 	= self.getDefaultBinding();

	return binding.set('isEditMode', true);
};

MatchReportActions.prototype.onCancel = function(){
	const 	self 		= this,
			binding 	= self.getDefaultBinding();

	binding.set('content', binding.get('defaultContent'));
	binding.set('isEditMode', false);
};

MatchReportActions.prototype.onSave = function(){
	const 	self 		= this,
			binding 	= self.getDefaultBinding(),
			report 		= binding.toJS('content');

	this.save(report);
	binding.set('isEditMode', false);
};


module.exports = MatchReportActions;