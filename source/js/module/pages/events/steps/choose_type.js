var ChooseTypeView;

ChooseTypeView = React.createClass({
    mixins: [Morearty.Mixin],
    setType: function (type) {
        var binding = this.getDefaultBinding();

        binding.set('model.rivalsType', type);
    },
    render: function() {
        var self = this,
            cx = React.addons.classSet,
            binding = this.getDefaultBinding(),
            rivalsType = binding.get('model.rivalsType'),
            schools_classes = cx({
                'eChooseType_type': true,
                'mSchool': true,
                'mActive': rivalsType === 'schools'
            }),
            classes_classes = cx({
                'eChooseType_type': true,
                'mClass': true,
                'mActive': rivalsType === 'classes'
            }),
            houses_classes = cx({
                'eChooseType_type': true,
                'mHouse': true,
                'mActive': rivalsType === 'houses'
            });

        return <div className="eEvents_steps">
            <span className="eEvents_header">Set event name:</span>
            <Morearty.DOM.input
                ref='eventName'
                placeholder='What name will be at the event?'
                onChange={Morearty.Callback.set(binding, 'model.name')} />
            <span className="eEvents_header">Set description:</span>
            <Morearty.DOM.input
                ref='eventDescription'
                placeholder='Add a description?'
                onChange={Morearty.Callback.set(binding, 'model.name')} />
            <span className="eEvents_header">Choose type of rivals:</span>
            <div className="eEvents_chooser">
                <span className={schools_classes} onClick={self.setType.bind(null, 'schools')}>Schools</span>
                <span className={classes_classes} onClick={self.setType.bind(null, 'classes')}>Classes</span>
                <span className={houses_classes} onClick={self.setType.bind(null, 'houses')}>Houses</span>
            </div>
        </div>;
    }
});


module.exports = ChooseTypeView;
