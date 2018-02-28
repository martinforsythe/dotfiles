"-------------------------------------------------------------------------
"
" This vimrc file sets up UI settings and modifications
"
"-------------------------------------------------------------------------

" Search
set hlsearch                   " highlight matches

" Formatting
set nu                         " turn on line numbering
set cursorline                 " highlight the current line
syntax on                      " enable syntax highlighting
set visualbell                 " visual bell
set noerrorbells               " no noise
set guifont=Inconsolata:h14    " set font to Inconsolata 14pt
set showmatch                  " show matching brackets

" Colorscheme
"colorscheme monokai-custom     " custom colorscheme
colorscheme molokai
let g:molokai_original = 1
let g:rehash256 = 1
set background=dark
hi Normal ctermbg=none         " fix colorscheme background transparency

