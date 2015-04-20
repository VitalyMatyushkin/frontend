var NewsPage,
	SVG = require('module/ui/svg');

NewsPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<div className="bSchoolNews">
					<div className="eSchoolNews_news">
						<img className="eSchoolNews_image" src="https://meduza.io/image/attachment_overrides/images/000/000/070/ov/OcNOeC1vqd2ehz5Qv7T1wQ.jpg" />
						<div className="eSchoolNews_date">April 20, 2015</div>
						<div className="eSchoolNews_title">3 Must-Know Facts for Teaching High Schoolers in Military Families</div>
						<div className="eSchoolNews_text">
							The military lifestyle can tough on high schoolers. Teens from military families are more likely than those who aren't to think about, plan and attempt suicide, according to a study of California ninth- and 11th-graders released last month. For military wife Cindy Simerly, relocating to a community ...
						</div>
					</div>

					<div className="eSchoolNews_news">
						<div className="eSchoolNews_date">March 2, 2015</div>
						<div className="eSchoolNews_title">Teens Take a Bite Out of Business in High School Incubator Classes</div>
						<div className="eSchoolNews_text">
							Forget meager landscaping or babysitting operations. Some teens are creating booming large-scale businesses. Take Noa Mintz, for example. The 15-year-old entrepreneur established a babysitting agency when she was 12 that has revenues of $375,000, Entrepreneur magazine reported last month.
						</div>
					</div>

					<div className="eSchoolNews_news">
						<div className="eSchoolNews_date">Feb. 16, 2015</div>
						<div className="eSchoolNews_title">How High School Teachers, Parents Can Encourage Teens to Read for Fun</div>
						<div className="eSchoolNews_text">
							Teens aren't reading for fun like they used to. Only 19 percent of 17-year-olds read for fun every day in 2012 – down from 31 percent in 1984, according to a 2014 report from Common Sense Media, a media and technology education and advocacy organization.
						</div>
					</div>

				</div>
			</div>
		)
	}
});


module.exports = NewsPage;
