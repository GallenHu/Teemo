docker run --name teemo -d -p 3002:3000 \
  -v /home/data/teemo/.env:/app/.env \
  -v /home/data/teemo/database:/app/database \
  hvanke/teemo:latest
