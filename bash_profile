export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
PS1="\W:$ "

#ENV VARS
export DOTFILES=$HOME/dotfiles

#PATH
export PATH=/usr/local/manual/bin:$PATH
export PATH=$PATH:$HOME/gamalon/tycho
export PATH="$PATH:$HOME/.cargo/bin"
export PATH=$PATH:/usr/local/share/pypy3:/usr/local/share/pypy

## ALIASES
alias server="python -m SimpleHTTPServer"
ssh_port_forward() { ssh "-L$1:localhost:$2 -fN $3"; }
alias jpn='jupyter notebook'
alias subl="/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl"
export DOCKER="$HOME/Library/Containers/com.docker.docker/Data/com.docker.driver.amd64-linux"
alias vim='nvim'

. $HOME/.bash_profile_venv
