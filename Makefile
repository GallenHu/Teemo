default:
	git config user.name "Gallen.Hu"
	git config user.email "gallenmbp@gmail.com"
	curl -OL https://ghproxy.com/https://raw.githubusercontent.com/Hinpc/static/master/.gitignore

nvm:
	node -v > .nvmrc

ec:
	curl -o .editorconfig -sSL https://ghproxy.com/https://raw.githubusercontent.com/Hinpc/static/master/configfile/editorconfig.conf
pre:
	curl -o .prettierrc -sSL https://ghproxy.com/https://raw.githubusercontent.com/Hinpc/static/master/configfile/prettierrc.json

docker:
	touch Dockerfile
	touch .dockerignore

md:
	touch README.md
