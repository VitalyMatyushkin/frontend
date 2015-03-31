var TimePicker,
    InviteMixin = require('module/as_manager/pages/invites/mixins/invites_mixin');

TimePicker = React.createClass({
	mixins: [Morearty.Mixin, InviteMixin],
    displayName: 'TimePicker',
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            date = new Date(binding.get());

        date.setMinutes(0);
        date.setHours(10);

        binding.set(date.toISOString());
    },
    setMinutes: function (min) {
        var self = this,
            binding = self.getDefaultBinding(),
            date = new Date(binding.get()),
            currentHours = date.getHours(),
            currentMinutes = date.getMinutes();

        if (min === 60) {
            currentHours = currentHours === 23 ? 0 : currentHours + 1;
        } else if (min === -60) {
            currentHours = currentHours === 0 ? 23 : currentHours - 1;
        } else if (min === 1) {
            currentMinutes = currentMinutes === 59 ? 0 : currentMinutes + 1;
        } else if (min === -1) {
            currentMinutes = currentMinutes === 0 ? 59 : currentMinutes - 1;
        }

        date.setMinutes(currentMinutes);
        date.setHours(currentHours);

        binding.set(date.toISOString());
    },
	render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            startTime = new Date(binding.get());

		return <div className="bTimePicker" key="timePicker">
            <div key="hours-picker" className="eTimePicker_box">
                <span className="eTimePicker_arrow mUp" onClick={self.setMinutes.bind(null, 60)}>▲</span>
                <span className="eTimePicker_value">{self.zeroFill(startTime.getHours())}</span>
                <span className="eTimePicker_arrow mDown" onClick={self.setMinutes.bind(null, -60)}>▼</span>
            </div>
            <div className="eTimePicker_box mDelimiter">:</div>
            <div key="minutes-picker" className="eTimePicker_box">
                <span className="eTimePicker_arrow mUp" onClick={self.setMinutes.bind(null, 1)}>▲</span>
                <span className="eTimePicker_value">{self.zeroFill(startTime.getMinutes())}</span>
                <span className="eTimePicker_arrow mDown" onClick={self.setMinutes.bind(null, -1)}>▼</span>
            </div>
        </div>;
	}
});


module.exports = TimePicker;