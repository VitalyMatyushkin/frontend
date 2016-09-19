/**
 * Created by bridark on 09/06/15.
 */
const   SchoolForm  = require('./schools_form'),
        React       = require('react'),
		Morearty    = require('morearty'),
        Immutable   = require('immutable');

const AddSchoolForm = React.createClass({
    mixins: [Morearty.Mixin],
    submitAdd: function(schoolData) {
        const   self            = this,
                binding         = self.getDefaultBinding();

        window.Server.schools.post(schoolData).then(() => {
            binding.update(function(ImmutableValue){
                ImmutableValue = ImmutableValue || Immutable.List();
                return ImmutableValue.push(schoolData);
            });

            document.location.hash = 'admin_schools/admin_views/list';

            return true;
        });
    },
    render: function() {
        var self = this;

        return (
            <SchoolForm title="Add new school..." onSubmit={self.submitAdd} binding={self.getDefaultBinding().sub('form')} />
        )
    }
});


module.exports = AddSchoolForm;
