#!/bin/bash
############################
# make_symlinks.sh
# This script creates symlinks from the home directory to any desired dotfiles
# located in the directory pointed to by the $DOTFILES environment variable
#
# Based off of a script from Thomas Markovich
############################

########## Variables

dotfiles=$HOME/dotfiles     # dotfiles directory
backup=$HOME/.dotfiles_bak   # old dotfiles backup directory
# list of files/folders to symlink in $HOME
files="bash_profile bash_profile_venv gitconfig vimrc" #functions
dotdirs="vim atom"

echo "Dotfiles:" $dotfiles
echo "Dotfiles backup:" $backup

# create dotfiles_bak in $HOME
echo -n "Creating $backup for backup of any existing dotfiles in ~ ..."
mkdir -p $backup

# change to the dotfiles directory
echo -n "Changing to the $dotfiles directory ..."
cd $dotfiles

# move any existing dotfiles in $HOME to dotfiles_bak directory, then
# create symlinks from the $HOME to any files in the $DOTFILES directory
# specified in $files
echo "Moving any existing dotfiles from ~ to $backup"
for file in $files; do
    mv $HOME/.$file $backup
    echo "Creating symlink to $file in home directory."
    ln -s $dotfiles/$file $HOME/.$file
done

echo "Moving any existing dot directories from ~ to $backup"
for dir in $dotdirs; do
    mv $HOME/.$dir $backup
    echo "Creating symlink to $dir in home directory."
    ln -s $dotfiles/$dir $HOME/.$dir
done

# update Vundle to setup vim
git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim

