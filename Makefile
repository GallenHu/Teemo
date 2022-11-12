default:
	git config user.name "Gallen.Hu"
	git config user.email "gallenmbp@gmail.com"
	curl -OL https://ghproxy.com/https://raw.githubusercontent.com/Hinpc/static/master/.gitignore

nvm:
	node -v > .nvmrc

ec:
	curl -o .editorconfig -sSL https://ghproxy.com/https://raw.githubusercontent.com/Hinpc/static/master/configfile/editorconfig.conf

docker:
	touch Dockerfile
	touch .dockerignore

md:
	touch README.md
