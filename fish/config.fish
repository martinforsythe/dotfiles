# Oh My Fish bobthefish theme configuration
# https://github.com/oh-my-fish/oh-my-fish/blob/master/docs/Themes.md#bobthefish
set -g theme_display_git yes
set -g theme_display_git_dirty yes
set -g theme_display_git_untracked no
set -g theme_display_git_ahead_verbose no
set -g theme_display_git_dirty_verbose no
set -g theme_display_git_master_branch no
set -g theme_git_worktree_support yes
set -g theme_display_k8s_context yes
set -g theme_display_docker_machine yes
set -g theme_display_virtualenv yes
set -g theme_display_vi no
set -g theme_display_date no
set -g theme_display_cmd_duration no
set -g theme_show_exit_status no
set -g theme_powerline_fonts yes
set -g theme_nerd_fonts yes
set -g default_user martin
set -g theme_newline_cursor no

# Set default editor to neovim
set -U EDITOR vim

# ALIASES
alias jpn 'jupyter notebook'
alias vim 'nvim'
alias gfa 'git fetch --all'
alias gs 'git status'
alias gb 'git branch --list'

# PATH
set PATH /usr/local/bin /usr/local/manual/bin $PATH
set PATH $PATH $HOME/gamalon/tycho
set PATH $PATH /usr/local/share/pypy3 /usr/local/share/pypy

