"------------------------------------------------------
"
" This vimrc file configures plugin-specific settings
"
"------------------------------------------------------

" which pythons should neovim use
let g:python2_host_prog = expand('~/.virtualenvs/neovim2/bin/python')
let g:python3_host_prog = expand('~/.virtualenvs/neovim3/bin/python')

"---------------------------------------------
"                SimpylFold
" For configuration options see docs at:
" https://github.com/tmhedberg/SimpylFold
" open folds with :zo, close folds with :zc
"---------------------------------------------
let g:SimpylFold_fold_docstring=0
let g:SimpylFold_fold_import=0

"---------------------------------------------
"                SplitJoin
" See docs at:
" https://github.com/AndrewRadev/splitjoin.vim
" :gS for single --> multi  line
" :gJ for multi  --> single line
"---------------------------------------------

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
"
" More auto-completion sources at:
" https://github.com/Shougo/deoplete.nvim/wiki/Completion-Sources
"---------------------------------------------
let g:deoplete#enable_at_startup = 1
let g:deoplete#enable_smart_case = 1
autocmd CompleteDone * pclose        " close preview window of deoplete


let g:autocomplete_flow#insert_paren_after_function = 0

"---------------------------------------------
"               Python-Syntax
" For configuration instructions see:
" https://github.com/vim-python/python-syntax
"---------------------------------------------
let g:python_highlight_all = 1


"---------------------------------------------
"          Deoplete Jedi (Python)
" For configuration instructions see:
" https://github.com/zchee/deoplete-jedi
"---------------------------------------------
let g:deoplete#sources#jedi#server_timeout = 10
let g:deoplete#sources#jedi#show_docstring = 1


"---------------------------------------------
"               Deopelete Rust
" Auto-completion source for Rust via Racer
" For confuguration instructions see:
" https://github.com/sebastianmarkow/deoplete-rust
"---------------------------------------------
let g:deoplete#sources#rust#racer_binary='~/.cargo/bin/racer'           " path to racer
let g:deoplete#sources#rust#rust_source_path='~/external_code/rust/src' " path to rust source
" disable default gd and K keymappings:
let g:deoplete#sources#rust#disable_keymap=1
" nmap <buffer> gd <plug>DeopleteRustGoToDefinitionDefault
" nmap <buffer> K  <plug>DeopleteRustShowDocumentation


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
\}

" Specify which tools ALE should use to fix linting errors
let g:ale_fixers = {
\   'javascript': ['eslint'],
\}

"\   'python': [
"\        'trim_whitespace',
"\        'remove_trailing_lines',
"\        'autopep8',
"\        'isort', 
"\        'add_blank_lines_for_python_control_statements',
"\   ],
"
" Do not lint or fix minified js and css files.
let g:ale_pattern_options = {
\   '\.min\.js$': {'ale_linters': [], 'ale_fixers': []},
\   '\.min\.css$': {'ale_linters': [], 'ale_fixers': []},
\}

