# Teemo
v5: React nav site.

## Dev
```
yarn start
```

## Build
```
yarn build
```

## 用法
1. 创建 github gist 作为配置文件
文件内容[示例](./config-example.json)

2. 在网站中添加`localStorage`配置
- `username`: 配置文件中的 username
- `ghtoken`: 用于请求 API 的 GitHub token
- `gistid`: gist id

```js
window.localStorage.setItem('username', 'hinpc_home');
window.localStorage.setItem('ghtoken', 'xxx');
window.localStorage.setItem('gistid', 'xxx');
```

3. 刷新页面
