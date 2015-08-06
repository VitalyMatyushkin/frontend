/**
 * Created by bridark on 31/07/15.
 */
var HomeHeader, localArrayOfPhotos;
localArrayOfPhotos = [];
HomeHeader = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('activeSchoolId');
        window.Server.school.get({id:activeSchoolId}).then(function(school){
            binding.set('school',Immutable.fromJS(school));
            window.Server.addAlbum.get({
                filter:{
                    //where:{and:[{ownerId:school.id},{name:'schoolProfile'}]},
                    include:'photos',
                    limit:6
                }}).then(function(albumForSchool){
                console.log(albumForSchool);
                albumForSchool.forEach(function(album){
                    album.photos.forEach(function(photo){
                        //localArrayOfPhotos.push(photo.pic);
                    });
                });
                //console.log(localArrayOfPhotos);
                //Hardcoded for now to test image swapping
                localArrayOfPhotos.push('http://www.isparis.edu/uploaded/images/home/sports/slideshow_cover.JPG');
                localArrayOfPhotos.push('http://mattjwaller.com/wp-content/uploads/2011/06/Prep-Sport-Football-4.jpg');
                localArrayOfPhotos.push('https://upload.wikimedia.org/wikipedia/commons/3/34/Powder_puff_football.jpg');
                localArrayOfPhotos.push('http://www.sheptonmalletjournal.co.uk/images/localworld/ugc-images/276417/Article/images/21013360/6047137-large.jpg');
                localArrayOfPhotos.push('http://www.pgl.co.uk/Files/Files/Schools/Secondary%20Schools/Carousel/SS-M-Outdoor-Education-Sports-Weekends-Football-MUSS.jpg');
                localArrayOfPhotos.push('http://www.northyorkshiresport.co.uk/assets/images/School%20Games/School%20Games%20Launch%201.jpg');
            });
        });
    },
    componentDidMount:function(){
        var self = this,
            headerSection = React.findDOMNode(self.refs.schoolMainBanner);
        self.intervalId = setInterval(function(){
            var randIndexPos = Math.floor(Math.random()*((localArrayOfPhotos.length-1)+1));
            //console.log(randIndexPos);
            headerSection.src = localArrayOfPhotos[randIndexPos];
        },5000);
    },
    componentWillUnmount:function(){
      clearInterval(self.intervalId);
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            schoolName = binding.get('school.name') !== undefined ? binding.get('school.name'):'The peoples School',
            schoolMotto = binding.get('school.description') !== undefined ? binding.get('school.description') :'Mens Sana in corpore sano - Healthy mind in a healthy body',
            schoolBlazon = binding.get('school.pic') !== undefined ? binding.get('school.pic'):'http://placehold.it/400x400',
            backgroundImageUrl = binding.get('school.home') !== undefined ? binding.get('school.home') :'http://www.isparis.edu/uploaded/images/home/sports/slideshow_cover.JPG';
        return(
            <div className="eSchoolHeader">
                <div className="eSchoolMainSlideOutBanner">
                    <img ref="schoolMainBanner" className="transitionImage" src="http://www.isparis.edu/uploaded/images/home/sports/slideshow_cover.JPG" />
                </div>
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