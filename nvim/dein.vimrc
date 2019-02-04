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

  " local vimrc files
  call dein#add('MarcWeber/vim-addon-local-vimrc')

  " status line
  call dein#add('vim-airline/vim-airline')
  call dein#add('vim-airline/vim-airline-themes')

  " gutter
  call dein#add('airblade/vim-gitgutter')

  " autocompletion (only enable in insert mode)
  " We'll use ALE with the CCLS language server for C/C++ so no need for deoplete
  call dein#add('Shougo/deoplete.nvim', {'on_i': 1, 'lazy': 1, 'on_ft': ['python', 'rust']})

  " call dein#add('Shougo/neosnippet')
  " call dein#add('Shougo/neosnippet-snippets')
  " call dein#add('wokalski/autocomplete-flow', {'on_i': 1, 'lazy' : 1})

  " linting
  call dein#add('w0rp/ale')

  " lazy load NerdTree on command
  call dein#add('scrooloose/nerdtree', {'on_cmd': 'NERDTreeToggle'})

  "---- python plugins ----
  call dein#add('vim-python/python-syntax', {'on_ft': 'python'})
  call dein#add('jmcantrell/vim-virtualenv', {'on_ft': 'python'})
  call dein#add('zchee/deoplete-jedi', {'on_i': 1, 'on_ft': 'python'})

  " transition between single and multi-line code
  call dein#add('AndrewRadev/splitjoin.vim', {'on_ft': 'python'})

  " not sure that I like SimplyFold
  "call dein#add('tmhedberg/SimpylFold', {'on_i': 1, 'on_ft': 'python'})

  "----  C/C++/ObjC plugins ----
  call dein#add('Shougo/neoinclude.vim', {
    \ 'on_i': 1,
    \ 'on_ft': ['c', 'cpp', 'objc', 'objcpp'],
    \ })

  " -- COC --
  " call dein#add('neoclide/coc.nvim', {
  "   \ 'on_ft': ['c', 'cpp', 'objc', 'objcpp'],
  "   \ })
  " call dein#add('jsfaint/coc-neoinclude', {
  "  \ 'on_ft': ['c', 'cpp', 'objc', 'objcpp'],
  "  \ })

  " call dein#add ('neomake/neomake', {
  "   \ 'on_ft': ['c', 'cpp', 'objc', 'objcpp'],
  "   \ })
  "
  " call dein#add('autozimu/LanguageClient-neovim', {
  "   \ 'rev': 'next',
  "   \ 'build': 'bash install.sh',
  "   \ })
  "
  " " requires a compile_commands.json to be configured
  " " can use https://github.com/nickdiego/compiledb
  " call dein#add('Shougo/deoplete-clangx', {
  "  \ 'on_i': 1,
  "  \ 'on_ft': ['c', 'cpp', 'objc', 'objcpp'],
  "   \ 'lazy' : 1,
  "  \ })
  " " faster than deoplete-clang
  " call dein#add('tweekmonster/deoplete-clang2', {
  "  \ 'on_i': 1,
  "  \ 'on_ft': ['c', 'cpp', 'objc', 'objcpp'],
  "   \ 'lazy' : 1,
  "  \ })
  " call dein#add('zchee/deoplete-clang', {
  "   \ 'on_i': 1,
  "   \ 'on_ft': ['c', 'cpp', 'objc', 'objcpp'],
  "   \ 'lazy' : 1,
  "   \ })
  " call dein#add('Rip-Rip/clang_complete', {
  "   \ 'on_ft': ['c', 'cpp', 'objc', 'objcpp'],
  "   \ 'lazy' : 1,
  "   \ })

  "---- rust plugins ----
  call dein#add('racer-rust/vim-racer', {'on_ft': 'rust'})
  call dein#add('rust-lang/rust.vim', {'on_ft': 'rust'})
  call dein#add('sebastianmarkow/deoplete-rust', {
    \ 'on_i': 1,
    \ 'on_ft': 'rust',
    \ })

  "---- HTML plugins ----
  call dein#add('Valloric/MatchTagAlways', {'on_ft': 'html'})

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
  call dein#recache_runtimepath()
endif

" To update dein:
" :call dein#update()
