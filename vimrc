" ----- START KEY REMAPPINGS -----
" during insert, kj escapes, `^ is so that the cursor doesn't move
inoremap kj <Esc>`^
" during insert, lkj escapes and saves
inoremap lkj <Esc>`^:w<CR>
" during insert, lkj escapes and saves and QUITS
inoremap ;lkj <Esc>:wq<CR>

" force arrow keys off
nnoremap <up> <nop>
nnoremap <down> <nop>
nnoremap <left> <nop>
nnoremap <right> <nop>
"inoremap <up> <nop>
"inoremap <down> <nop>
"inoremap <left> <nop>
"inoremap <right> <nop>

" remap F1 to ESC
inoremap <F1> <ESC>
nnoremap <F1> <ESC>
vnoremap <F1> <ESC>

" strip trailing whitespace
nnoremap <leader>W :%s/\s\+$//<cr>:let @/=''<CR>

" sort CSS properties
"nnoremap <leader>S ?{<CR>jV/^\s*\}?$<CR>k:sort<CR>:noh<CR>
" ----- END KEY REMAPPINGS -----

" vim command completions
set wildmenu

" force utf-8 encoding
set encoding=utf-8

" visual bell
set visualbell

" show a visual line under the cursor's current line
set cursorline

" turn on line numbering
set nu

" turn off absolute line numbering in favor of relative
" set relativenumber
" likewise make j/k work by relative number
nnoremap j gj
nnoremap k gk

" show the matching part of the pair for [] {} and ()
set showmatch

" set font to Inconsolata 14pt
set guifont=Inconsolata:h14

" I don't like swap files
set noswapfile

" Turn off vi compatibility
set nocompatible

" Avoid modelines security exploits
set modelines=0

" show a ruler at 85 chars
set colorcolumn=85

"----------------- Modify search/move ---------------------
nnoremap / /\v
vnoremap / /\v
set ignorecase
set smartcase
set gdefault
set incsearch
set showmatch
set hlsearch
" nnoremap <leader><space> :noh<cr>
nnoremap <tab> %
vnoremap <tab> %

if filereadable(expand("~/.vimrc.bundles"))
  source ~/.vimrc.bundles
endif

" enable filetype detection
filetype plugin indent on

" --- plugins that I'm not sure that I like ---
" code folding:
" let g:SimpylFold_docstring_preview = 1
"
" YouCompleteMe autocomplete
" let g:ycm_autoclose_preview_window_after_completion=1
"
" custom keys for YouCompleteMe plugin
" let mapleader key be space
"map <leader>g  :YcmCompleter GoToDefinitionElseDeclaration<CR>
"

"------------- Color scheme ---------------------------
syntax enable
colorscheme monokai-custom

" fix colorscheme adding additional background transparency
hi Normal ctermbg=none

" ignore files in NERDTree
"let NERDTreeIgnore=['\.pyc$', '\~$']

"------------- Python with virtualenv support ---------
"py << EOF
"import os.path
"import sys
"import vim
"if 'VIRTUA_ENV' in os.environ:
"  project_base_dir = os.environ['VIRTUAL_ENV']
"  sys.path.insert(0, project_base_dir)
"  activate_this = os.path.join(project_base_dir,'bin/activate_this.py')
"  execfile(activate_this, dict(__file__=activate_this))
"EOF
"
"it would be nice to set tag files by the active virtualenv here
":set tags=~/mytags "tags for ctags and taglist
"omnicomplete
"autocmd FileType python set omnifunc=pythoncomplete#Complete


"------------Start Python PEP 8 stuff----------------
" Number of spaces that a pre-existing tab is equal to.
au BufRead,BufNewFile *py,*pyw set tabstop=4
au BufRead,BufNewFile *.c,*.h set tabstop=4

" spaces for indents
au BufRead,BufNewFile *.py,*pyw set shiftwidth=4
au BufRead,BufNewFile *.py,*.pyw set expandtab
au BufRead,BufNewFile *.py set softtabstop=4

" Use the below highlight group when displaying bad whitespace is desired.
highlight BadWhitespace ctermbg=red guibg=red

" Display tabs at the beginning of a line in Python mode as bad.
au BufRead,BufNewFile *.py,*.pyw match BadWhitespace /^\t\+/

" Make trailing whitespace be flagged as bad.
au BufRead,BufNewFile *.py,*.pyw match BadWhitespace /\s\+$/
au BufRead,BufNewFile *.c,*.h match BadWhitespace /\s\+$/

" Wrap text after a certain number of characters
au BufRead,BufNewFile *.py,*.pyw, set textwidth=100

" Use UNIX (\n) line endings.
au BufNewFile *.py,*.pyw,*.c,*.h set fileformat=unix

" Set the default file encoding to UTF-8:
set encoding=utf-8

" For full syntax highlighting:
let python_highlight_all=1
syntax on

" Keep indentation level from previous line:
autocmd FileType python set autoindent

" make backspaces more powerfull
set backspace=indent,eol,start

" flake8 checks pep8, pyflakes, and circular complexity so it is enough
let b:ale_linters = {
\   'python': ['flake8'],
\   'javascript': ['eslint'],
\}

" Specify which tools ALE should use to fix linting errors
let g:ale_fixers = {
\   'javascript': ['eslint'],
\   'python': ['autopep8'],
\}

"" Code Folding based on indentation:
"autocmd FileType python set foldmethod=indent
"" use space to open folds
"nnoremap <space> za 
"----------Stop python PEP 8 stuff--------------

"---------- Start Rust stuff -------------------
" automatically run :RustFmt when you save a buffer
au BufNewFile *.rs let g:rustfmt_autosave = 1

" expand tabs to 4 spaces
au BufNewFile *.rs set tabstop=4
au BufNewFile *.rs set shiftwidth=4
au BufNewFile *.rs set softtabstop=4
au BufNewFile *.rs set expandtab
"---------- End Rust stuff ---------------------
