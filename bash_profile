export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
PS1="\W:$ "

#ENV VARS
export DOTFILES=$HOME/dotfiles

#PATH
export PATH=/usr/local/manual/bin:$PATH
export PATH=$PATH:$HOME/gamalon/tycho
export PATH="$PATH:$HOME/.cargo/bin"
export PATH=$PATH:/usr/local/share/pypy3

## ALIASES
ssh_port_forward() { ssh "-L$1:localhost:$2 -fN $3"; }
alias jpn='jupyter notebook'
alias subl="/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl"
export DOCKER="$HOME/Library/Containers/com.docker.docker/Data/com.docker.driver.amd64-linux"
alias vim='nvim'

. $HOME/.bash_profile_venv


# ## Compiler flags for openblas to be made available
# export LDFLAGS="-L/usr/local/opt/openblas/lib"
# export CPPFLAGS="-I/usr/local/opt/openblas/include"
# export PKG_CONFIG_PATH="$PKG_CONFIG_PATH:/usr/local/opt/openblas/lib/pkgconfig"
## To use the bundled libc++ please add the following LDFLAGS:
## LLVM
#  LDFLAGS="-L/usr/local/opt/llvm/lib -Wl,-rpath,/usr/local/opt/llvm/lib"

## GO:
# A valid GOPATH is required to use the `go get` command.
# If $GOPATH is not specified, $HOME/go will be used by default:
#  https://golang.org/doc/code.html#GOPATH
#
# You may wish to add the GOROOT-based install location to your PATH:
#  export PATH=$PATH:/usr/local/opt/go/libexec/bin
