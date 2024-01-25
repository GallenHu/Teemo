gi:
	curl -OL https://ghproxy.com/https://raw.githubusercontent.com/Hinpc/static/master/.gitignore

nv:
	node -v > .node-version

ec:
	curl -o .editorconfig -sSL https://raw.fastgit.org/Hinpc/static/master/configfile/editorconfig.conf

pre:
	curl -o .prettierrc -sSL https://raw.fastgit.org/Hinpc/static/master/configfile/prettierrc.json

md:
	touch README.md
