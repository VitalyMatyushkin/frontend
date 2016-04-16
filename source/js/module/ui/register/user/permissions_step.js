const   RegistrationPermissionField = require('module/ui/register/user/registration_permissions_field'),
        classNames                  = require('classnames'),
        React                       = require('react'),
        Immutable                   = require('immutable');


let multipleFields, studentFields = [];

const PermissionsStep = React.createClass({
  mixins: [Morearty.Mixin],
  displayName: 'PermissionsList',
  propTypes: {
    onSuccess: React.PropTypes.func
  },
  getDefaultState: function () {
    return Immutable.fromJS({
      type:       null,
      schoolId:   null,
      formId:     null,
      formName:   null,
      houseId:    null,
      houseName:  null,
      firstName:  null,
      lastName:   null
    });
  },
  componentWillMount: function () {
    const   self    = this,
            binding = self.getDefaultBinding();

    self.types = [
      { name: 'parent'  },
      { name: 'admin'   },
      { name: 'manager' },
      { name: 'teacher' },
      { name: 'coach'   }
    ];

    binding.sub('schoolId').addListener(function (descriptor) {

      if (descriptor.isValueChanged()) {
        binding.sub('_houseAutocomplete').clear();
        binding.sub('_formAutocomplete').clear();
        binding
            .atomically()
            .set('formId', null)
            .set('formName', null)
            .set('houseId', null)
            .set('houseName', null)
            .commit();
      }
    });
    multipleFields = 1;
  },
  _onClickType: function (type) {
    var self = this,
        binding = self.getDefaultBinding();

    binding
        .atomically()
        .set('type', type)
        .commit();
  },
  fieldsMultiplier: function () {
    var self = this;
    if (multipleFields <= 2) {
      multipleFields += 1;
    }
    self.forceUpdate();
  },

  /** will render list with all available roles to join */
  renderChooser: function () {
    const   self    = this,
            binding = self.getDefaultBinding();

    return <div className="eRegistration_chooser">
      {self.types.map(function (type) {
        var itemClasses = classNames({
          eRegistration_chooserItem: true,
          mActive: binding.get('type') === type.name
        });

        return <div className={itemClasses} onClick={self._onClickType.bind(null, type.name)}>
          <div className="eChooserItem_wrap">
            <div className="eChooserItem_inside"></div>
          </div>
          <span className="eRegistration_chooserTitle">{type.name}</span>
        </div>;
      })}
    </div>
  },
  isFormFilled: function (currentType) {
    const   self    = this,
            binding = self.getDefaultBinding();
    return (
            (
                currentType === 'admin' || currentType === 'manager' ||
                currentType === 'teacher' || currentType === 'coach'
            ) && binding.get('schoolId') !== null
        ) ||
        (
            currentType === 'parent' &&
            binding.get('schoolId') !== null && binding.get('houseId') !== null &&
            binding.get('formId') !== null && binding.get('firstName') !== null &&
            binding.get('lastName') !== null
        );
  },
  render: function () {
    const   self                = this,
            binding             = self.getDefaultBinding(),
            currentType         = binding.get('type');

    let isShowFinishButton  = false;

    if (self.isFormFilled(currentType)) {
      isShowFinishButton = true;
    }

    return <div className="eRegistration_permissions">
      <div className="eRegistration_annotation">Join as:</div>
      {self.renderChooser()}
      <div className="eRegistration_permissionStep" style={{}}>
        <RegistrationPermissionField binding={binding} isFormFilled={isShowFinishButton}
                                     onSuccess={self.props.onSuccess} showButtons={true}
                                     fieldCounter={multipleFields} onAnother={self.fieldsMultiplier}/>
      </div>
    </div>
  }
});

module.exports = PermissionsStep;
