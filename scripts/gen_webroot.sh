cp template/script-with-vars.php dist
cp template/config.json dist
cd dist

# in macOS
# brew install gnu-sed

# delete lines
gsed -i '12,25d' index.html

# append content to line 11
gsed -i '11 r script-with-vars.php' index.html

cp index.html index.php

rm index.html
rm script-with-vars.php
