# Based on the install script provided by robbyrussell:
#
# https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh
#
# Modified to my liking
if [ ! -n "$ZSH" ]; then
    ZSH=$HOME/.oh-my-zsh
fi
# Exit if Oh My Zsh is already installed
if [ -d "$ZSH" ]; then
    echo "Oh My Zsh is already installed"
    exit
fi
# Otherwise proceed
git clone --depth=1 https://github.com/robbyrussell/oh-my-zsh.git $ZSH

# Symlink zshrc
dotfiles=$HOME/dotfiles
ln -s $dotfiles/zsh/zshrc $HOME/.zshrc

# Install theme and customizations
mkdir -p $ZSH/custom/themes
git clone https://github.com/bhilburn/powerlevel9k.git \
	$ZSH/custom/themes/powerlevel9k
ln -s $dotfiles/zsh/powerlevel9k.customizations \
	$ZSH/custom/themes/powerlevel9k.customizations

