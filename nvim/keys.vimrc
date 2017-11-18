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
