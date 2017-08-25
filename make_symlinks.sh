#!/bin/bash
############################
# make_symlinks.sh
# This script creates symlinks from the home directory to any desired dotfiles
# located in the directory pointed to by the $DOTFILES environment variable
#
# Based off of a script from Thomas Markovich
############################

########## Variables

dir=$DOTFILES           # dotfiles directory
olddir=$HOME/dotfiles_bak   # old dotfiles backup directory
# list of files/folders to symlink in $HOME
files="bashrc bash_profile functions gitconfig vimrc"

echo $dir
echo $olddir

# create dotfiles_bak in $HOME
echo -n "Creating $olddir for backup of any existing dotfiles in ~ ..."
mkdir -p $olddir
echo "done"

# change to the dotfiles directory
echo -n "Changing to the $dir directory ..."
cd $dir
echo "done"

# move any existing dotfiles in $HOME to dotfiles_bak directory, then
# create symlinks from the $HOME to any files in the $DOTFILES directory
# specified in $files
for file in $files; do
    echo "Moving any existing dotfiles from ~ to $olddir"
    mv $HOME/.$file $HOME/dotfiles_old/
    echo "Creating symlink to $file in home directory."
    ln -s $dir/$file $HOME/.$file
done

for dir in $dirs; do
    ln -s $PWD/$dir $HOME/.$dir
done
