<script>
  window.addEventListener('error', function (e) {
    if (e.target.nodeName === 'IMG') {
      e.target.src = 'https://i.loli.net/2020/04/13/JHzefbqgFWTCIDi.png';
    }
  }, true);
</script>
<script>
  <?php
  $str = file_get_contents('./config.json');
  $json = json_decode($str, true);
  $cookie_user = $_COOKIE['user'];
  foreach($json['user'] as $key => $value) {
    // Use $field and $value here
    if ($cookie_user === $key) {
      $user_sites = $value;
    }
  }
  ?>

  window.APP_CONFIG={
    user: "<?=$cookie_user?>",
    user_sites: <?php echo json_encode($user_sites);?>,
    ver: 0.1
  }
</script>
