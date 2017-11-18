"------------------------------------------------------
"
" This vimrc file configures plugin-specific settings
"
"------------------------------------------------------

" which pythons should neovim use
let g:python2_host_prog = expand('~/.virtualenvs/neovim2/bin/python')
let g:python3_host_prog = expand('~/.virtualenvs/neovim3/bin/python')

"---------------------------------------------
"               Airline-Teme
" For configuration options see docs at:
" https://github.com/vim-airline/vim-airline-themes
"---------------------------------------------
let g:airline_theme = 'luna'

"---------------------------------------------
"                 Deoplete
" For configuration options see docs at:
" https://github.com/Shougo/deoplete.nvim
"---------------------------------------------
let g:deoplete#enable_at_startup=1
let g:deoplete#enable_smart_case = 1
autocmd CompleteDone * pclose " close preview window of deoplete

"---------------------------------------------
"               Python-Syntax
" For configuration instructions see:
" https://github.com/vim-python/python-syntax
"---------------------------------------------
let g:python_highlight_all = 1


"------------------------------------------
"             Deoplete Jedi
" For configuration instructions see:
" https://github.com/zchee/deoplete-jedi
"------------------------------------------
let g:deoplete#sources#jedi#server_timeout = 10
let g:deoplete#sources#jedi#show_docstring = 1


"------------------------------------------
"     Asynchronous Lint Engine (ALE)
" For configuration instructions see:
" https://github.com/w0rp/ale#installation
"------------------------------------------
" configure ALEFix
let g:ale_fixers = {
\   'python': ['autopep8', 'isort'],
\   'javascript': ['eslint'],
\}
let g:ale_sign_column_always = 1
let g:ale_sign_error = '>>'
let g:ale_sign_warning = '--'
let g:ale_fix_on_save = 1
