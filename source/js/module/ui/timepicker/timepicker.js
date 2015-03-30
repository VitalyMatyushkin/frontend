var TimePicker;

TimePicker = React.createClass({
	mixins: [Morearty.Mixin],
    displayName: 'TimePicker',
        setMinutes: function (decrease, min) {
        var self = this,
            binding = self.getDefaultBinding(),
            oldDate = new Date(binding.get()),
            minutes = (min || 1) * 60000,
            date = new Date(oldDate.getTime() + decrease ? -1 * minutes : minutes);

        binding.set(date.toISOString());
    },
	render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            startTime = new Date(binding.get());

		return <div className="bTimePicker" key="timePicker">
            <div key="hours-picker" className="eTimePicker_box">
                <span className="eTimePicker_arrow mUp" onClick={self.setMinutes.bind(null, false, 60)}>▲</span>
                <span className="eTimePicker_value">{startTime.getHours()}</span>
                <span className="eTimePicker_arrow mDown" onClick={self.setMinutes.bind(null, true, 60)}>▼</span>
            </div>
            <div className="eTimePicker_box mDelimiter">:</div>
            <div key="minutes-picker" className="eTimePicker_box">
                <span className="eTimePicker_arrow mUp" onClick={self.setMinutes.bind(null, false, 1)}>▲</span>
                <span className="eTimePicker_value">{startTime.getMinutes()}</span>
                <span className="eTimePicker_arrow mDown" onClick={self.setMinutes.bind(null, true, 1)}>▼</span>
            </div>
        </div>;
	}
});


module.exports = TimePicker;