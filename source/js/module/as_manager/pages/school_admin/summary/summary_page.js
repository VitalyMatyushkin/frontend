const   SVG         = require('module/ui/svg'),
        Map         = require('module/ui/map/map'),
        React       = require('react'),
        If          = require('module/ui/if/if'),
        Immutable   = require('immutable');

const SchoolSummary = React.createClass({
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
        });
    },
    componentWillUnmount: function() {
        var self = this;

        self.request && self.request.cancel();
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            schoolPicture = binding.get('pic'),
            siteLink = binding.get('domain') + '.stage.squadintouch.com',
            geoPoint = binding.toJS('postcode.point');

    return (
        <div>
          <div className="changeSchool">
            <a title="Change active school" href="/#schools" className="addButton">
              <SVG icon="icon_change_school" />
            </a>
          </div>
          <div className="eSchoolMaster_summary">
            <div className="summary_inside">
              <div className="editSchool">
                <a href={'/#schools/edit?id=' + self.activeSchoolId}>
                  <div className="bEditButton"><SVG icon="icon_edit"/></div>
                </a>
              </div>
              <div>
                {schoolPicture ? <div className="eSchoolMaster_flag"><img src={schoolPicture}/></div> : ''}
                <h1 className="eSchoolMaster_title">
                  {binding.get('name')}
                </h1>

                <div className="eSchoolAddress">
                  {binding.get('postcodeId')}
                  {binding.get('address')}
                </div>
              </div>
              <div className="eDescription">
                <p>{binding.get('description')}</p>
              </div>
              <p>Site: <a href={'//' + siteLink} target="blank"
                          title="binding.get('name') homepage">http://{siteLink}</a>
              </p>
            </div>
            <div>
            <If condition={geoPoint !== undefined}>
              <Map binding={binding} point={binding.toJS('postcode.point')}/>
            </If>
            </div>
          </div>
        </div>
    )
  }
});


module.exports = SchoolSummary;
