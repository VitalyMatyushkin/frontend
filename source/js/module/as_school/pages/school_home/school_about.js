/**
 * Created by Anatoly on 02.11.2016.
 */
const   React       = require('react'),
		Morearty    = require('morearty');

const SchoolAbout = React.createClass({
	mixins:[Morearty.Mixin],

	render:function(){
		const activeSchool 	= this.getMoreartyContext().getBinding().toJS('activeSchool'),
			  stylePic		= {backgroundImage: `url(${activeSchool.pic || 'images/default_blazon.svg'})`};

		return (
			<div className="bSchoolAbout">
				<div className="container">
					<div className="row">
						<div className="col-md-10 col-md-offset-1">
							<div className="eSchoolPicWrapper">
								<div className="eSchoolPic" style={stylePic}/>
							</div>
							<h1 className="eSchoolName">{activeSchool.name}</h1>

							<p className="eSchoolDescription">{activeSchool.description}</p>
							<a className="eSchoolLink">link</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = SchoolAbout;




