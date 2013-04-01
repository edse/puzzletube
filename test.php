<?php
exec("wget -O ttt.mp4 http://o-o---preferred---sn-xhcg5uxa-bpbe---v1---lscache3.c.youtube.com/videoplayback?upn=2V5Y65FXE0U&sparams=cp,gcr,id,ip,ipbits,itag,ratebypass,source,upn,expire&fexp=906371,923009,927104,922401,920704,912806,927201,913546,913556,925109,919003,912706,900816,911112&ms=au&expire=1350488532&itag=18&ipbits=8&gcr=br&sver=3&ratebypass=yes&mt=1350467536&ip=189.121.79.24&mv=m&source=youtube&key=yt1&cp=U0hURVRTVl9ITENONF9MTVpGOmp6d0dLUEp2dmFD&id=fe5ad83eeca86a51&type=video/mp4;+codecs=%22avc1.42001E,+mp4a.40.2%22&fallback_host=tc.v1.cache3.c.youtube.com&sig=19A860E98C9EB671F90DF75755195F560F211B3B.36CF7025FD16E2FD40192058F9A208EFC2F84178&quality=medium");
die("1");

// Create a stream
$opts = array(
  'http'=>array(
    'method'=>"GET",
    'header'=>"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n" .
              "Accept-language: en-US,en;q=0.8\r\n" .
              "Host: www.youtube.com\r\n" .
              "User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4\r\n"
  )
);
$context = stream_context_create($opts);
// Open the file using the HTTP headers set above
//$current = file_get_contents('http://o-o---preferred---sn-xhcg5uxa-bpbe---v1---lscache3.c.youtube.com/videoplayback?upn=yRX3wAHhBbs&sparams=cp,gcr,id,ip,ipbits,itag,ratebypass,source,upn,expire&fexp=909918,927104,922401,920704,912806,927201,913546,913556,925109,919003,912706,900816,911112&ms=au&expire=1350488532&itag=18&ipbits=8&gcr=br&sver=3&ratebypass=yes&mt=1350465616&ip=189.121.79.24&mv=m&source=youtube&key=yt1&cp=U0hURVRTVl9ITENONF9MTVpGOjRPbXBlUGRfMFEw&id=fe5ad83eeca86a51&type=video/mp4;+codecs=%22avc1.42001E,+mp4a.40.2%22&fallback_host=tc.v1.cache3.c.youtube.com&signature=0927FD3FCBABA6BBACA471177CC0D19BDE1C352A.C10E7951B24BE9339B8B4AD8B3D62D541075CC8A&quality=medium', false, $context);
//$current = file_get_contents('http://o-o---preferred---sn-xhcg5uxa-bpbe---v1---lscache3.c.youtube.com/videoplayback?upn=yRX3wAHhBbs&sparams=cp%2Cgcr%2Cid%2Cip%2Cipbits%2Citag%2Cratebypass%2Csource%2Cupn%2Cexpire&fexp=909918%2C927104%2C922401%2C920704%2C912806%2C927201%2C913546%2C913556%2C925109%2C919003%2C912706%2C900816%2C911112&ms=au&expire=1350488532&itag=18&ipbits=8&gcr=br&sver=3&ratebypass=yes&mt=1350465616&ip=189.121.79.24&mv=m&source=youtube&key=yt1&cp=U0hURVRTVl9ITENONF9MTVpGOjRPbXBlUGRfMFEw&id=fe5ad83eeca86a51&type=video/mp4;+codecs=%22avc1.42001E%2C+mp4a.40.2%22&fallback_host=tc.v1.cache3.c.youtube.com&sig=0927FD3FCBABA6BBACA471177CC0D19BDE1C352A.C10E7951B24BE9339B8B4AD8B3D62D541075CC8A&quality=medium');
//file_put_contents('test-final.mp4', $current);
//die('fim!');
 
$youtube_id = "_lrYPuyoalE";
$page = file_get_contents("http://www.youtube.com/watch?v=".$youtube_id);

$i = explode('<meta property="og:image" content="', $page);
$ii = explode('">', $i[1]);
//die($ii[0]);
$image = $ii[0];

$aux = explode('"url_encoded_fmt_stream_map": "', $page);
$aux2 = explode('"', $aux[1]);
$aux3 = explode('"', $aux[1]);

//die($aux2[0]);

$content = str_replace("http", "\nhttp", $aux2[0]);

//echo $content;
//die();

$urls = explode("\n", $content);
foreach($urls as $u){

  $u = urldecode($u);
  $u = urldecode($u);
  
  //echo "\n".$u."\n";
  
  $u = str_replace("\\u0026", "&", $u);
  $u = str_replace("sig=", "signature=", $u);
  //$u = str_replace("%5C", "\\", $u);
  
  $pos = strpos($u, 'default.jpg');
  if($pos !== false) {
    die("\n\n>>>>> image");
    $ii = explode('/default.jpg', $u);
    echo "\n>>>".count($ii);
    if(count($ii) > 1){
      $image = $ii[0]."/default.jpg";
      echo "\n\n".$image;
    }
  }

  $pos = strpos($u, 'codecs');
  if($pos !== false || $image!="") {

    $uu = explode('itag=', $u);

    $aux = explode('codecs="', $u);
    $aux2 = explode('"',$aux[1]);
    $codec = $aux2[0];

    $uuu = explode('quality=', $u);
    $aux = explode(',', $uuu[1]);
    $quality = $aux[0];

    if($codec == "avc1.64001F, mp4a.40.2" && $quality == "hd720"){
      $video1 = $uu[0];
      $video1 = $u;
      //die("\n\n".$codec." - ".$video1."\n\n");
    }
    elseif($codec == "avc1.42001E, mp4a.40.2" && $quality == "medium"){
      $video2 = $uu[0];
      $video2 = $u;
      //die($codec." - ".$video2);
    }

    //echo "v1: $video1\n";
    //echo "v2: $video2\n";
    //echo "img: $image\n";

    /*
    if(($video1 != "" || $video2 != "") && $image != ""){
      echo "-------------------------------------------------------------------------\n";
      echo "v1: $video1\n";
      echo "v2: $video2\n";
      echo "img: $image\n";
      die();

      echo "\n\n----------------| getting files (".$youtube_id.") |--------|Video Title|------------------------------------------------\n";
      echo "v1:\n".exec("wget --user-agent=\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4\" -O ".$youtube_id."-1.mp4 \"".$video1."\"");
      echo "v2:\n".exec("wget --user-agent=\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4\" -O ".$youtube_id."-2.mp4 \"".$video2."\"");
      echo "img:\n".exec("wget --user-agent=\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4\" -O ".$youtube_id.".jpg \"".$image."\"");
    }
    */

    //echo "\n\n----------------| getting files (".$youtube_id.") |--------|Video Title|------------------------------------------------\n";
    //echo "-------------------------------------------------------------------------\n";
        
    if($video1 != ""){
      echo "v1: $video1\n";
      echo "v1:\n".exec("wget --user-agent=\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4\" -O ".$youtube_id."-1.mp4 \"".$video1."\"");
    }
    if($video2 != ""){
      echo "v2: $video2\n";
      echo "v2:\n".exec("wget --user-agent=\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4\" -O ".$youtube_id."-2.mp4 \"".$video2."\"");
    }
    if($image != ""){
      echo "img: $image\n";
      echo "img:\n".exec("wget --user-agent=\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4\" -O ".$youtube_id.".jpg \"".$image."\"");
    }
    
  }
}


die();


//wget --user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3" -O test2.mp4 http://o-o---preferred---sn-xhcg5uxa-bg0e---v23---lscache8.c.youtube.com/videoplayback?upn=xnz49_hd1Ik&sparams=cp,id,ip,ipbits,itag,ratebypass,source,upn,expire&fexp=927104,922401,920704,912806,927201,913546,913556,925109,919003,920201,912706,900816,911112&key=yt1&expire=1350484974&itag=18&ipbits=8&sver=3&ratebypass=yes&mt=1350464116&ip=189.121.79.24&mv=m&source=youtube&ms=au&cp=U0hURVRTUl9MTkNONF9MTVZKOlNWQlpXSXdHRlZF&id=a0de9a8f042a3eb8&signature=0D23220E54796F7CB064BB2ED10988C09AAD2FD5.1A7AD6749C54327A2E712B57B1FA0750442993D7&fallback_host=tc.v23.cache8.c.youtube.com&quality=medium
