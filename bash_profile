export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
PS1="\W:$ "

#ENV VARS
export DOTFILES=$HOME/dotfiles

#PATH
export PATH=/usr/local/manual/bin:$PATH

## ALIASES
alias server="python -m SimpleHTTPServer"
alias jpn='jupyter notebook'
alias subl="/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl"

. .bash_profile_venv
