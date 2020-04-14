<!DOCTYPE html>
<html>
<head>
<title>hello</title>
<?php
$str = file_get_contents('./config.json');

$json = json_decode($str, true);

$cookie_user = $_COOKIE['user'];

foreach ($json['user'] as $key => $value) {
    // Use $field and $value here
    if ($cookie_user === $key)
    {
        $user_sites = $value;
    }
}
?>
<script> // document.cookie = "user=name; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=" + location.host; </script>
<script>
window.APP_CONFIG={
    user: "<?=$cookie_user?>",
    user_sites: <?php echo json_encode($user_sites);?>,
    ver: 0.1
}

</script>
</head>

<body>

<div>balabala...</div>
<script>
    console.log(window.APP_CONFIG);
</script>

</body>
</html>
