/**
 * Created by bridark on 09/06/15.
 */
var SchoolForm = require('module/as_manager/pages/schools/schools_form'),
    AddSchoolForm;

AddSchoolForm = React.createClass({
    mixins: [Morearty.Mixin],
    submitAdd: function(schoolData) {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();

        window.Server.schools.post(schoolData).then(function(data) {
            // Добавляемая школа всегда становится школой "по умолчанию"
            globalBinding.set('userRules.activeSchoolId', data.id);
        });

        // Добавление школы в списк
        binding.update(function(ImmutableValue){
            ImmutableValue = ImmutableValue || Immutable.List();
            return ImmutableValue.push(schoolData);
        });

        // Переход к списку школ
        document.location.hash = 'schools';
    },
    render: function() {
        var self = this;

        return (
            <SchoolForm title="Add new school..." onSubmit={self.submitAdd} binding={self.getDefaultBinding().sub('form')} />
        )
    }
});


module.exports = AddSchoolForm;
