#!/bin/sh
#
# Pyenv setup

# pyenv_versions=$(pyenv versions)
pyenv_versions=$(ls ~/.pyenv/versions/)

# test if substring is in string
not_contains() {
    string="$1"
    substring="$2"
    if test "${string#*$substring}" != "$string"
    then
        return 1
    else
        return 0
    fi
}

# install Python 2.7.15 if it is not already installed
if not_contains "$pyenv_versions" "2.7.15"; then
	echo "Python 2.7.15 not installed"
	pyenv install 2.7.15
fi

# install Python 3.6.6 if it is not already installed
if not_contains "$pyenv_versions" "3.6.6"; then
	echo "Python 3.6.6 not installed"
	pyenv install 3.6.6
fi
