const   SVG         = require('module/ui/svg'),
        Map         = require('module/ui/map/map'),
        React       = require('react'),
        If          = require('module/ui/if/if'),
        ActiveUserHelper = require('module/helpers/activeUser_helper'),
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
            ActiveUserHelper.howManySchools(self); //Lets query for number of schools related to user.
            return data;
        });
    },
    componentWillUnmount: function() {
        var self = this;

        self.request && self.request.cancel();
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            metaBinding = binding.meta(),
            schoolPicture = binding.get('pic'),
            siteLink = binding.get('domain') + '.stage.squadintouch.com',
            geoPoint = binding.toJS('postcode.point');
    return (
        <div>
          <div className="changeSchool">
              {/*Check if the current user has more than one schools listed against him/her before showing swap icon*/}
              <If condition={metaBinding.get('numOfSchools') > 1 }>
                  <a title="Change active school" href="/#schools" className="addButton">
                      <SVG icon="icon_change_school" />
                  </a>
              </If>
          </div>
          <div className="eSchoolMaster_summary">
            <div className="summary_inside">
              <div className="editSchool">
                <a href={'/#schools/edit?id=' + self.activeSchoolId}>
                  <div className="eEdit_btn"></div>
                </a>
              </div>
              <h1 className="eSchoolMaster_title">
                {schoolPicture ? <div className="eSchoolMaster_flag"><img src={schoolPicture}/></div> : ''}
                {binding.get('name')}

              </h1>

              <p>PostCode: {binding.get('postcodeId')}</p>

              <p>Address: {binding.get('address')}</p>

              <div className="eDescription">
                <p>Description: {binding.get('description')}</p>
              </div>
              <p>Site: <a href={'//' + siteLink} target="blank"
                          title="binding.get('name') homepage">http://{siteLink}</a>
              </p>
            </div>
            <If condition={geoPoint !== undefined}>
              <Map binding={binding} point={binding.toJS('postcode.point')}/>
            </If>

          </div>
        </div>
    )
  }
});


module.exports = SchoolSummary;
