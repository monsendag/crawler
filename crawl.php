#!/usr/local/bin/php.dSYM -qC
<?php

/**
 * Usage: ./crawl [-politeness <seconds>] [-maxpages <pages>] seed_url
 *
 */


$args = array_slice($_SERVER['argv'], 1);
$arguments = array();

foreach($args as $i => $arg) {
    if(in_array($arg, array('-politeness', '-maxpages')) && sizeof($args > $i+2)) {
        $arguments[substr($arg,1)] = intval($args[$i+1]);
        unset($args[$i], $args[$i+1]);
    }
}

function pln() {
    $args = func_get_args();

    call_user_func_array ("printf", $args);
    echo "\n";
}
/* gets the data from a URL */
function get_data($url) {
    $ch = curl_init();
    $timeout = 5;
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.1) Gecko/20061204 Firefox/2.0.0.1");
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}


require('lib/Crawler.php');

$url = array_pop($args);

Crawler::crawl($url, $arguments);