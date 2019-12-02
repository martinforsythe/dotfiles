"------------------------------------------------
"
" This vimrc file configures custom key-bindings
"
"------------------------------------------------

"----- force arrow keys off -----
nnoremap <up> <nop>
nnoremap <down> <nop>
nnoremap <left> <nop>
nnoremap <right> <nop>
"inoremap <up> <nop>
"inoremap <down> <nop>
"inoremap <left> <nop>
"inoremap <right> <nop>

"----- during insert, kj escapes -----
" `^ is so that the cursor doesn't move
inoremap kj <Esc>`^

"-----  make backspaces more powerfull -----
set backspace=indent,eol,start

"----- make <Esc> exit the terminal emulator -----
if has('nvim')
  tnoremap <Esc> <C-\><C-n>
  tnoremap <M-[> <Esc>
  tnoremap <C-v><Esc> <Esc>
endif

"----- set <leader> to , rather than default \ -----
let mapleader = ","

"----- Language client server key mappings ----
" nnoremap <F5> :call LanguageClient_contextMenu()<CR>
" nnoremap <silent> K :call LanguageClient#textDocument_hover()<CR>
" nnoremap <silent> gd :call LanguageClient#textDocument_definition()<CR>
" nnoremap <silent> <F2> :call LanguageClient#textDocument_rename()<CR>

"---- ALE ----
" Bind F8 to fixing problems with ALE
nmap <F8> <Plug>(ale_fix)
