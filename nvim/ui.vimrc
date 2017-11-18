"-------------------------------------------------------------------------
"
" This vimrc file sets up UI settings and modifications
"
"-------------------------------------------------------------------------

" Search
set hlsearch                   " highlight matches

" Formatting
set nu                         " turn on line numbering
syntax on                      " enable syntax highlighting
set visualbell                 " visual bell
set noerrorbells               " no noise
set guifont=Inconsolata:h14    " set font to Inconsolata 14pt
set showmatch                  " show matching brackets

" Colorscheme
"colorscheme monokai-custom     " custom colorscheme
colorscheme molokai
hi Normal ctermbg=none         " fix colorscheme background transparency

