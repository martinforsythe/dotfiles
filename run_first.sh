#!/bin/sh
#
# Homebrew set-up
# Based on a script from Thomas Markovich
#
# Using Homebrew this installs some common packages that I use.
# $DOTFILES is an environment variable that points to the dotfiles
# repository directory.

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

# command line tools
xcode-select --install

# casks
brew cask install iterm2
brew cask install google-chrome
brew cask install sublime-text
brew cask install atom
brew cask install gimp
brew cask install inkscape
brew cask install xquartz
brew cask install slack
brew cask install gitup
brew cask install mactex
brew cask install adobe-acrobat-reader
brew cask install dropbox

# Install Inconsolata font
echo "Installing Inconsolata font"
curl https://github.com/google/fonts/blob/master/ofl/inconsolata/Inconsolata-Regular.ttf --output /Library/Fonts/Inconsolata-Regular.ttf
curl https://github.com/google/fonts/blob/master/ofl/inconsolata/Inconsolata-Bold.ttf --output /Library/Fonts/Inconsolata-Bold.ttf

#git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
