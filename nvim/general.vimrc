"----------------------------------------------------
"
" This vimrc file sets defaults for file encoding
" and handling of filetype specific autocommands
"
"----------------------------------------------------
" Set the default file encoding to UTF-8:
set encoding=utf-8

autocmd BufRead,BufNewFile requirements.txt setfiletype pip
autocmd BufRead,BufNewFile requirements.in setfiletype pip

augroup filetype_javascript
    autocmd!
    autocmd FileType javascript nnoremap <leader>y :0,$!eslint<Cr> " eslint with deoplete

    " spaces/tabs (ts=tabstop, sw=shiftwidth, sts=softtabstop)
    autocmd FileType javascript set ts=4 sw=4 sts=0 expandtab

    " show a ruler at 80 chars
    autocmd FileType javascript set colorcolumn=80

augroup END

set undofile   " Maintain undo history between sessions
set undodir=~/.nvim/undodir

" tabstop:     width of tab character
" shiftwidth:  ammount of whitespace to add in normal mode
" softtabstop: how far the cursor moves with the tab keystroke (enables untabbing a line)
" expandtab:   use spaces instead of tabs
set tabstop     =4
set shiftwidth  =4
set softtabstop =4
set expandtab

" Default to indent based folding and start with 10-levels open
set foldmethod=indent
set foldlevel=10

augroup filetype_restructuredtext
    autocmd!
    " turn off automatic folding for reStructuredText files
    " see https://neovim.io/doc/user/options.html#'foldenable'
    autocmd FileType rst set nofoldenable
augroup END

augroup filetype_clike
    autocmd!
    autocmd FileType c,cpp,objc,objcpp set ts=2 sw=2 sts=2 expandtab
    autocmd FileType c,cpp,objc,objcpp setlocal textwidth=120
    autocmd FileType c,cpp,objc,objcpp setlocal colorcolumn=120
augroup END

augroup filetype_python
    autocmd!
    autocmd FileType python nnoremap <leader>y :0,$!yapf<Cr>      " yapf with deoplete
    autocmd FileType python nnoremap <leader>y :0,$!isort<Cr>     " isort with deoplete
    autocmd FileType python nnoremap <leader>y :0,$!autopep8<Cr>  " autopep8 with deoplete
    autocmd CompleteDone * pclose " close preview window of deoplete
    " spaces/tabs (ts=tabstop, sw=shiftwidth, sts=softtabstop)
    autocmd FileType python set ts=4 sw=4 sts=4 expandtab

    autocmd FileType python setlocal textwidth=80

    " show a ruler at 80 chars
    autocmd FileType python set colorcolumn=80
    autocmd FileType python set colorcolumn=120

    " keep indentation level from previous line
    " autocmd FileType python set autoindent

augroup END

" text wrap at 100 characters for markdown
au BufRead,BufNewFile *.md setlocal textwidth=100
