/**
 * Created by bridark on 31/07/15.
 */
var HomeHeader;
HomeHeader = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('activeSchoolId');
        window.Server.school.get({id:activeSchoolId}).then(function(school){
            binding.set('school',Immutable.fromJS(school));
            console.log(school);
        });
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            schoolName = binding.get('school.name') !== undefined ? binding.get('school.name'):'The peoples School',
            schoolMotto = binding.get('school.motto') !== undefined ? binding.get('school.motto') :'Mens Sana in corpore sano - Healthy mind in a healthy body',
            schoolBlazon = binding.get('school.pic') !== undefined ? binding.get('school.pic'):'http://placehold.it/400x400',
            backgroundImageUrl = binding.get('school.home') !== undefined ? binding.get('school.home') :'http://www.isparis.edu/uploaded/images/home/sports/slideshow_cover.JPG';
        return(
            <div className="eSchoolHeader" style={{backgroundImage:'url('+backgroundImageUrl+')'}}>
                <div className="eSchoolMastHead">
                    <div className="eSchoolGreeting">
                        <span className="eSchoolSalute">Welcome <i>to</i></span>
                        <span className="eSchoolName">{schoolName}</span>
                    </div>
                    <div className="eSchoolMotto">
                        <div className="mottoWrapper">
                            <div className="eSchoolMottoText">
                                {schoolMotto}
                            </div>
                            <div className="eSchoolBlazon">
                                <img src={schoolBlazon}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = HomeHeader;