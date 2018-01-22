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


"---------------------------------------------
"             Deoplete Jedi
" For configuration instructions see:
" https://github.com/zchee/deoplete-jedi
"---------------------------------------------
let g:deoplete#sources#jedi#server_timeout = 10
let g:deoplete#sources#jedi#show_docstring = 1


"---------------------------------------------
"     Asynchronous Lint Engine (ALE)
" For configuration instructions see:
" https://github.com/w0rp/ale#installation
"---------------------------------------------
" By default ALE will run all available tools for all supported languages.
" For all languages unspecified in the dictionary, all possible linters
" will be run, just as when the dictionary is not defined.
"
" flake8 checks pep8, pyflakes, and circular complexity so it is enough
let b:ale_linters = {
\   'python': ['flake8'],
\   'javascript': ['eslint'],
\   'jsx': ['stylelint', 'eslint'],
\}

" Specify which tools ALE should use to fix linting errors
let g:ale_fixers = {
\   'python': ['autopep8', 'isort'],
\   'javascript': ['eslint'],
\}

" Do not lint or fix minified js and css files.
let g:ale_pattern_options = {
\   '\.min\.js$': {'ale_linters': [], 'ale_fixers': []},
\   '\.min\.css$': {'ale_linters': [], 'ale_fixers': []},
\}

let g:ale_linter_aliases = {'jsx': 'css'}
let g:ale_sign_column_always = 1  " Always show the ALE sign column
let g:ale_sign_error = '>>'       " Error sign in the gutter
let g:ale_sign_warning = '--'     " Warning sign in the gutter
let g:ale_fix_on_save = 1         " Fix files automatically on save
let g:ale_completion_enabled = 1  " Enable completion where available
" Disable linting while typing
" let g:ale_lint_on_text_changed = 'never'
