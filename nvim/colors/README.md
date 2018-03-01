# Monokaim

Monokim is a vim colorfile based on Marcin Kulik's [vim-monokai](http://github.com/sickill/vim-monokai)
and Tomas Restrepo's [molokai](http://github.com/tomasr/molokai) which were inspired by the Monokai
theme for TextMate by Wimer Hazenberg and its darker variant by Hamish Stuart Macpherson.

## Installation

Put `monokaim.vim` file in your `~/.vim/colors/` (or `~/.config/nvim/colors/`) directory and add the following line to your `~/.vimrc` (or `~/.config/nvim/dein.vimrc`):

    syntax enable
    colorscheme monokaim

## Configuration

If you prefer the molokai scheme to match the original monokai background color, put this in your .vimrc file: 

    let g:molokai_original = 1
