const React = require('react');
const Helper = require('module/as_manager/pages/clubs/clubs_children_edit/helper');
const ClubcChildrenWrapperStyle = require('styles/pages/b_club_children_manager_wrapper.scss');

function Header() {
	return (
		<div className='eClubChildrenManagerWrapper_header'>
			<h2>
				Edit children
			</h2>
			<p>
				{Helper.TEXT[0]}
			</p>
			<p>
				{Helper.TEXT[1]}
			</p>
		</div>
	);
};

module.exports = Header;