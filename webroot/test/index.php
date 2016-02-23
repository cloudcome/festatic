<?php
	$time=date("Y-m-d H:i:s",time());
	$arr=array("time"=>$time);
	if(isset($_GET["json"])){
		$str=json_encode($arr);
		echo $str;
	}else if(isset($_GET["jsonp"])){
		$package=$_GET["jsonp"];
		$str=json_encode($arr);
		echo "{$package}({$str});";
	}else if(isset($_GET["var"])){
		$package=$_GET["var"];
		$str=json_encode($arr);
		echo "var {$package}={$str};";
	}
	exit();