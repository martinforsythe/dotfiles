# code folding

`:help fold-commands`

fold open/close:
- `zc` - close one fold under the curosr
- `zo` - open one fold under the curosr
- `zO` - resursive fold open
- `zC` - recursive fold close
- `zn` reset `foldenable` - all folds will open

fold movement commands:
- `]z`-
- `[z`-
- `zj`-
- `zk`-

# signify

n  <Plug>(signify-prev-hunk) * &diff ? '[c' : ":\<C-U>call sy#jump#prev_hunk(v:count1)\<CR>"
n  <Plug>(signify-next-hunk) * &diff ? ']c' : ":\<C-U>call sy#jump#next_hunk(v:count1)\<CR>"

# git-gutter

n  ,hp          @<Plug>GitGutterPreviewHunk
n  ,hu          @<Plug>GitGutterUndoHunk
n  ,hs          @<Plug>GitGutterStageHunk

n  <Plug>GitGutterPreviewHunk * :GitGutterPreviewHunk<CR>
n  <Plug>GitGutterUndoHunk * :GitGutterUndoHunk<CR>
n  <Plug>GitGutterStageHunk * :GitGutterStageHunk<CR>
n  <Plug>GitGutterPrevHunk * &diff ? '[c' : ":\<C-U>execute v:count1 . 'GitGutterPrevHunk'\<CR>"
n  <Plug>GitGutterNextHunk * &diff ? ']c' : ":\<C-U>execute v:count1 . 'GitGutterNextHunk'\<CR>"

# vimagit

n  <C-N>       *@:call  magit#jump_hunk('N')<CR>
n  <C-P>       *@:call  magit#jump_hunk('P')<CR>
n  +           *@:call  magit#update_diff('+')<CR>
n  -           *@:call  magit#update_diff('-')<CR>
n  0           *@:call  magit#update_diff('0')<CR>
n  ?           *@:call  magit#toggle_help()<CR>
n  CU          *@:call  magit#close_commit()<CR>
n  CF          *@:call  magit#commit_command('CF')<CR>
n  CA          *@:call  magit#commit_command('CA')<CR>
n  CC          *@:call  magit#commit_command('CC')<CR>jj

https://github.com/jreybert/vimagit

### Getting started

- `<Leader>M`

  Open Magit buffer. For now this is `,M`

- `:Magit`
  Open magit buffer with [:Magit](https://github.com/jreybert/vimagit#magitshow_magit) command.

- `:n`
  Jump to next hunk with `<C-n>`, or move the cursor as you like. The cursor is on a hunk.

- `S`
  While the cursor is on an unstaged hunk, press `S` in Normal mode: the hunk is now staged, and appears in "Staged changes" section (you can also unstage a hunk from "Staged section" with `S`).

- ```
  CC
  ```

  Once you have stage all the required changes, press

   

  ```
  CC
  ```

  .

  - Section "Commit message" is shown.
  - Type your commit message in this section.
  - To commit, go back in Normal mode, and press `CC` (or `:w` if you prefer).