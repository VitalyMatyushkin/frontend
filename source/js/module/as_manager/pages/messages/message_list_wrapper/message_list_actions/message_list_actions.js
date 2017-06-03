const	Promise			= require('bluebird'),
		Immutable		= require('immutable'),
		MessageConsts	= require('module/ui/message_list/message/const/message_consts');

const MessageListActions = {
	loadMessages: function(messageType) {
		switch (messageType) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return this.loadInboxMessages();
			case MessageConsts.MESSAGE_TYPE.OUTBOX:
				return this.loadOutboxMessages();
			case MessageConsts.MESSAGE_TYPE.ARCHIVE:
				return this.loadArchiveMessages();
		}
	},
	loadInboxMessages: function() {
		const	_msg1	= '{"kind":"INVITATION", "title": "New team Football vs Handcross Park School (H)", "invitedSchoolId":"57b6c9a6dd69264b6c5ba82d", "invitedSchool":{"id":"57b6c9a6dd69264b6c5ba82d","name":"Great Walstead School","pic":"//img.stage1.squadintouch.com/images/qkmon9jcpe1vcbsjen3iv03gneqmtg94mrnv_1473310466102.png"},"status":"NOT_READY","sport":{"id":"57b6cc06a4e23b56709e5de1","name":"Football","genders":{"maleOnly":true,"femaleOnly":true,"mixed":true},"players":"TEAM"},"eventId":"592e78dc39dbc44451182faa","inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","event":{"teamsData":[{"id":"592e78dc39dbc44451182f9f","name":"Football","gender":"MALE_ONLY","schoolId":"57b6c9a6dd69264b6c5ba82f"}],"gender":"MALE_ONLY","invitedSchools":[{"id":"57b6c9a6dd69264b6c5ba82d","name":"Great Walstead School","pic":"//img.stage1.squadintouch.com/images/qkmon9jcpe1vcbsjen3iv03gneqmtg94mrnv_1473310466102.png"}],"invitedSchoolIds":["57b6c9a6dd69264b6c5ba82d"],"startTime":"2017-05-31T07:00:00.455Z","venue":{"postcodeId":"57b6cd0b1c0b151bcf94b3a2","venueType":"HOME","postcodeData":{"id":"57b6cd0b1c0b151bcf94b3a2","postcode":"RH17 6HF","postcodeNoSpaces":"RH176HF","point":{"coordinates":[-0.19509408816961832,51.06252995784982],"type":"Point","lng":-0.19509408816961832,"lat":51.06252995784982}}},"ages":[3,5,7,10,4,6,8,13],"sport":{"id":"57b6cc06a4e23b56709e5de1","name":"Football","genders":{"maleOnly":true,"femaleOnly":true,"mixed":true},"players":"TEAM"},"teams":["592e78dc39dbc44451182f9f"],"inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg"}},"id":"592e78dd39dbc44451182fb8","createdAt":"2017-05-31T08:03:41.418Z","inviteComments":{"expandedComments":false},"inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg"}}',
				msg1	= JSON.parse(_msg1),
				_msg2	= '{"kind":"INVITATION", "title": "Boys Sprint (100 m) vs Great Walstead School (A)", "threadId":"592f3d39ead8c74a82ff819a","invitedSchoolId":"57b6c9a6dd69264b6c5ba82d","updatedAt":"2017-05-31T22:01:29.871Z","invitedSchool":{"id":"57b6c9a6dd69264b6c5ba82d","name":"Great Walstead School","pic":"//img.stage1.squadintouch.com/images/qkmon9jcpe1vcbsjen3iv03gneqmtg94mrnv_1473310466102.png"},"status":"NOT_READY","sport":{"id":"57b6dc9b78b494f12a4c0b24","name":"Basketball","genders":{"maleOnly":true,"femaleOnly":true,"mixed":true},"players":"TEAM"},"eventId":"592f3d39ead8c74a82ff818d","inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","event":{"teamsData":[{"id":"592f3d38ead8c74a82ff8186","name":"T1","gender":"MALE_ONLY","schoolId":"57b6c9a6dd69264b6c5ba82f"}],"gender":"MALE_ONLY","invitedSchools":[{"id":"57b6c9a6dd69264b6c5ba82d","name":"Great Walstead School","pic":"//img.stage1.squadintouch.com/images/qkmon9jcpe1vcbsjen3iv03gneqmtg94mrnv_1473310466102.png"}],"invitedSchoolIds":["57b6c9a6dd69264b6c5ba82d"],"startTime":"2017-06-12T07:00:00.000Z","venue":{"postcodeId":"57b6cd0b1c0b151bcf94b3a2","venueType":"HOME","postcodeData":{"id":"57b6cd0b1c0b151bcf94b3a2","postcode":"RH17 6HF","postcodeNoSpaces":"RH176HF","point":{"coordinates":[-0.19509408816961832,51.06252995784982],"type":"Point","lng":-0.19509408816961832,"lat":51.06252995784982}}},"ages":[3,5,7,10,13,8,4,6],"sport":{"id":"57b6dc9b78b494f12a4c0b24","name":"Basketball","genders":{"maleOnly":true,"femaleOnly":true,"mixed":true},"players":"TEAM"},"teams":["592f3d38ead8c74a82ff8186"],"inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg"}},"id":"592f3d39ead8c74a82ff819b","createdAt":"2017-05-31T22:01:29.871Z","inviteComments":{"expandedComments":false},"inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg"}}',
				msg2	= JSON.parse(_msg2);

		const	_child1	= '{"id":"57b6c9a6dd69264b6c5ba86a","updatedAt":"2017-05-11T11:35:34.802Z","createdAt":"2016-08-19T08:56:14.357Z","firstName":"Stanley","lastName":"Lemke","birthday":"1997-05-18","gender":"MALE","statusNotes":null,"email":"ir.vi.lapshina+101@gmail.com","status":"ACTIVE","permissionId":"57b6c9a6dd69264b6c5ba86b","schoolId":"57b6c9a6dd69264b6c5ba82d","formId":"57b6c9a6dd69264b6c5ba833","houseId":"57b6c9a6dd69264b6c5ba832","nextOfKin":[{"relationship":"mother","firstName":"Ann","lastName":"Black"},{"relationship":"Stranger","firstName":"Be","lastName":"Green","phone":"+4444445555","email":"444555@mail.com"}],"medicalInfo":"sdfsdfsdfsdfsdfsdf"}',
				child1	= JSON.parse(_child1),
				_child2	= '{"id":"57b6c9a8dd69264b6c5bac52","updatedAt":"2016-08-19T08:56:15.283Z","createdAt":"2016-08-19T08:56:15.283Z","firstName":"Johnson","lastName":"Brown","birthday":"2000-11-21","gender":"MALE","status":"ACTIVE","permissionId":"57b6c9a8dd69264b6c5bac53","schoolId":"57b6c9a6dd69264b6c5ba82f","formId":"581add5a07b96fee31c4a50d","houseId":"57b6c9a6dd69264b6c5ba84d","nextOfKin":[{"relationship":"","firstName":"","lastName":"","phone":"","email":""}],"medicalInfo":"xbcdfv f xfg xf xdf zfd dzf zf zf dfzfzdsfdsfs sfsefesf sfsesefs esfsef"}',
				child2	= JSON.parse(_child2);

		msg1.child = child1;
		msg2.child = child2;

		return Promise.resolve([msg1, msg2]);
	},
	loadOutboxMessages: function() {
		const	_msg1	= '{"kind":"REFUSAL", "title": "New team Football vs Handcross Park School (H)", "threadId":"592e78dd39dbc44451182fb7","invitedSchoolId":"57b6c9a6dd69264b6c5ba82d","updatedAt":"2017-05-31T08:03:41.418Z","invitedSchool":{"id":"57b6c9a6dd69264b6c5ba82d","name":"Great Walstead School","pic":"//img.stage1.squadintouch.com/images/qkmon9jcpe1vcbsjen3iv03gneqmtg94mrnv_1473310466102.png"},"status":"NOT_READY","sport":{"id":"57b6cc06a4e23b56709e5de1","name":"Football","genders":{"maleOnly":true,"femaleOnly":true,"mixed":true},"players":"TEAM"},"eventId":"592e78dc39dbc44451182faa","inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","event":{"teamsData":[{"id":"592e78dc39dbc44451182f9f","name":"Football","gender":"MALE_ONLY","schoolId":"57b6c9a6dd69264b6c5ba82f"}],"gender":"MALE_ONLY","invitedSchools":[{"id":"57b6c9a6dd69264b6c5ba82d","name":"Great Walstead School","pic":"//img.stage1.squadintouch.com/images/qkmon9jcpe1vcbsjen3iv03gneqmtg94mrnv_1473310466102.png"}],"invitedSchoolIds":["57b6c9a6dd69264b6c5ba82d"],"startTime":"2017-05-31T07:00:00.455Z","venue":{"postcodeId":"57b6cd0b1c0b151bcf94b3a2","venueType":"HOME","postcodeData":{"id":"57b6cd0b1c0b151bcf94b3a2","postcode":"RH17 6HF","postcodeNoSpaces":"RH176HF","point":{"coordinates":[-0.19509408816961832,51.06252995784982],"type":"Point","lng":-0.19509408816961832,"lat":51.06252995784982}}},"ages":[3,5,7,10,4,6,8,13],"sport":{"id":"57b6cc06a4e23b56709e5de1","name":"Football","genders":{"maleOnly":true,"femaleOnly":true,"mixed":true},"players":"TEAM"},"teams":["592e78dc39dbc44451182f9f"],"inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg"}},"id":"592e78dd39dbc44451182fb8","createdAt":"2017-05-31T08:03:41.418Z","inviteComments":{"expandedComments":false},"inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg"}}',
				msg1	= JSON.parse(_msg1),
				_msg2	= '{"kind":"REFUSAL", "title": "Boys Sprint (100 m) vs Great Walstead School (A)", "threadId":"592f3d39ead8c74a82ff819a","invitedSchoolId":"57b6c9a6dd69264b6c5ba82d","updatedAt":"2017-05-31T22:01:29.871Z","invitedSchool":{"id":"57b6c9a6dd69264b6c5ba82d","name":"Great Walstead School","pic":"//img.stage1.squadintouch.com/images/qkmon9jcpe1vcbsjen3iv03gneqmtg94mrnv_1473310466102.png"},"status":"NOT_READY","sport":{"id":"57b6dc9b78b494f12a4c0b24","name":"Basketball","genders":{"maleOnly":true,"femaleOnly":true,"mixed":true},"players":"TEAM"},"eventId":"592f3d39ead8c74a82ff818d","inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","event":{"teamsData":[{"id":"592f3d38ead8c74a82ff8186","name":"T1","gender":"MALE_ONLY","schoolId":"57b6c9a6dd69264b6c5ba82f"}],"gender":"MALE_ONLY","invitedSchools":[{"id":"57b6c9a6dd69264b6c5ba82d","name":"Great Walstead School","pic":"//img.stage1.squadintouch.com/images/qkmon9jcpe1vcbsjen3iv03gneqmtg94mrnv_1473310466102.png"}],"invitedSchoolIds":["57b6c9a6dd69264b6c5ba82d"],"startTime":"2017-06-12T07:00:00.000Z","venue":{"postcodeId":"57b6cd0b1c0b151bcf94b3a2","venueType":"HOME","postcodeData":{"id":"57b6cd0b1c0b151bcf94b3a2","postcode":"RH17 6HF","postcodeNoSpaces":"RH176HF","point":{"coordinates":[-0.19509408816961832,51.06252995784982],"type":"Point","lng":-0.19509408816961832,"lat":51.06252995784982}}},"ages":[3,5,7,10,13,8,4,6],"sport":{"id":"57b6dc9b78b494f12a4c0b24","name":"Basketball","genders":{"maleOnly":true,"femaleOnly":true,"mixed":true},"players":"TEAM"},"teams":["592f3d38ead8c74a82ff8186"],"inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg"}},"id":"592f3d39ead8c74a82ff819b","createdAt":"2017-05-31T22:01:29.871Z","inviteComments":{"expandedComments":false},"inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg"}}',
				msg2	= JSON.parse(_msg2);

		const	_child1	= '{"id":"57b6c9a6dd69264b6c5ba86a","updatedAt":"2017-05-11T11:35:34.802Z","createdAt":"2016-08-19T08:56:14.357Z","firstName":"Stanley","lastName":"Lemke","birthday":"1997-05-18","gender":"MALE","statusNotes":null,"email":"ir.vi.lapshina+101@gmail.com","status":"ACTIVE","permissionId":"57b6c9a6dd69264b6c5ba86b","schoolId":"57b6c9a6dd69264b6c5ba82d","formId":"57b6c9a6dd69264b6c5ba833","houseId":"57b6c9a6dd69264b6c5ba832","nextOfKin":[{"relationship":"mother","firstName":"Ann","lastName":"Black"},{"relationship":"Stranger","firstName":"Be","lastName":"Green","phone":"+4444445555","email":"444555@mail.com"}],"medicalInfo":"sdfsdfsdfsdfsdfsdf"}',
			child1	= JSON.parse(_child1),
			_child2	= '{"id":"57b6c9a8dd69264b6c5bac52","updatedAt":"2016-08-19T08:56:15.283Z","createdAt":"2016-08-19T08:56:15.283Z","firstName":"Johnson","lastName":"Brown","birthday":"2000-11-21","gender":"MALE","status":"ACTIVE","permissionId":"57b6c9a8dd69264b6c5bac53","schoolId":"57b6c9a6dd69264b6c5ba82f","formId":"581add5a07b96fee31c4a50d","houseId":"57b6c9a6dd69264b6c5ba84d","nextOfKin":[{"relationship":"","firstName":"","lastName":"","phone":"","email":""}],"medicalInfo":"xbcdfv f xfg xf xdf zfd dzf zf zf dfzfzdsfdsfs sfsefesf sfsesefs esfsef"}',
			child2	= JSON.parse(_child2);

		msg1.child = child1;
		msg2.child = child2;

		return Promise.resolve([msg1, msg2]);
	},
	loadArchiveMessages: function() {
		const	_msg1	= '{"kind":"INVITATION", "title": "New team Football vs Handcross Park School (H)", "readStatus":"READ", "invitationStatus":"ACCEPTED" ,"threadId":"592e78dd39dbc44451182fb7","invitedSchoolId":"57b6c9a6dd69264b6c5ba82d","updatedAt":"2017-05-31T08:03:41.418Z","invitedSchool":{"id":"57b6c9a6dd69264b6c5ba82d","name":"Great Walstead School","pic":"//img.stage1.squadintouch.com/images/qkmon9jcpe1vcbsjen3iv03gneqmtg94mrnv_1473310466102.png"},"sport":{"id":"57b6cc06a4e23b56709e5de1","name":"Football","genders":{"maleOnly":true,"femaleOnly":true,"mixed":true},"players":"TEAM"},"eventId":"592e78dc39dbc44451182faa","inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","event":{"teamsData":[{"id":"592e78dc39dbc44451182f9f","name":"Football","gender":"MALE_ONLY","schoolId":"57b6c9a6dd69264b6c5ba82f"}],"gender":"MALE_ONLY","invitedSchools":[{"id":"57b6c9a6dd69264b6c5ba82d","name":"Great Walstead School","pic":"//img.stage1.squadintouch.com/images/qkmon9jcpe1vcbsjen3iv03gneqmtg94mrnv_1473310466102.png"}],"invitedSchoolIds":["57b6c9a6dd69264b6c5ba82d"],"startTime":"2017-05-31T07:00:00.455Z","venue":{"postcodeId":"57b6cd0b1c0b151bcf94b3a2","venueType":"HOME","postcodeData":{"id":"57b6cd0b1c0b151bcf94b3a2","postcode":"RH17 6HF","postcodeNoSpaces":"RH176HF","point":{"coordinates":[-0.19509408816961832,51.06252995784982],"type":"Point","lng":-0.19509408816961832,"lat":51.06252995784982}}},"ages":[3,5,7,10,4,6,8,13],"sport":{"id":"57b6cc06a4e23b56709e5de1","name":"Football","genders":{"maleOnly":true,"femaleOnly":true,"mixed":true},"players":"TEAM"},"teams":["592e78dc39dbc44451182f9f"],"inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg"}},"id":"592e78dd39dbc44451182fb8","createdAt":"2017-05-31T08:03:41.418Z","inviteComments":{"expandedComments":false},"inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg"}}',
				msg1	= JSON.parse(_msg1),
				_msg2	= '{"kind":"REFUSAL", "title": "Boys Sprint (100 m) vs Great Walstead School (A)", "readStatus":"READ", "threadId":"592f3d39ead8c74a82ff819a","invitedSchoolId":"57b6c9a6dd69264b6c5ba82d","updatedAt":"2017-05-31T22:01:29.871Z","invitedSchool":{"id":"57b6c9a6dd69264b6c5ba82d","name":"Great Walstead School","pic":"//img.stage1.squadintouch.com/images/qkmon9jcpe1vcbsjen3iv03gneqmtg94mrnv_1473310466102.png"},"sport":{"id":"57b6dc9b78b494f12a4c0b24","name":"Basketball","genders":{"maleOnly":true,"femaleOnly":true,"mixed":true},"players":"TEAM"},"eventId":"592f3d39ead8c74a82ff818d","inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","event":{"teamsData":[{"id":"592f3d38ead8c74a82ff8186","name":"T1","gender":"MALE_ONLY","schoolId":"57b6c9a6dd69264b6c5ba82f"}],"gender":"MALE_ONLY","invitedSchools":[{"id":"57b6c9a6dd69264b6c5ba82d","name":"Great Walstead School","pic":"//img.stage1.squadintouch.com/images/qkmon9jcpe1vcbsjen3iv03gneqmtg94mrnv_1473310466102.png"}],"invitedSchoolIds":["57b6c9a6dd69264b6c5ba82d"],"startTime":"2017-06-12T07:00:00.000Z","venue":{"postcodeId":"57b6cd0b1c0b151bcf94b3a2","venueType":"HOME","postcodeData":{"id":"57b6cd0b1c0b151bcf94b3a2","postcode":"RH17 6HF","postcodeNoSpaces":"RH176HF","point":{"coordinates":[-0.19509408816961832,51.06252995784982],"type":"Point","lng":-0.19509408816961832,"lat":51.06252995784982}}},"ages":[3,5,7,10,13,8,4,6],"sport":{"id":"57b6dc9b78b494f12a4c0b24","name":"Basketball","genders":{"maleOnly":true,"femaleOnly":true,"mixed":true},"players":"TEAM"},"teams":["592f3d38ead8c74a82ff8186"],"inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg"}},"id":"592f3d39ead8c74a82ff819b","createdAt":"2017-05-31T22:01:29.871Z","inviteComments":{"expandedComments":false},"inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg"}}',
				msg2	= JSON.parse(_msg2);

		const	_child1	= '{"id":"57b6c9a6dd69264b6c5ba86a","updatedAt":"2017-05-11T11:35:34.802Z","createdAt":"2016-08-19T08:56:14.357Z","firstName":"Stanley","lastName":"Lemke","birthday":"1997-05-18","gender":"MALE","statusNotes":null,"email":"ir.vi.lapshina+101@gmail.com","status":"ACTIVE","permissionId":"57b6c9a6dd69264b6c5ba86b","schoolId":"57b6c9a6dd69264b6c5ba82d","formId":"57b6c9a6dd69264b6c5ba833","houseId":"57b6c9a6dd69264b6c5ba832","nextOfKin":[{"relationship":"mother","firstName":"Ann","lastName":"Black"},{"relationship":"Stranger","firstName":"Be","lastName":"Green","phone":"+4444445555","email":"444555@mail.com"}],"medicalInfo":"sdfsdfsdfsdfsdfsdf"}',
			child1	= JSON.parse(_child1),
			_child2	= '{"id":"57b6c9a8dd69264b6c5bac52","updatedAt":"2016-08-19T08:56:15.283Z","createdAt":"2016-08-19T08:56:15.283Z","firstName":"Johnson","lastName":"Brown","birthday":"2000-11-21","gender":"MALE","status":"ACTIVE","permissionId":"57b6c9a8dd69264b6c5bac53","schoolId":"57b6c9a6dd69264b6c5ba82f","formId":"581add5a07b96fee31c4a50d","houseId":"57b6c9a6dd69264b6c5ba84d","nextOfKin":[{"relationship":"","firstName":"","lastName":"","phone":"","email":""}],"medicalInfo":"xbcdfv f xfg xf xdf zfd dzf zf zf dfzfzdsfdsfs sfsefesf sfsesefs esfsef"}',
			child2	= JSON.parse(_child2);

		msg1.child = child1;
		msg2.child = child2;

		return Promise.resolve([msg1, msg2]);
	}
};

module.exports = MessageListActions;