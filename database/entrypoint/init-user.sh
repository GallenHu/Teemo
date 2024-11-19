#!/bin/bash
# 这个脚本会在 MongoDB 容器启动时自动运行，并且会创建一个数据库用户。

# 检查必要的环境变量是否已设置
if [ -z "$MONGO_INITDB_ROOT_USERNAME" ] || [ -z "$MONGO_INITDB_ROOT_PASSWORD" ] || [ -z "$MONGO_DB_NAME" ] || [ -z "$MONGO_USER_NAME" ] || [ -z "$MONGO_USER_PASSWORD" ]; then
    echo "Error: 必要的环境变量未设置."
    exit 1
fi

# 使用 mongo shell 命令行工具连接到 MongoDB
echo "正在初始化 MongoDB 用户..."
mongo --host localhost --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD <<EOF
use $MONGO_DB_NAME;
db.createUser(
  {
    user: "$MONGO_USER_NAME",
    pwd: "$MONGO_USER_PASSWORD",
    roles: [ { role: "readWrite", db: "$MONGO_DB_NAME" } ]
  }
);
EOF

echo "MongoDB 用户初始化完成."
