"----------------------------------------------------
"
" This vimrc file sets defaults for file encoding
" and handling of filetype specific autocommands
"
"----------------------------------------------------
" Set the default file encoding to UTF-8:
set encoding=utf-8

augroup filetype_javascript
    autocmd!
    autocmd FileType javascript nnoremap <leader>y :0,$!eslint<Cr> " eslint with deoplete

    " spaces/tabs (ts=tabstop, sw=shiftwidth, sts=softtabstop)
    autocmd FileType javascript set ts=4 sw=4 sts=0 expandtab

    " show a ruler at 80 chars
    autocmd FileType javascript set colorcolumn=80

augroup END


augroup filetype_python
    autocmd!
    autocmd FileType python nnoremap <leader>y :0,$!yapf<Cr>      " yapf with deoplete
    autocmd FileType python nnoremap <leader>y :0,$!isort<Cr>     " isort with deoplete
    autocmd FileType python nnoremap <leader>y :0,$!autopep8<Cr>  " autopep8 with deoplete
    autocmd CompleteDone * pclose " close preview window of deoplete
    " spaces/tabs (ts=tabstop, sw=shiftwidth, sts=softtabstop)
    autocmd FileType python set ts=4 sw=4 sts=4 expandtab

    " show a ruler at 80 chars
    autocmd FileType python set colorcolumn=80

    " keep indentation level from previous line
    autocmd FileType python set autoindent

augroup END
