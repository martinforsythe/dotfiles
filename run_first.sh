#!/bin/sh
#
# Homebrew set-up
# Modified from on a script by Thomas Markovich
#
# Using Homebrew this installs some common packages that I use.

# install command line tools
xcode-select --install

# point to dotfiles location
export DOTFILES=$HOME/dotfiles

# Check for Homebrew
if test ! $(which brew)
then
  echo "  Installing Homebrew for you."

  # Install the correct homebrew for each OS type
  if test "$(uname)" = "Darwin"
  then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  elif test "$(expr substr $(uname -s) 1 5)" = "Linux"
  then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"
  fi

fi

cd $DOTFILES

brew tap Homebrew/bundle
brew bundle

pyenv install 2.7.14
pyenv install 3.6.3

# Install Inconsolata font
echo "Installing Inconsolata font"
curl https://github.com/google/fonts/blob/master/ofl/inconsolata/Inconsolata-Regular.ttf --output /Library/Fonts/Inconsolata-Regular.ttf
curl https://github.com/google/fonts/blob/master/ofl/inconsolata/Inconsolata-Bold.ttf --output /Library/Fonts/Inconsolata-Bold.ttf
