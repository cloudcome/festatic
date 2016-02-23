// options
$.storage.defaults = {
    // 默认为 localStorage，可选 session为sessionStorage
    type: 'local'
};
$.storage({
    // 默认为 localStorage，可选 session为sessionStorage
    type: 'local'
});


// set
$.storage().set('key', 'val');
$.storage().set({
	key1: 'val1',
	key2: 'val2',
});


// get
$.storage().get('key');
$.storage().get(['key1', 'key2']);


// remove
$.storage().remove('key');
$.storage().remove(['key1', 'key2']);


// clear
$.storage().clear();


// bind
$.storage().bind('key', fn);


// unbind
$.storage().unbind('key', fn);
// unbind all
$.storage().unbind('key');



