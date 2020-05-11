cp template/script-with-vars.php dist
cd dist

# delete line 11~24
sed -i '' '11,24d' index.html

# append content to line 10
sed -i '' '10 r script-with-vars.php' index.html
