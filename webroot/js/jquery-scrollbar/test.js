'use strict';
var Howdo = window.Howdo;


var howdo = new Howdo();

howdo.task(function(next){
	烧水(function(){
		next(error, 热水);
	});
});

howdo.task(function(next, 热水){
	做饭(function(){
		next(error, 熟饭);
	});
});

howdo.follow(function(error, 熟饭){
	// 
});



var howdo = new Howdo();

howdo
// 听歌
.task(function(done){
	听歌(function(){
		done(error, 听完了);
	});
})
// 看书
.task(function(done){
	看书(function(){
		done(error, 看完了);
	});
})
// 结束
.together(function(error, 听完了, 看完了){
	歌听完了，书也看完了
});




var howdo = new Howdo();

做100遍.forEach(function(){
	howdo.task(function(done){
		done();
	});
});

howdo.together(function(error){
	100遍都做完了
});

