#!/bin/sh
#
# Homebrew set-up
# Modified from a script by Thomas Markovich
#
# Using Homebrew this installs some common packages that I use.

# point to dotfiles location
export DOTFILES=$HOME/dotfiles

# Check for Homebrew
if test ! $(which brew)
then
  echo "  Installing Homebrew for you."

  # Install the correct homebrew for each OS type
  if test "$(uname)" = "Darwin"
  then
    # install command line tools if not already installed
    if ! [ -d "$(xcode-select -p)" ]; then
        xcode-select --install
    fi
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  elif test "$(expr substr $(uname -s) 1 5)" = "Linux"
  then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"
  fi

fi

cd $DOTFILES

brew tap homebrew/bundle
brew update

# brew bundle doesn't allow install options so we install vim manually
brew install vim --with-override-system-vi --with-python3 --with-luajit

brew bundle --file=Brewfile
brew bundle --file=Caskfile

. make_symlinks.sh

. rust_install.sh

. pyenv_install.sh

. font_install.sh