<?php
if(isset($_FILES)){
	$files = $_FILES['file']['name'];
	$code = count($files);
	echo json_encode(array(
		'code' => $code,
		'msg' => $code>0 ? $files: '未选择上传文件',
	));
	exit();
}


/*


多文件：
Array
(
    [file] => Array
        (
            [name] => Array
                (
                    [0] => 2014-04-13_172351.png
                    [1] => 2014-04-11_193949.png
                    [2] => 2014-04-09_234534.png
                    [3] => 2014-04-09_233519.png
                    [4] => 2014-04-09_233424.png
                    [5] => 2014-04-09_232958.png
                )

            [type] => Array
                (
                    [0] => image/png
                    [1] => image/png
                    [2] => image/png
                    [3] => image/png
                    [4] => image/png
                    [5] => image/png
                )

            [tmp_name] => Array
                (
                    [0] => D:\wamp\tmp\php79AE.tmp
                    [1] => D:\wamp\tmp\php79AF.tmp
                    [2] => D:\wamp\tmp\php79B0.tmp
                    [3] => D:\wamp\tmp\php79E0.tmp
                    [4] => D:\wamp\tmp\php79E1.tmp
                    [5] => D:\wamp\tmp\php79E2.tmp
                )

            [error] => Array
                (
                    [0] => 0
                    [1] => 0
                    [2] => 0
                    [3] => 0
                    [4] => 0
                    [5] => 0
                )

            [size] => Array
                (
                    [0] => 10929
                    [1] => 170996
                    [2] => 6225
                    [3] => 14228
                    [4] => 4824
                    [5] => 10903
                )

        )
)


单文件：
Array
(
    [file] => Array
        (
            [name] => 
            [type] => 
            [tmp_name] => 
            [error] => 4
            [size] => 0
        )
) 


*/