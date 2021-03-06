"------------------------------------------------------
"
" This vimrc file configures plugin-specific settings
"
"------------------------------------------------------

" which pythons should neovim use
let g:python3_host_prog = expand('~/.local/share/virtualenvs/neovim38/bin/python')
" let g:python2_host_prog = expand('~/.local/share/virtualenvs/neovim27/bin/python')

"---------------------------------------------
"               Vim Test
" For configuration optiosn see docs at:
" https://github.com/janko/vim-test
"
" Run tests with :TestFile :TestLast :TestSuite :TestNearest
" --------------------------------------------
let test#strategy = "neovim"
let test#python#pytest#options = "--verbose"

"---------------------------------------------
"                SimpylFold
" For configuration options see docs at:
" https://github.com/tmhedberg/SimpylFold
" open folds with :zo, close folds with :zc
"---------------------------------------------
" let g:SimpylFold_fold_docstring=0
" let g:SimpylFold_fold_import=0

"---------------------------------------------
"              Coiled Snake
" For configuration options see docs at:
" https://github.com/kalekundert/vim-coiled-snake
" open folds with :zo, close folds with :zc
" See :help fold-commands
"---------------------------------------------
let g:fastfold_fold_movement_commands = [']z', '[z', 'zj', 'zk']
function! g:CoiledSnakeConfigureFold(fold)

    " Don't fold nested classes.
    if a:fold.type == 'class'
        let a:fold.max_level = 1

    " Don't fold nested functions, but do fold methods
    " (i.e. functions nested inside a class).
    " Also set min lines for function folding to 3.
    elseif a:fold.type == 'function'
        " let a:fold.min_lines = 3
        let a:fold.max_level = 1
        if get(a:fold.parent, 'type', '') == 'class'
            let a:fold.max_level = 2
        endif

    " Only fold imports if there are 10 or more of them.
    elseif a:fold.type == 'import'
        let a:fold.min_lines = 10
    endif

    " Don't fold anything if the whole program is
    " shorter than 50 lines.
    if line('$') < 50
        let a:fold.ignore = 1
    endif

endfunction

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
" airline uses a number of other plugins:
"  - vim-githutter <https://github.com/airblade/vim-gitgutter>
"  - NerdTree <https://github.com/scrooloose/nerdtree.git>
"---------------------------------------------
let g:airline_theme = 'luna'
let g:airline#extensions#languageclient#enabled = 1
let g:airline#extensions#neomake#enabled = 1
let g:airline#extensions#virtualenv#enabled = 1
let g:airline#extensions#hunks#enabled = 1
" to see hunks do: airline#extensions#hunks#get_raw_hunks()

""---------------------------------------------
""           Language-Client Servers
""---------------------------------------------
"let g:LanguageClient_serverCommands = {
"  \ 'rust': ['~/.cargo/bin/rustup', 'run', 'stable', 'rls'],
"  \ 'cpp': ['clangd'],
"  \ }

"---------------------------------------------
"           COC Completion Server
" https://github.com/neoclide/coc.nvim/wiki/Completion-with-sources
"---------------------------------------------
" use <tab> for trigger completion and navigate to next complete item
function! s:check_back_space() abort
  let col = col('.') - 1
  return !col || getline('.')[col - 1]  =~ '\s'
endfunction

inoremap <silent><expr> <TAB>
      \ pumvisible() ? "\<C-n>" :
      \ <SID>check_back_space() ? "\<TAB>" :
      \ coc#refresh()
" Navagate completion list and cofirm complete
inoremap <expr> <Tab> pumvisible() ? "\<C-n>" : "\<Tab>"
inoremap <expr> <S-Tab> pumvisible() ? "\<C-p>" : "\<S-Tab>"
inoremap <expr> <cr> pumvisible() ? "\<C-y>" : "\<C-g>u\<CR>"

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


"----------------------------------------------
"                Neoinclude
" See: https://github.com/Shougo/neoinclude.vim/blob/master/doc/neoinclude.txt
" The |g:neoinclude#paths| is set automatically from path
" To be more conservative I explicitly set the include path for C/C++ file
" types.
"----------------------------------------------
" set path='/usr/include/**,/usr/local/include/**,/usr/local/opt/llvm/include/**,/usr/local/opt/gcc/include/**'
" FIXME: would be nice to set the project specific include paths with a local
" .nvimrc or similar
let g:neoinclude#paths = {
            \ 'c': '/usr/local/opt/llvm/include/**,~/workspace/lm-sdk/include,~/workspace/lm-sdk/src/include,~/workspace/lm-sdk/test/include',
            \ 'cpp': '/usr/local/opt/llvm/include/**,~/workspace/lm-sdk/include,~/workspace/lm-sdk/src/include,~/workspace/lm-sdk/test/include',
            \ }

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
"         Deoplete Clang (C/C++)
" For configuration instructions see:
" https://github.com/tweekmonster/deoplete-clang2
"
" This section is currently commented out because I could not get
" deoplete-clang or deoplete-clang2 to work correctly.
"---------------------------------------------
"
" let g:deoplete#sources#clang#clang_header = '/usr/local/opt/llvm/include'
" let g:deoplete#sources#clang#libclang_path = '/usr/local/Cellar/llvm/7.0.1/lib/libclang.dylib'
" let g:deoplete#sources#clang#autofill_neomake = 1
" let g:deoplete#sources#clang#executable = '/usr/local/opt/llvm/bin/clang'
" " use C++11 standard, not C++17 (i.e. c++1z)
" let g:deoplete#sources#clang#std = {'c': 'c11', 'cpp': 'c++11', 'objc': 'c11', 'objcpp': 'c++11'}
" let g:deoplete#sources#clang#clang_complete_database = '$HOME/workspace/lm-sdk/'
" set completeopt-=preview
"
"--------------------------------------------
"         Deoplete ClangX
" https://github.com/Shougo/deoplete-clangx
"--------------------------------------------
" Change clang binary path
" let g:deoplete#custom#var = ('clangx', 'clang_binary', '/usr/local/opt/llvm/bin/clang')


"---------------------------------------------
"               Deopelete Rust
" Auto-completion source for Rust via Racer
" For confuguration instructions see:
" https://github.com/sebastianmarkow/deoplete-rust
"---------------------------------------------
" let g:deoplete#sources#rust#racer_binary='~/.cargo/bin/racer'           " path to racer
" let g:deoplete#sources#rust#rust_source_path='~/external_code/rust/src' " path to rust source
" disable default gd and K keymappings:
" let g:deoplete#sources#rust#disable_keymap=1
" nmap <buffer> gd <plug>DeopleteRustGoToDefinitionDefault
" nmap <buffer> K  <plug>DeopleteRustShowDocumentation

"---------------------------------------------
"             rust-Lang/rust.vim
"
" The :RustFmt command will format your code.
"---------------------------------------------
let g:rustfmt_autosave = 1

"---------------------------------------------
"                LLVM Toolchain
" https://clang.llvm.org/extra/include-fixer.html
"
"---------------------------------------------
" let g:clang_include_fixer_path=clang-include-fixer


"---------------------------------------------
"     Asynchronous Lint Engine (ALE)
" For configuration instructions see:
" https://github.com/w0rp/ale#installation
"---------------------------------------------
augroup ale_config
    autocmd!
    let g:ale_completion_enabled = 1
    let g:ale_set_highlights = 1
    let g:ale_set_signs = 1
    let g:ale_set_balloons = 1
    let g:ale_lint_on_save = 0

    " If `ale_c_parse_compile_commands = 1`, ALE will parse `compile_commands.json`
    " to determine flags for C or C++ compilers. ALE expects this to be in the
    " `"comamnds"` format rather than the `"arguments"` format.
    " ALE will first search for the nearest `compile_commands.json` file, and
    " then look for `compile_commands.json` files in the directories for
    " |g:ale_c_build_dir_names|.
    "
    " If |g:ale_c_parse_makefile| or |b:ale_c_parse_makefile| is set to `1`, the
    " output of `make -n` will be preferred over `compile_commands.json` files.
    let g:ale_c_parse_compile_commands = 1
    let g:ale_c_parse_makefile = 1

    " -----------------------------------------
    " ---- PROJECT SPECIFIC COMPILER FLAGS ----
    " -----------------------------------------
    " Movement through the ALE errors
    " map keys to use wrapping.
    nmap <silent> <C-k> <Plug>(ale_previous_wrap)
    nmap <silent> <C-j> <Plug>(ale_next_wrap)
    
    " would be nice if this was parsed from compile_commands.json or Makefiles
    "let g:ale_cpp_clang_options = '-Wall -Werror -std=gnu++11 -stdlib=libc++'
    "let g:ale_cpp_clangtidy_options = '-Wall -Werror -std=gnu++11 -stdlib=libc++ -x c++'
    "let g:ale_cpp_clangcheck_options = '-- -Wall -Werror -std=gnu++11 -stdlib=libc++ -x c++ -extra-arg -Xclang -extra-arg -analyzer-output=text'
    "let g:ale_cpp_clangd_options = '-std=gnu++11 -stdlib=libc++'
    "let g:ale_c_clang_options = '-Wall -Werror -std=gnu11'
    "let g:ale_c_clangtidy_options = '-Wall -Werror -std=gnu11 -x c'
    "let g:ale_c_clangd_options = '-std=gnu11'

    " https://github.com/MaskRay/ccls/wiki/Customization#initialization-options
    let g:ale_c_ccls_init_options = {}

    let g:ale_c_uncrustify_options = '-c ~/.uncrustify'

    let g:ale_rust_rls_executable = 'rls'
    let g:ale_rust_rls_toolchain = 'stable'
    " use 'cargo clippy' instead of 'cargo check' or 'cargo build'
    let g:ale_rust_cargo_use_clippy = 1

    " By default ALE will run all available tools for all supported languages.
    " For all languages unspecified in the dictionary, all possible linters
    " will be run, just as when the dictionary is not defined.
    "
    " 'clangcheck' seems to have issues with outputing .plst files despite
    " attempts to set the -extra-arg -analyzer-output=text options
    "
    " I have manually compiled and installed github.com/MaskRay/ccls
    " which aims to be a more modern language server than cquery
    " ccls seems to require having a .ccls-root file in the project root
    " and a compile_commands.json
    "
    let b:ale_linters = {
    \   'python': ['flake8'],
    \   'c': ['ccls'],
    \   'cpp': ['ccls'],
    \   'rust': ['rustc', 'rls', 'cargo'],
    \}

    " Specify which tools ALE should use to fix linting errors
    let g:ale_fixers = {
    \   '*': ['remove_trailing_lines', 'trim_whitespace'],
    \   'python': ['yapf', 'isort'],
    \   'c': ['uncrustify'],
    \   'cpp': ['uncrustify'],
    \   'rust': ['rustfmt'],
    \}

    " Do not lint or fix minified js and css files.
    let g:ale_pattern_options = {
    \   '\.min\.js$': {'ale_linters': [], 'ale_fixers': []},
    \   '\.min\.css$': {'ale_linters': [], 'ale_fixers': []},
    \}
augroup END

