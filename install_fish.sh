#!/usr/bin/env bash
curl -L https://get.oh-my.fish | fish

# install some fish shell plugins
fish ./fish/install_omf_plugins.fsh

dotfiles=$HOME/dotfiles
# symbolic links to fish configuration files
mkdir -p $HOME/.config/omf
mkdir -p $HOME/.config/fish
ln -s $dotfiles/fish/before.init.fish $HOME/.config/omf/before.init.fish
ln -s $dotfiles/fish/config.fish $HOME/.config/fish/config.fish
