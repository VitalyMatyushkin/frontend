/**
 * Retrun active school id
 * @param self - context(this) of react element that include morearty mixin
 */
function getActiveSchoolId(self) {
   return self.getMoreartyContext().getBinding().get('userRules.activeSchoolId');
}

const MoreartyHelper = {
    getActiveSchoolId: getActiveSchoolId
}

module.exports = MoreartyHelper;