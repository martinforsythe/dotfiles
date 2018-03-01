#!/bin/bash
############################
# backup.sh
# makes a backup of the current Homebrew bundle
############################
cd $DOTFILES
brew bundle dump --force
git add .
git commit -m "auto backup"
git push origin master
