<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>海风导航</title>
  <link rel="shortcut icon" href="https://i.loli.net/2020/06/04/ZmDsY2GqMwHIC9n.png">
  <meta name=keywords content="网址导航, 海风导航, 简洁, 视频, 开发, 音乐, 创意灵感">
  <meta name="description" content="简洁无广告，可自定义的网址导航，分享优秀站点">
  <link rel="stylesheet" href="styles/style-fdcc4920b4.css">
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
</head>

<body>
  <div class="main">
    <div class="main-inner is-nav-shrink">
      <div class="nav">
        <div class="logo">
          <h1>海风导航</h1>
        </div>
        <ul>
          <li>
            <a href="#usual">
              <span>常用</span>
            </a>
          </li>
          <li>
            <a href="#dev">
              <span>设计开发</span>
            </a>
          </li>
        </ul>
        <div class="user-list hide">
          <span>user:</span>
        </div>
        <button class="nav-toggle">
          <span>
            <img width="14px"
              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg2NzQ3ODY4NjcyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI4NjgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMjU4LjEwNDk5ODc3IDQ3NS40MTA2OTQyMkw3MTQuOTkwOTkyMzEgMTguMzk4NDAxNDNhNDguMjQ2MTUwODMgNDguMjQ2MTUwODMgMCAxIDEgNjguMzI3NjYzMTkgNjguMzI3NjY0MjRMMzYwLjU5NjQ5MzU1IDUwOS41MTEzNzY3MWw0MjMuNzMyNTUyODQgNDIyLjcyMjE2MTk0YTQ4LjMwOTI5OTkzIDQ4LjMwOTI5OTkzIDAgMSAxLTY4LjMyNzY2NDI0IDY4LjQ1Mzk2MTM4TDI1OC4xNjgxNDc4OCA1NDMuNjEyMDU5MTlhNDguMjQ2MTUwODMgNDguMjQ2MTUwODMgMCAwIDEgMC02OC4zMjc2NjQyMnoiIHAtaWQ9IjI4NjkiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48L3N2Zz4=">
          </span>
        </button>
      </div>
      <div class="main-content">
        <section class="main-header">
          <span></span>
          <span><?=$cookie_user?></span>
        </section>
        <section class="search" id="search">
          <form class="search-form">
            <div class="searcher-logo baidu">
              <i class="baidu"></i>
              <i class="google"></i>
              <i class="dogedoge"></i>
            </div>
            <div class="search-input">
              <input type="text" class="search-input-el" id="searchInputEl" placeholder="Baidu 搜索" spellcheck="false"
                autocomplete="off">
              <button id="searchSubmitEl">
                <img width="20px"
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg2NTA5NjYxMjkxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyNjQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODg3LjQ0OTYgOTU4LjM2MTZsLTE0MS41NjgtMTQxLjU2OGE0OS44MTc2IDQ5LjgxNzYgMCAwIDEtNS40MjcyLTYuNCA0MjMuMjcwNCA0MjMuMjcwNCAwIDAgMS0yNjMuNzMxMiA5MS44NTI4IDQyNS44ODE2IDQyNS44ODE2IDAgMCAxLTQyNS40NzItNDI1LjQyMDggNDI1LjkzMjggNDI1LjkzMjggMCAwIDEgNDI1LjQ3Mi00MjUuNDIwOCA0MjUuODgxNiA0MjUuODgxNiAwIDAgMSA0MjUuMzY5NiA0MjUuNDIwOCA0MjMuMzcyOCA0MjMuMzcyOCAwIDAgMS05MS44NTI4IDI2My43ODI0IDUwLjI3ODQgNTAuMjc4NCAwIDAgMSA2LjQgNS40MjcybDE0MS41NjggMTQxLjU2OGE1MC4wNzM2IDUwLjA3MzYgMCAwIDEgMCA3MC43NTg0IDQ5LjkyIDQ5LjkyIDAgMCAxLTM1LjM3OTIgMTQuNjQzMiA0OS44Njg4IDQ5Ljg2ODggMCAwIDEtMzUuMzc5Mi0xNC42NDMyek0xNTEuMzk4NCA0NzYuODI1NmEzMjUuNjgzMiAzMjUuNjgzMiAwIDAgMCAzMjUuMzI0OCAzMjUuMzI0OCAzMjUuNjgzMiAzMjUuNjgzMiAwIDAgMCAzMjUuMjczNi0zMjUuMzI0OCAzMjUuNjgzMiAzMjUuNjgzMiAwIDAgMC0zMjUuMjczNi0zMjUuMzI0OCAzMjUuNjgzMiAzMjUuNjgzMiAwIDAgMC0zMjUuNDI3MiAzMjUuMTJ6IiBwLWlkPSIxMjY1IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+" />
              </button>
            </div>
            <div class="search-engine">
              <span class="engine-choose baidu">
                <span style="color:#2100E0">Baidu</span>
              </span>
              <span class="engine-choose google">
                <label for="type-google"><span style="color:#3B83FA">G</span><span style="color:#F3442C">o</span><span
                    style="color:#FFC300">o</span><span style="color:#4696F8">g</span><span
                    style="color:#2CAB4E">l</span><span style="color:#F54231">e</span></label>
              </span>
              <span class="engine-choose dogedoge">
                <span style="color: #000;">Dogedoge</span>
              </span>
            </div>
          </form>
        </section>

        <section class="sites">
          <div class="sites-section">
            <h2 class="category" id="category_usual">
              <span>常用</span>
            </h2>
            <ul>
              <li>
                <a href="https://mail.163.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://i.loli.net/2020/04/13/F3qdjxPXp5I1ewv.png">
                  <span>
                    <span>163网易免费邮</span>
                    <p>网易163免费邮箱</p>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://www.douban.com" target="_blank" rel="noopener noreferrer">
                  <img src="https://i.loli.net/2019/12/28/wyWUQgNckJEZ6Il.png">
                  <span>
                    <span>豆瓣</span>
                    <p>提供图书、电影、音乐唱片的推荐、评论和价格比较，以及城市独特的文化生活</p>
                  </span>
                </a>
              </li>
              <li>
                <a href="http://www.bejson.com/" target="_blank" rel="noopener noreferrer">
                  <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg2OTE3MDY0NjMzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjYwMjIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMjMxLjY5NSAzMmw5NC41MyAwLjM5VjEwNS45NWgtNzMuNTZ2MjIwLjY2NWMwIDQ1LjE4LTU2LjU5NSA3My41Ni0xMDAuNTMgNzMuNTYgNDMuOTM1IDAgMTAwLjUzIDI4LjM4IDEwMC41MyA3My41NnYyMjAuNjhoNzMuNTZ2NzMuNTQ1bC05NC41MyAwLjQzNWMtNDIuNTU1LTExLjA1NS01Mi41NzUtMjkuMDI1LTUyLjU3NS03My45OTV2LTE0Ny4xMmM0LjYwNS03Ny41OC03My41Ni03My41Ni03My41Ni03My41NkgzMlYzMjYuNmg3My41NmM0My45MiAwIDczLjU2LTI4LjM4IDczLjU2LTczLjU2VjEwNS45NWMwLTQ1LjE4IDguNjEtNzMuOTUgNTIuNTc1LTczLjk1bTU1Ni44NiAwYzQzLjkzNSAwIDUyLjU5IDI4Ljc3IDUyLjU5IDczLjk1djE0Ny4xMmM5LjE5NSA4NC40MzUgNzMuNTQ1IDczLjU2IDczLjU0NSA3My41Nmg3My41NnYxNDcuMTJoLTczLjU2cy04Mi43NTUtMTMuMjE1LTczLjU0NSA3My41NnYxNDcuMTJjMi4yOTUgNTguNDctMjEuNTU1IDczLjk5NS01Mi41OSA3My45OTVsLTk0LjUzLTAuNDM1di03My41NDVoNzMuNTQ1VjQ3My43MzVjMC0yMS42OSAyOS4zODUtMzQuMjYgNDQuMjk1LTQ5LjYwNWE3OC40NSA3OC40NSAwIDAgMSA1Ni4yMzUtMjMuOTU1IDc4LjQ1IDc4LjQ1IDAgMCAxLTU2LjIzNS0yMy45NTVjLTE0LjkxLTE1LjMzLTQ0LjI5NS0yNy45LTQ0LjI5NS00OS42MDVWMTA1Ljk1aC03My41NDVWMzIuMzlMNzg4LjU1NSAzMiIgZmlsbD0iIzJjMmMyYyIgcC1pZD0iNjAyMyI+PC9wYXRoPjxwYXRoIGQ9Ik0zMjYuMjI1IDU0Ny4zMWg3My41NnY3My41NDVoLTczLjU2di03My41NDV6TTQ3My4zNDUgNTQ3LjMxaDczLjU2djczLjU0NWgtNzMuNTZ2LTczLjU0NXpNNjIwLjQ1IDU0Ny4zMWg3My41NnY3My41NDVINjIwLjQ1di03My41NDV6IiBmaWxsPSIjMmMyYzJjIiBwLWlkPSI2MDI0Ij48L3BhdGg+PC9zdmc+">
                  <span>
                    <span>BeJSON</span>
                    <p>JSON格式化</p>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://mo.fish/" target="_blank" rel="noopener noreferrer">
                  <img src="https://i.loli.net/2020/04/13/Iys396Wq7V4lQLr.png">
                  <span>
                    <span>鱼塘热榜</span>
                    <p>鱼塘热榜</p>
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <div class="sites-section">
            <h2 class="category" id="category_dev">
              <span>设计开发</span>
            </h2>
            <ul>
              <li>
                <a href="https://www.iconfont.cn/" target="_blank" rel="noopener noreferrer">
                  <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaW5kZXgtbG9nIGluZGV4LWxvZy0wIiB2ZXJzaW9uPSIxLjEiIGlkPSLlm77lsYJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIxMDBweCIgaGVpZ2h0PSIxMDBweCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAyNCAxMDI0IiB4bWw6c3BhY2U9InByZXNlcnZlIiBwLWlkPSIzNDk3Ij48ZyBwLWlkPSIzNDk4Ij48cGF0aCBmaWxsPSIjRkYwMDAwIiBkPSJNNTQ2LjM2OCwxNDEuMzg1Yy01LjA5OS01LjI1LTQuMDYyLTEzLjM0My0yLjgyMy0yNi42ODFjMS42NjUtMTcuOTYyLTMzLjg2OCw4LjIwOC01NS42NTUsMjUuODMKICAgICAgICAgICAgQzMxMS41MzMsMTUyLjk0NywxNzIuMzE0LDI5OS45NCwxNzIuMzE0LDQ3OS40NThjMCwxODcuNjU2LDE1Mi4xMjQsMzM5Ljc4LDMzOS43OCwzMzkuNzhzMzM5Ljc4LTE1Mi4xMjQsMzM5Ljc4LTMzOS43OAogICAgICAgICAgICBDODUxLjg3OCwzMDMuMzcxLDcxNy45MjksMTU4LjU2OSw1NDYuMzY4LDE0MS4zODV6IiBwLWlkPSIzNDk5Ij48L3BhdGg+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTgyMC41Nyw1MDAuOTk3Yy0yLjA5OS00NC4wNjYtMTEuOTM3LTg0LjE5NS0yOS41MTItMTIwLjM5M2MtMTcuNTcxLTM2LjE5OS00MC4zOTItNjcuMTUxLTY4LjQ1OS05Mi44NTIKICAgICAgICAgICAgYy0yOC4wNjgtMjUuNzA2LTYwLjE5Ny00NS42NDItOTYuMzk1LTU5LjgwNmMtMzMuNDExLTEzLjA3Ni02OC4zODYtMjAuMDk5LTEwNC45MjUtMjEuMTA2CiAgICAgICAgICAgIGMtNi4yMTEsNS45MTYtMTEuODg3LDE1Ljc1OSwxLjM3NCwyNi41NDJjMjEuMzU3LDE3LjM2OS0xMC40NDMsMjguNDU5LTI3LjIyNCwyMy45NGMxNy42MDYsMi41NTUsNDguNzktNi42MjUsMTguNjgyLTI0Ljk3NAogICAgICAgICAgICBjLTEzLjM1LTguMjQzLTkuOTA0LTE4Ljk3Ni01LjcyNy0yNS42MDVjLTM3LjUsMC40NTMtNzMuNzY4LDcuNzY3LTEwOC44MDksMjEuOTg5Yy0zNi4xOTksMTQuNjktNjguMzI4LDM1LjE0NS05Ni4zOTUsNjEuMzc4CiAgICAgICAgICAgIGMtMjguMDY4LDI2LjIyOC01MS4wMTYsNTcuMzEyLTY4Ljg1NCw5My4yNDdzLTI4LjA2OCw3NS4xNS0zMC42ODksMTE3LjY0MWMtMi4wOTksMzYuMTk5LDEuNDQ0LDY5Ljc3MiwxMC42MjUsMTAwLjcyNAogICAgICAgICAgICBjOS4xODQsMzAuOTUyLDIyLjQyNiw1OC43NTYsMzkuNzQxLDgzLjQxM2MxNy4zMTEsMjQuNjU2LDM4LjE2NSw0NS43Nyw2Mi41NTksNjMuMzQ1czUwLjc1NywzMS4wODQsNzkuMDg0LDQwLjUyMwogICAgICAgICAgICBjNS4yNDYsMS41NzYsMTEuNDA3LDQuMjAxLDE4LjQ5Miw3Ljg2OGM3LjA4MiwzLjY3NCwxMy45MDQsOC4wMDMsMjAuNDU5LDEyLjk4NmM2LjU1OSw0Ljk4MywxMi43MjMsMTAuMjMsMTguNDk2LDE1LjczNQogICAgICAgICAgICBjNS43NjksNS41MSwxMC4yMywxMC42MjUsMTMuMzc4LDE1LjM0NGM3LjM0MSwxMi4wNjUsMTMuMTE0LDIyLjk1MywxNy4zMTEsMzIuNjZjNC4xOTMsOS43MDMsNy44NjgsMTguMDk3LDExLjAxNiwyNS4xODMKICAgICAgICAgICAgYzMuMTQ4LDcuMDgyLDYuMDMyLDEyLjU4OCw4LjY1OCwxNi41MjVjMi42MjEsMy45MzQsNi4wMjksNS44OTcsMTAuMjMsNS44OTdjMy42NzQsMCw3LjA4Mi0yLjIzLDEwLjIzLTYuNjg3CiAgICAgICAgICAgIGMzLjE0OC00LjQ2LDYuMjk2LTEwLjQ4OSw5LjQ0NC0xOC4xMDFjMy4xNDgtNy42MDQsNi44MTgtMTYuMTMsMTEuMDE2LTI1LjU3YzQuMTkzLTkuNDQ0LDkuNDQtMTguODg3LDE1LjczNi0yOC4zMzEKICAgICAgICAgICAgYzcuMzQ1LTExLjAxNiwxNy40NDMtMjEuNzcyLDMwLjI5NC0zMi4yNjFjMTIuODUxLTEwLjQ5NywyNC43ODgtMTcuODM4LDM1LjgwNC0yMi4wMzVjMjguMzI3LTEwLjQ5Nyw1NC44MTktMjQuMjY1LDc5LjQ3NS00MS4zMTcKICAgICAgICAgICAgYzI0LjY1Ni0xNy4wNDgsNDUuNzc0LTM3LjUwNyw2My4zNDUtNjEuMzc0YzE3LjU3NS0yMy44NywzMS4wODQtNTEuMTUyLDQwLjUyNy04MS44NDFDODE4Ljk5NCw1NzMsODIyLjY2NCw1MzguNzcyLDgyMC41Nyw1MDAuOTk3CiAgICAgICAgICAgIHogTTM2NC4yOTksNTk1LjYwNGMtMy4zNDEsMS40MTctNy4xOSwyLjUxNy0xMS41NSwzLjMwM3MtOS4wNDUsMS4xODEtMTQuMDU1LDEuMTgxcy05LjY5NS0wLjM5MS0xNC4wNTUtMS4xODEKICAgICAgICAgICAgYy00LjM2LTAuNzg2LTguMjA4LTEuODktMTEuNTUtMy4zMDNjLTMuMzQxLTEuNDEzLTUuOTM2LTMuMDQ3LTcuNzktNC44OTRjMjUuMTA5LDQuMDUsNDIuOTA4LDMuNjA1LDY2Ljc5NCwwCiAgICAgICAgICAgIEMzNzAuMjM1LDU5Mi41NTcsMzY3LjYzNyw1OTQuMTkxLDM2NC4yOTksNTk1LjYwNHogTTQzMy40MTMsNTI4LjYxNmMtNS4yNDYsMTEuMDc0LTEyLjQ2LDIwLjg1LTIxLjY0LDI5LjMyNgogICAgICAgICAgICBjLTkuMTg0LDguNDc5LTE5LjkzNiwxNS4wNzctMzIuMjY1LDE5Ljc4NWMtMTIuMzI0LDQuNzEyLTI1LjU3LDcuMDctMzkuNzM4LDcuMDdjLTE0LjE2NywwLTI3LjQwOS0yLjM1NC0zOS43NDEtNy4wNwogICAgICAgICAgICBjLTEyLjMyNC00LjcxMi0yMy4yMTItMTEuMzA2LTMyLjY1Ni0xOS43ODVjLTkuNDQ0LTguNDgtMTYuNzg5LTE4LjI1Mi0yMi4wMzUtMjkuMzI2Yy01LjI0Ni0xMS4wNy03Ljg2OC0yMi45NjQtNy44NjgtMzUuNjg0CiAgICAgICAgICAgIHMyLjYyMS0yNC42MTQsNy44NjgtMzUuNjg3YzUuMjQ2LTExLjA3NCwxMi41OTItMjAuNzMsMjIuMDM1LTI4Ljk3NGM5LjQ0NC04LjI0MywyMC4zMjgtMTQuODQxLDMyLjY1Ni0xOS43ODUKICAgICAgICAgICAgYzEyLjMyOC00Ljk0OCwyNS41NzQtNy40MTksMzkuNzQxLTcuNDE5YzE0LjE2NCwwLDI3LjQwOSwyLjQ3NCwzOS43MzgsNy40MTljMTIuMzI4LDQuOTQ0LDIzLjA4NCwxMS41NDIsMzIuMjY1LDE5Ljc4NQogICAgICAgICAgICBjOS4xNzYsOC4yNDMsMTYuMzk0LDE3LjksMjEuNjQsMjguOTc0YzUuMjQ2LDExLjA3NCw3Ljg2OCwyMi45NjgsNy44NjgsMzUuNjg3QzQ0MS4yOCw1MDUuNjUxLDQzOC42NTksNTE3LjU0Niw0MzMuNDEzLDUyOC42MTZ6CiAgICAgICAgICAgICBNNTExLjcyMiw2NDkuNzMzYy0wLjczNiw1LjE2OS0xLjQ3NSwxMC43OTktMi4yMTUsMTYuODg5Yy0wLjczNiw2LjA5MS0zLjUwOCwxMC4yNDUtOC4zMDUsMTIuNDYKICAgICAgICAgICAgYy0yLjIxNSwxLjEwNy00Ljg5NCwxLjY2MS04LjAzLDEuNjYxYy0zLjE0LDAtNi4wOTEtMC41NTQtOC44NjMtMS42NjFjLTIuNzY5LTEuMTExLTUuMDc2LTIuOTU0LTYuOTIzLTUuNTM3CiAgICAgICAgICAgIGMtMS44NDctMi41ODYtMi43NjktNS45MDktMi43NjktOS45N2MwLTQuNDMsMC45MjUtOC45NTIsMi43NjktMTMuNTY3YzEuODQ3LTQuNjE1LDQuMTU1LTguODYzLDYuOTIzLTEyLjczOQogICAgICAgICAgICBjMi43NjktMy44NzYsNS45MDUtNy4xMDUsOS40MTctOS42OTFjMy41MDgtMi41ODMsNi45MTktNC4yNDQsMTAuMjQ1LTQuOTgzYzIuNTgzLTAuMzY4LDQuNDI5LDAuMzcyLDUuNTM3LDIuMjE1CiAgICAgICAgICAgIGMxLjExMSwxLjg0NywxLjk0LDQuMTU1LDIuNDkzLDYuOTE5YzAuNTU0LDIuNzY4LDAuNzM5LDUuODE2LDAuNTU0LDkuMTM4QzUxMi4zNjksNjQ0LjE5Niw1MTIuMDksNjQ3LjE0Nyw1MTEuNzIyLDY0OS43MzN6CiAgICAgICAgICAgICBNNTU1LjE5Miw2NzMuNTQ2Yy0yLjAyOSwyLjU4My00LjQyOSw0LjQyOS03LjE5OCw1LjUzN2MtMi43NjksMS4xMDctNS42MywxLjY2MS04LjU4NCwxLjY2MWMtMi45NTEsMC01LjUzNy0wLjU1NC03Ljc1Mi0xLjY2MQogICAgICAgICAgICBjLTQuODAxLTIuMjE1LTcuNzUyLTYuMzY5LTguODU5LTEyLjQ2Yy0xLjExMS02LjA5MS0xLjg0Ny0xMS43Mi0yLjIxNS0xNi44ODljLTAuMzcyLTIuNTgzLTAuNTU0LTUuNTM3LTAuNTU0LTguODYzCiAgICAgICAgICAgIGMwLTMuMzIyLDAuMTg2LTYuMzY1LDAuNTU0LTkuMTM4YzAuMzcyLTIuNzY4LDEuMi01LjA3NiwyLjQ5LTYuOTE5YzEuMjkzLTEuODQ3LDMuMjMzLTIuNTg2LDUuODE2LTIuMjE1CiAgICAgICAgICAgIGMzLjMyNiwwLjc0LDYuNzM3LDIuNDAxLDEwLjI0NSw0Ljk4M2MzLjUwOCwyLjU4Niw2LjY0NCw1LjgxNiw5LjQxMyw5LjY5MWMyLjc2OCwzLjg3Niw1LjA3Niw4LjEyMyw2LjkyMywxMi43MzkKICAgICAgICAgICAgYzEuODQ3LDQuNjExLDIuNzY4LDkuMTM4LDIuNzY4LDEzLjU2N0M1NTguMjM2LDY2Ny42MzcsNTU3LjIyNSw2NzAuOTU5LDU1NS4xOTIsNjczLjU0NnogTTcyMy40MTIsNTk1LjYwNAogICAgICAgICAgICBjLTMuMzQxLDEuNDE3LTcuMTksMi41MTctMTEuNTUsMy4zMDNjLTQuMzYsMC43ODYtOS4wNDUsMS4xODEtMTQuMDU1LDEuMTgxYy01LjAxLDAtOS42OTUtMC4zOTEtMTQuMDU1LTEuMTgxCiAgICAgICAgICAgIGMtNC4zNi0wLjc4Ni04LjIwOC0xLjg5LTExLjU1LTMuMzAzYy0zLjM0MS0xLjQxNy01LjkzNi0zLjA0Ny03Ljc5LTQuODk0YzI1LjEwOSw0LjA1LDQyLjkwOCwzLjYwNSw2Ni43OTQsMAogICAgICAgICAgICBDNzI5LjM0Nyw1OTIuNTU3LDcyNi43NDksNTk0LjE5MSw3MjMuNDEyLDU5NS42MDR6IE03ODUuMTU3LDUyOC42MTZjLTUuMjUsMTEuMDc0LTEyLjU5MiwyMC44NS0yMi4wMzEsMjkuMzI2CiAgICAgICAgICAgIGMtOS40NDQsOC40NzktMjAuMzI4LDE1LjA3Ny0zMi42NiwxOS43ODVjLTEyLjMyNCw0LjcxMi0yNS41Nyw3LjA3LTM5LjczNCw3LjA3cy0yNy40MDktMi4zNTQtMzkuNzQxLTcuMDcKICAgICAgICAgICAgYy0xMi4zMjQtNC43MTItMjMuMjEyLTExLjMwNi0zMi42NTYtMTkuNzg1Yy05LjQ0NC04LjQ4LTE2Ljc4NS0xOC4yNTItMjIuMDMxLTI5LjMyNmMtNS4yNDYtMTEuMDctNy44NjgtMjIuOTY0LTcuODY4LTM1LjY4NAogICAgICAgICAgICBzMi42MjEtMjQuNjE0LDcuODY4LTM1LjY4N2M1LjI0Ni0xMS4wNzQsMTIuNTg4LTIwLjg1LDIyLjAzMS0yOS4zMjZjOS40NDQtOC40NzksMjAuMzI4LTE1LjA3NywzMi42NTYtMTkuNzg1CiAgICAgICAgICAgIGMxMi4zMjgtNC43MTIsMjUuNTc0LTcuMDY2LDM5Ljc0MS03LjA2NnMyNy40MDksMi4zNTQsMzkuNzM0LDcuMDY2YzEyLjMyOCw0LjcxMiwyMy4yMTYsMTEuMzA2LDMyLjY2LDE5Ljc4NQogICAgICAgICAgICBjOS40NCw4LjQ4LDE2Ljc4NSwxOC4yNTIsMjIuMDMxLDI5LjMyNmM1LjI0NiwxMS4wNzQsNy44NjgsMjIuOTY4LDcuODY4LDM1LjY4N0M3OTMuMDI1LDUwNS42NTEsNzkwLjQwNCw1MTcuNTQ2LDc4NS4xNTcsNTI4LjYxNnoiIHAtaWQ9IjM1MDAiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guNzc4MTA2OS4xOTk4OTEwNDE5LmkyIj48L3BhdGg+PC9nPjwvc3ZnPg==">
                  <span>
                    <span>Iconfont</span>
                    <p>图标库 - 阿里巴巴</p>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://shimo.im/" target="_blank" rel="noopener noreferrer">
                  <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg2OTE2MTc3MDEwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjUyMDciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTExLjk5OTk4MyA4OTguNzg0NDRjLTIxOC45OTA2OTkgMC0zOTYuNTE3MzYtMTc3LjUyNjY2LTM5Ni41MTczNi0zOTYuNTE3MzYgMC0yMTguOTkwNjk5IDE3Ny41MjY2Ni0zOTYuNTE3MzYgMzk2LjUxNzM2LTM5Ni41MTczNnMzOTYuNTE3MzYgMTc3LjUyNjY2IDM5Ni41MTczNiAzOTYuNTE3MzZDOTA4LjUxNzM0MyA3MjEuMjU3NzggNzMwLjk5MDY4MiA4OTguNzg0NDQgNTExLjk5OTk4MyA4OTguNzg0NDR6TTY2Mi4zOTY4MjggNDkxLjg5NDM4MWMtMTA1LjQyODYxNC0xMDguMzk1MTk3LTI3NC40MjI4NTMtMTkzLjA3NzE5NS0yNzQuNDIyODUzLTE5My4wNzcxOTUtODQuODQwMTE5LTUwLjYyODk0Mi00Ni45Nzc1NzcgMjYuNDAzNjc3LTE4LjU1OTY4OCA2NC4zMTk3MzggMjUuMDkwMDYyIDIzLjQ4ODE4IDEwNC40MTQyMTEgMjI3LjgzNjkyOSAxMTEuNTg0MzY0IDI4Ni4yNjg1MDUgMTIuOTg0MTE5IDU0LjgzMjUxMyA1Mi4wMzAxMzIgODkuMjgzMzAzIDk3LjY3NTg0OCA2Ni4wNTI5ODEgNDcuOTM2MDMtMjQuMzk1NTQ4IDg4LjM3MzUwMi05Ni41Mzg1OTggODguMzczNTAyLTk2LjUzODU5OFM3MTguMjEyMTIgNTUyLjg2NjgzMSA2NjIuMzk2ODI4IDQ5MS44OTQzODF6IiBwLWlkPSI1MjA4IiBmaWxsPSIjNDE0NjRCIj48L3BhdGg+PC9zdmc+">
                  <span>
                    <span>石墨文档</span>
                    <p>石墨文档</p>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://outlook.live.com" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.hinpc.com/img/picgo/20191218202943_outlook.svg">
                  <span>
                    <span>Outlook</span>
                    <p>Outlook邮箱</p>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://www.ip125.com" target="_blank" rel="noopener noreferrer">
                  <img src="https://i.loli.net/2019/12/19/NWbFPMi2lvUk4a3.png">
                  <span>
                    <span>我的IP</span>
                    <p>查IP</p>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>

    <div class="back-top" style="display: none;cursor: pointer;"></div>
  </div>

  <script src="https://libs.baidu.com/jquery/1.10.2/jquery.min.js"></script>
  <script src="lib/baidusug.js"></script>
  <script src="scripts/main-d630d82a32.js"></script>
</body>

</html>
