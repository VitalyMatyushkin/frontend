var Panel = require('./panel'),
    Form = require('module/ui/form/form'),
    FormField = require('module/ui/form/form_field'),
	NewEvents,
	SVG = require('module/ui/svg');

NewEvents = React.createClass({
    componentWillMount: function () {
        var self = this,
            binding = this.getDefaultBinding();

        binding.set('new_events', Immutable.Map());
    },
    componentWillUnmount: function () {
        binding.remove('new_events');
    },
    submitForm: function () {
        console.log(arguments);
    },
    getSports: function () {
        var self = this;

        return function() {
            return window.Server.sports.get();
        }
    },
    mixins: [Morearty.Mixin],
    render: function() {
		var self = this,
            formTitle = 'New Challenge',
            binding = this.getDefaultBinding();

		return <div className="bEvents">
            <Panel binding={binding} />
            <div className="bChallenges mNew">
                <Form name={formTitle} onSubmit={self.submitForm} binding={binding.sub('new_events')} >
                    <FormField type="text" field="name" validation="required">Events Name</FormField>
                    <FormField type="area" field="description" validation="">Description</FormField>
                    <FormField type="autocomplete" serviceFunction={self.getSports()} field="sportId" validation="required">Sport</FormField>
                </Form>
            </div>
        </div>
	}
});


module.exports = NewEvents;
