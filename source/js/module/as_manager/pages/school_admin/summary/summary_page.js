var SchoolSummary,
    SVG = require('module/ui/svg'),
    Map = require('module/ui/map/map'),
    If = require('module/ui/if/if');

SchoolSummary = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId');

        self.activeSchoolId = activeSchoolId;

		window.Server.school.get(
			{
				id: activeSchoolId,
				filter: {include: 'postcode'}
			}
        ).then(function(data) {
            binding.set(Immutable.fromJS(data));
            self.isMounted() && self.forceUpdate();
        });
    },
    componentWillUnmount: function() {
        var self = this;

        self.request && self.request.abort();
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            schoolPicture = binding.get('pic'),
            siteLink = binding.get('domain') + '.squadintouch.com',
            geoPoint = binding.toJS('postcode.point');


        return (
            <div>
                <h1 className="eSchoolMaster_title">
                    {schoolPicture ? <div className="eSchoolMaster_flag"><img src={schoolPicture}/></div> : ''}
                    {binding.get('name')}

                    <div className="eSchoolMaster_buttons">

                        <a href={'/#schools/edit?id=' + self.activeSchoolId} className="bButton">Edit...</a>
                        <a href="/#schools" className="bButton">Change active school...</a>
                    </div>
                </h1>
                <p>PostCode: {binding.get('postcodeId')}</p>

                <p>Address: {binding.get('address')}</p>

                <p>Description: {binding.get('description')}</p>

                <p>Site: <a href={'//' + siteLink} target="blank" title="binding.get('name') homepage">http://{siteLink}</a></p>

                <If condition={geoPoint}>
                    <Map binding={binding} point={binding.toJS('postcode.point')}/>
                </If>
            </div>
        )
    }
});


module.exports = SchoolSummary;
