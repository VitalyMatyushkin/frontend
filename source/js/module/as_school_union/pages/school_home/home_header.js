/**
 * Created by bridark on 31/07/15.
 */
const   Immutable 	= require('immutable'),
        React       = require('react'),
        Superuser   = require('module/helpers/superuser'),
        Helpers		= require('module/helpers/storage'),
        Morearty    = require('morearty'),
        Lazy        = require('lazy.js');

/** Array of default photos to show when there is no photos got from server side for any possible reason */
const defaultPhotos = [
    'http://www.isparis.edu/uploaded/images/home/sports/slideshow_cover.JPG',
    'http://mattjwaller.com/wp-content/uploads/2011/06/Prep-Sport-Football-4.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/3/34/Powder_puff_football.jpg'
];

/** Gallery slider with few overlay buttons
 * TODO:
 * Note, it does not load anything itself and only display data from binding, so it is good candidate for turning in
 * pure react component.
 *
 **/
const HomeHeader = React.createClass({

    mixins:[Morearty.Mixin],

    componentWillMount:function() {
        const   self            = this,
                binding         = self.getDefaultBinding(),
                rootBinding     = self.getMoreartyContext().getBinding(),
                currentSchool   = this.getMoreartyContext().getBinding().get('activeSchool'),
                defaultAlbumId  = currentSchool.get('defaultAlbumId'),
                activeSchoolId  = this.getMoreartyContext().getBinding().get('activeSchoolId');
       
        rootBinding.set('activeSchoolId',Immutable.fromJS(activeSchoolId));
        //we already have current school data so lets use it - at least for the school details
        binding.set('school', Immutable.fromJS(currentSchool));
		// setting empty photos to show. Will use them in render
		binding.set('___photosToShow', Immutable.fromJS([]));

        if(defaultAlbumId){
            //if we have album id we do some logic here - TBC
            //TODO: Reuse code below when photos method and view has been implemented on server
             window.Server.publicSchoolAlbumPhotos.get({
                 schoolId:  activeSchoolId,
                 albumId:   defaultAlbumId
             })
             .then(photos => {
                 if(photos.length != 0) {
                     binding.set('___photosToShow', Immutable.fromJS(photos.map(photo => photo.picUrl)));
                 } else {
                     binding.set('___photosToShow', Immutable.fromJS(defaultPhotos));
                 }
             });
        } else {
            binding.set('___photosToShow', Immutable.fromJS(defaultPhotos));
        }
    },

    componentDidMount: function(){
        const   self            = this,
                headerSection   = self.refs.schoolMainBanner;

        /** running timer which will switch images in header */
        self.intervalId = setInterval(() => {
            const   photos          = this.getDefaultBinding().get('___photosToShow').toArray() || [],  // there is possibility that on first call binding will be empty
                    randIndexPos    = Math.floor(Math.random() * photos.length);

            if(photos.length !== 0) {
                /* maybe this is not really so bad as it looks like because otherwise React Animation should be used */
                headerSection.style.backgroundImage = "url(" + photos[randIndexPos] +")";
            }
        },5000);
    },

    componentWillUnmount: function(){
        clearInterval(this.intervalId);
        this.getDefaultBinding().remove('___photosToShow'); // wiping out that shit
    },

    render: function(){
        const   self            = this,
                binding         = self.getDefaultBinding(),
				activeSchool	= this.getMoreartyContext().getBinding().get('activeSchool'),
                schoolName      = activeSchool.get('name'),
                schoolBlazon    = {backgroundImage:`url(${activeSchool.get('pic') || 'images/default_blazon.svg'})`};

        return(
            <div className="eSchoolHeader">
                <div ref="schoolMainBanner" className="eSchoolMainSlideOutBanner transitionImage"></div>
            </div>
        )
    }
});
module.exports = HomeHeader;