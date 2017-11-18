"----------------------------------------------------
"
" This vimrc file sets up dein for plugin management
" and installs plugins
"
"----------------------------------------------------
if &compatible
  set nocompatible
endif

"----- dein runtime path -----
set runtimepath+=~/.config/nvim/dein/repos/github.com/Shougo/dein.vim

"----- Required -----
if dein#load_state(expand('~/.config/nvim/dein'))
  call dein#begin(expand('~/.config/nvim/dein'))

  "----- Let dein manage dein -----
  call dein#add(expand('~/.config/nvim/dein/repos/github.com/Shougo/dein.vim'))

  "------------------------------------------
  " Add or remove your plugins here:
  " {'on_i': 1} is lazy load on insert mode
  " {'on_ft' []} is lazy load on file type
  "------------------------------------------

  " status line
  call dein#add('vim-airline/vim-airline')
  call dein#add('vim-airline/vim-airline-themes')

  " gutter
  call dein#add('airblade/vim-gitgutter')

  " autocompletion
  call dein#add('Shougo/deoplete.nvim', {'on_i': 1}) 
  call dein#add('zchee/deoplete-jedi', {'on_i': 1}) 

  " linting
  call dein#add('w0rp/ale')

  " lazy load NerdTree on command
  call dein#add('scrooloose/nerdtree', {'on_cmd': 'NERDTreeToggle'})

  " python only plugins
  call dein#add('vim-python/python-syntax', {'on_ft': ['python']})
  call dein#add('jmcantrell/vim-virtualenv', {'on_ft': ['python']})

  "------------------------------------------
  call dein#end()
  call dein#save_state()
endif

"----- Required -----
filetype plugin indent on
syntax enable

"----- Check/install plugins on startup. -----
if dein#check_install()
  call dein#install()
endif
