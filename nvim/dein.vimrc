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

  " easily delete/change/add ( [ and " etc
  call dein#add('tpope/vim-surround')

  " status line
  call dein#add('vim-airline/vim-airline')
  call dein#add('vim-airline/vim-airline-themes')

  " gutter and git hunks
  call dein#add('jreybert/vimagit')
  call dein#add('airblade/vim-gitgutter')
  call dein#add('mhinz/vim-signify')

  " autocompletion (only enable in insert mode)
  " We'll use ALE with the CCLS language server for C/C++ so no need for deoplete
  call dein#add('Shougo/deoplete.nvim', {'on_i': 1, 'lazy': 1, 'on_ft': ['python', 'rust']})

  " requirements.txt highlighting
  call dein#add('raimon49/requirements.txt.vim', {'lazy': 1, 'on_ft': ['pip']})

  " call dein#add('Shougo/neosnippet')
  " call dein#add('Shougo/neosnippet-snippets')
  " call dein#add('wokalski/autocomplete-flow', {'on_i': 1, 'lazy' : 1})

  " linting
  call dein#add('w0rp/ale')

  " local vimrc files
  call dein#add('MarcWeber/vim-addon-local-vimrc')

  " lazy load NerdTree on command
  call dein#add('scrooloose/nerdtree', {'on_cmd': 'NERDTreeToggle'})

  "---- python plugins ----
  call dein#add('vim-python/python-syntax', {'on_ft': 'python'})
  call dein#add('jmcantrell/vim-virtualenv', {'on_ft': 'python'})
  " call dein#add('zchee/deoplete-jedi', {'on_i': 1, 'on_ft': 'python'})
  call dein#add('editorconfig/editorconfig-vim', {'on_ft': 'python'})
  "-- only tested for python so far, but works in multiple languages --
  call dein#add('janko/vim-test', {'on_ft': 'python'})

  " transition between single and multi-line code
  call dein#add('AndrewRadev/splitjoin.vim', {'on_ft': 'python'})

  "---- code folding ----
  " not sure that I like SimplyFold - need to restore :zo, :zc etc
  " call dein#add('tmhedberg/SimpylFold', {'on_i': 1, 'on_ft': 'python'})
  " call dein#add('Konfekt/FastFold', {'on_ft': 'python'})
  " call dein#add('kalekundert/vim-coiled-snake', {'on_ft': 'python'})

  "----  C/C++/ObjC plugins ----
  call dein#add('Shougo/neoinclude.vim', {
    \ 'on_i': 1,
    \ 'on_ft': ['c', 'cpp', 'objc', 'objcpp'],
    \ })
  " C/C++ plugins
  " call dein#add('zchee/deoplete-clang', {
  "   \ 'on_ft': ['c', 'cpp', 'objc', 'objcpp'],
  "   \ })
  " call dein#add('autozimu/LanguageClient-neovim', {
  "   \ 'rev': 'next',
  "   \ 'build': 'bash install.sh',
  "   \ })

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
  " " This requires racer, which is currently only available
  " " on the nightly install of rustc
  " call dein#add('racer-rust/vim-racer', {'on_ft': 'rust'})
  call dein#add('rust-lang/rust.vim', {'on_ft': 'rust'})
  " call dein#add('sebastianmarkow/deoplete-rust', {
  "   \ 'on_i': 1,
  "   \ 'on_ft': 'rust',
  "   \ })

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
