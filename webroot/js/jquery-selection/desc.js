// 1、位置
// 光标开始位置
$("#id").selection().start;

// 光标结束位置
$("#id").selection().end;


// 2、文本
// 选中的文本
$("#id").selection().val;

// 选中指定文本
$("#id").selection().select("selectVal");

// 选中指定位置文本，从位置10到结尾
$("#id").selection().select(10);

// 选中指定位置文本，从位置10到位置20
$("#id").selection().select(10, 20);


// 3、定位
// 定位光标到指定位置，定位光标到位置10
$("#id").selection().to(10);

// 定位光标到指定位置，定位光标到文本开始
$("#id").selection().toStart();

// 定位光标到指定位置，定位光标到文本结束
$("#id").selection().toEnd();


// 4、增改
// 在当前光标位置前插入指定文本，并选中
$("#id").selection().before("insertVal");
// 在当前光标位置前插入指定文本，但不选中
$("#id").selection().before("insertVal", false);

// 在当前光标位置后插入指定文本，并选中
$("#id").selection().after("insertVal");
// 在当前光标位置后插入指定文本，但不选中
$("#id").selection().after("insertVal", false);

// 在当前文本开头插入指定文本，并选中
$("#id").selection().prepend("prependVal");
// 在当前文本开头插入指定文本，但不选中
$("#id").selection().prepend("prependVal", false);

// 在当前文本结尾插入指定文本，并选中
$("#id").selection().append("appendVal");
// 在当前文本结尾插入指定文本，但不选中
$("#id").selection().append("appendVal", false);

// 替换当前选中的文本，并选中
$("#id").selection().replace("replaceVal");
// 替换当前选中的文本，但不选中
$("#id").selection().replace("replaceVal", false);

// 移除当前选中的文本
$("#id").selection().remove();


// 5、删除
// 向前删除（退格）指定长度（默认0）的文本
$("#id").selection().backspace(length);

// 向后删除指定长度（默认0）的文本
$("#id").selection().delete(length);
