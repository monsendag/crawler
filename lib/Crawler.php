<?php


class Crawler {


    public static function crawl($url, $parameters) {
        pln("Crawling $url with the following settings: ");
        foreach($parameters as $p => $v) {
            pln("$p: $v");
        }


        //$url = parse_url($url);

        //$url['scheme'] = array_key_exists('scheme', $url) ? $url['scheme'] : 'http';


        echo get_data($url);


    }
}