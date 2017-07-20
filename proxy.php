<?php 

$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => $_POST['BASE_URL'] . '?' . $_SERVER['QUERY_STRING'],
));

$response = curl_exec($curl);

curl_close($curl);

echo $response;

?>