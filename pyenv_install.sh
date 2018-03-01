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

# install Python 2.7.14 if it is not already installed
if not_contains "$pyenv_versions" "2.7.14"; then
	echo "Python 2.7.14 not installed"
	pyenv install 2.7.14
fi

# install Python 3.6.4 if it is not already installed
if not_contains "$pyenv_versions" "3.6.4"; then
	echo "Python 3.6.4 not installed"
	pyenv install 3.6.4
fi
