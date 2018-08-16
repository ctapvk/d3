
<?php
$dir    = $_SERVER['DOCUMENT_ROOT']. '';
$filesXsd = explode("\n",  shell_exec("find $dir/* -type f -name *.png") ) ;
$arr = [];

foreach ($filesXsd as $k => $v){
    $path =str_replace($dir,'',$v);
//    $path = iconv(mb_detect_encoding($path), "cp1251", $path);
    $href= preg_replace("/\d*\.png/",'',$path) ;

    $arr[]="<a href='$href'>  <img src='$path'> </a> <br>\n";
}

$pics= implode($arr);
$str = <<< EOT
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
$pics
</body>
</html>
EOT;

file_put_contents($dir.'/index.html',$str);