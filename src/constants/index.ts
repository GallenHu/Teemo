export default Object.freeze({
  DEFAULT_ICON_BG_COLOR: '#FF6900',
  FIREBASE_CONFIG: {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_FIREBASE_APPID,
  },
  DB_COLLECTION_PATH: 'configurations',
  SYNC_CONFIRM_TIPS: {
    toRemote: '使用本地配置覆写到云端？',
    toLocal: '使用云端配置覆写本地配置？',
  },
});
