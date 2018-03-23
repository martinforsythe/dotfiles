#!/usr/bin/env bash
curl -L https://get.oh-my.fish | fish

# install some fish shell plugins
fish ./fish/install_omf_plugins.fsh

# copy fish configuration files
mkdir -p $HOME/.config/omf
mkdir -p $HOME/.config/fish
yes | cp -rf ./fish/before.init.fish $HOME/.config/omf/before.init.fish
yes | cp -rf ./fish/config.fish $HOME/.config/fish/config.fish
