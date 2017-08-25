export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
PS1="\W:$ "

#PATH
export PATH=/usr/local/manual/bin:$PATH

## ALIASES
alias server="python -m SimpleHTTPServer"
alias jpn='jupyter notebook'

## VIRTUALENV
export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/gamalon
export VIRTUALENVWRAPPER_PYTHON=$HOME/.pyenv/shims/python
export VIRTUALENVWRAPPER_VIRTUALENV_ARGS='--no-site-packages'
source /usr/local/bin/virtualenvwrapper.sh
## PYENV
export PYENV_ROOT="$HOME/.pyenv"
if [[ -d $PYENV_ROOT ]];then
	    PATH="$PYENV_ROOT/bin:$PATH"
	        # initialize pyenv
		    eval "$(pyenv init -)"
	    fi

	    ## only run pip if there is a virtualenv currently activated
	    export PIP_REQUIRE_VIRTUALENV=true
	    ## enable global pip
	    gpip(){
		      PIP_REQUIRE_VIRTUALENV="" pip "$@"
	      }

	      ## FUNCTION FOR REMOVING PYTHON FILES
	      pyclean () {
		              find . -type f -name "*.py[co]" -delete
			              find . -type d -name "__pycache__" -delete
			      }
