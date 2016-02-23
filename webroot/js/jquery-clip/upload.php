<?php
if(isset($_FILES)){
	$id = date('Ymdhis');
	$maxsize = 1024*50;
	if($_FILES['upload']['error']===0 && $_FILES['upload']['size']<=$maxsize){
		$ret = move_uploaded_file($_FILES['upload']['tmp_name'], './upload/'.$id.'.png');
		if($ret===true){
			echo json_encode(array(
				'code'=>1,
				'msg'=>'upload/'.$id.'.png',
			));
		}else{
			echo json_encode(array(
				'code'=>0,
				'msg'=>'上传失败！',
			));
		}
	}else if($_FILES['upload']['size']>$maxsize){
		echo json_encode(array(
			'code'=>-1,
			'msg'=>'裁剪图片体积过大！',
		));
	}else{
		echo json_encode(array(
			'code'=>-1,
			'msg'=>'上传错误！',
		));
	}
	exit();
}