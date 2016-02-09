/**
 * Created by bridark on 09/06/15.
 */
const   SchoolForm  = require('module/as_manager/pages/schools/schools_form'),
        React       = require('react'),
        Immutable   = require('immutable');

const AddSchoolForm = React.createClass({
    mixins: [Morearty.Mixin],
    submitAdd: function(schoolData) {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();

        window.Server.schools.post(schoolData).then(function(data) {
            // Добавляемая школа всегда становится школой "по умолчанию"
            globalBinding.set('userRules.activeSchoolId', data.id);
            //Ideally, we create an album on creating the school
            //Use it for subsequent profile or blazon upload
            window.Server.addAlbum.post({
                name:data.name.split(' ').join('_'),
                description:"school_blazon",
                ownerId:data.id
            }).then(function(storage){
                return storage;
            }).catch(function(err){
                alert(err.errorThrown+' occurred while creating storage for school profile');
            });
            return data;
        }).catch(function(err){
            alert(err.errorThrown+' occurred while creating school entity');
        });

        // Добавление школы в списк
        binding.update(function(ImmutableValue){
            ImmutableValue = ImmutableValue || Immutable.List();
            return ImmutableValue.push(schoolData);
        });

        // Переход к списку школ
        document.location.hash = 'admin_schools/admin_views/list';
    },
    render: function() {
        var self = this;

        return (
            <SchoolForm title="Add new school..." onSubmit={self.submitAdd} binding={self.getDefaultBinding().sub('form')} />
        )
    }
});


module.exports = AddSchoolForm;
