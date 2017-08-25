" show a visual line under the cursor's current line
set cursorline

"turn on numbering
set nu

" show the matching part of the pair for [] {} and ()
set showmatch

" set font to Inconsolata 14pt
set guifont=Inconsolata:h14

"I don't like swap files
set noswapfile

"---------- VUNDLE PLUGIN STUFF ---------------------------
set nocompatible
filetype off

set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

" let Vundle manage Vundle
Plugin 'VundleVim/Vundle.vim'

" git interface
Plugin 'tpope/vim-fugitive'

" filesystem plugins
Plugin 'scrooloose/nerdtree'
Plugin 'jistr/vim-nerdtree-tabs'
" Plugin 'ctrlpvim/ctrlp.vim'  " fuzzy file paths

" python sytax checker
Plugin 'nvie/vim-flake8'
Plugin 'vim-scripts/Pydiction'
Plugin 'vim-scripts/indentpython.vim'
Plugin 'scrooloose/syntastic'

" auto-completion stuff
Plugin 'Valloric/YouCompleteMe'
" Plugin 'klen/python-mode'
" Plugin 'klen/rope-vim'
Plugin 'davidhalter/jedi-vim'
Plugin 'ervandew/supertab'

" code folding
"Plugin 'tmhedberg/SimpylFold'

" colorscheme (note, I acutally perfer a customized version)
Plugin 'sickill/vim-monokai'

call vundle#end()
"------------- END VUNDLE STUFF -------------------------


" enable filetype detection
filetype plugin indent on

syntax enable
colorscheme monokai-custom

" fix colorscheme adding additional background transparency
hi Normal ctermbg=none

" ignore files in NERDTree
let NERDTreeIgnore=['\.pyc$', '\~$']

"python with virtualenv support
py << EOF
import os.path
import sys
import vim
if 'VIRTUA_ENV' in os.environ:
  project_base_dir = os.environ['VIRTUAL_ENV']
  sys.path.insert(0, project_base_dir)
  activate_this = os.path.join(project_base_dir,'bin/activate_this.py')
  execfile(activate_this, dict(__file__=activate_this))
EOF

"it would be nice to set tag files by the active virtualenv here
":set tags=~/mytags "tags for ctags and taglist
"omnicomplete
autocmd FileType python set omnifunc=pythoncomplete#Complete

" --- plugins that I'm not sure that I like ---
" code folding:
" let g:SimpylFold_docstring_preview = 1
"
" YouCompleteMe autocomplete
let g:ycm_autoclose_preview_window_after_completion=1
" custom keys for YouCompleteMe plugin
" let mapleader key be space
"map <leader>g  :YcmCompleter GoToDefinitionElseDeclaration<CR>
"

"------------Start Python PEP 8 stuff----------------
" Number of spaces that a pre-existing tab is equal to.
au BufRead,BufNewFile *py,*pyw,*.c,*.h set tabstop=4

" spaces for indents
au BufRead,BufNewFile *.py,*pyw set shiftwidth=4
au BufRead,BufNewFile *.py,*.pyw set expandtab
au BufRead,BufNewFile *.py set softtabstop=4

" Use the below highlight group when displaying bad whitespace is desired.
highlight BadWhitespace ctermbg=red guibg=red

" Display tabs at the beginning of a line in Python mode as bad.
au BufRead,BufNewFile *.py,*.pyw match BadWhitespace /^\t\+/

" Make trailing whitespace be flagged as bad.
au BufRead,BufNewFile *.py,*.pyw,*.c,*.h match BadWhitespace /\s\+$/

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


"" Code Folding based on indentation:
"autocmd FileType python set foldmethod=indent
"" use space to open folds
"nnoremap <space> za 
"----------Stop python PEP 8 stuff--------------
