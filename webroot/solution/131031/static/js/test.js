$.ajax({
	url: location.href,
	type: "post",
	dataType: "html",
	data: {
		comment: '..' + Math.random(),
		author: '..' + Math.random(),
		email: '..@163.com',
		url: '..',
		comment_post_ID: 4888,
		comment_parent: 0,
		action: 'ajax_comment',
	}
});
