" Vim color file
" Converted from Textmate theme Monokai using Coloration v0.3.2 (http://github.com/sickill/coloration)
" Modified by Martin Forsythe Nov.13.2016

set background=dark
highlight clear

if exists("syntax_on")
  syntax reset
endif

" enable 256 colors
set t_Co=256

" name of the color profile
let g:colors_name = "monokai-custom"

hi Cursor                    ctermfg=235   ctermbg=231                  guifg=#272822 guibg=#f8f8f0
hi Visual                                  ctermbg=59                                 guibg=#49483e
hi CursorLine                              ctermbg=237                                guibg=#3c3d37
hi CursorColumn                            ctermbg=237                                guibg=#3c3d37
hi ColorColumn                             ctermbg=237                                guibg=#3c3d37

hi LineNr                    ctermfg=102   ctermbg=237                  guifg=#90908a guibg=#3c3d37
hi CursorLineNR              ctermfg=202   ctermbg=237                  guifg=#90908a guibg=#3c3d37
hi VertSplit                 ctermfg=241   ctermbg=241                  guifg=#64645e guibg=#64645e
hi MatchParen                ctermfg=197                                guifg=#f92672 
hi StatusLine                ctermfg=231   ctermbg=241  cterm=bold      guifg=#f8f8f2 guibg=#64645e gui=bold
hi StatusLineNC              ctermfg=231   ctermbg=241                  guifg=#f8f8f2 guibg=#64645e 
hi IncSearch                 ctermfg=235   ctermbg=186                  guifg=#272822 guibg=#e6db74 
hi Search                                               cterm=underline                             gui=underline
hi Directory                 ctermfg=141                                guifg=#ae81ff               
hi Folded                    ctermfg=242   ctermbg=235                  guifg=#75715e guibg=#272822
hi SignColumn                              ctermbg=237                                guibg=#3c3d37
hi Normal                    ctermfg=231   ctermbg=235                  guifg=#f8f8f2 guibg=#272822
hi Boolean                   ctermfg=141                                guifg=#ae81ff
hi Character                 ctermfg=141                                guifg=#ae81ff
hi Comment                   ctermfg=59                                 guifg=#5f5f5f
hi Conditional               ctermfg=197                                guifg=#f92672
hi Constant
hi Define                    ctermfg=197                                guifg=#f92672
hi DiffAdd                   ctermfg=231   ctermbg=64   cterm=bold      guifg=#f8f8f2 guibg=#46830c gui=bold
hi DiffDelete                ctermfg=88                                 guifg=#8b0807
hi DiffChange                                                           guifg=#f8f8f2 guibg=#243955
hi DiffText                  ctermfg=231   ctermbg=24   cterm=bold      guifg=#f8f8f2 guibg=#204a87 gui=bold
hi ErrorMsg                  ctermfg=231   ctermbg=197                  guifg=#f8f8f0 guibg=#f92672
hi WarningMsg                ctermfg=231   ctermbg=197                  guifg=#f8f8f0 guibg=#f92672
hi Float                     ctermfg=141                                guifg=#ae81ff
hi Function                  ctermfg=148                                guifg=#a6e22e
hi Identifier                ctermfg=81                                 guifg=#66d9ef               gui=italic
hi Keyword                   ctermfg=197                                guifg=#f92672
hi Label                     ctermfg=186                                guifg=#e6db74
hi NonText                   ctermfg=59    ctermbg=236                  guifg=#49483e guibg=#31322c 
hi Number                    ctermfg=141                                guifg=#ae81ff
hi Operator                  ctermfg=197                                guifg=#f92672
hi PreProc                   ctermfg=197                                guifg=#f92672
hi Special                   ctermfg=231                                guifg=#f8f8f2
hi SpecialComment            ctermfg=242                                guifg=#75715e
hi SpecialKey                ctermfg=59    ctermbg=237                  guifg=#49483e guibg=#3c3d37 
hi Statement                 ctermfg=197                                guifg=#f92672
hi StorageClass              ctermfg=81                                 guifg=#66d9ef               gui=italic
hi String                    ctermfg=186                                guifg=#e6db74
hi Tag                       ctermfg=197                                guifg=#f92672
hi Title                     ctermfg=231                cterm=bold      guifg=#f8f8f2               gui=bold
hi Todo                      ctermfg=95                 cterm=inverse,bold guifg=#75715e            gui=inverse,bold
hi Type                      ctermfg=197                                guifg=#f92672               
hi Underlined                                           cterm=underline                             gui=underline

" complete menu               
hi Pmenu                     ctermfg=81    ctermbg=16                   guifg=#66D9EF guibg=#000000                                                   
hi PmenuSel                                ctermbg=59                                 guibg=#49483e 
hi PmenuSbar                               ctermbg=232
hi PmenuThumb                ctermfg=81

if has("spell")
   hi SpellBad               ctermbg=52
   hi SpellCap               ctermbg=17
   hi SpellLocal             ctermbg=17
   hi SpellRare                                         cterm=reverse
endif

" HTML
hi htmlTag                   ctermfg=148                                guifg=#a6e22e
hi htmlEndTag                ctermfg=148                                guifg=#a6e22e
hi htmlSpecialChar           ctermfg=141                                guifg=#ae81ff

" javaScript
hi javaScriptFunction        ctermfg=81                                 guifg=#66d9ef               gui=italic
hi javaScriptRailsFunction   ctermfg=81                                 guifg=#66d9ef

" yaml
hi yamlKey                   ctermfg=197                                guifg=#f92672
hi yamlDocumentHeader        ctermfg=186                                guifg=#e6db74

" css
hi cssURL                    ctermfg=208                                guifg=#fd971f               gui=italic
hi cssFunctionName           ctermfg=81                                 guifg=#66d9ef
hi cssColor                  ctermfg=141                                guifg=#ae81ff
hi cssPseudoClassId          ctermfg=148                                guifg=#a6e22e
hi cssClassName              ctermfg=148                                guifg=#a6e22e
hi cssValueLength            ctermfg=141                                guifg=#ae81ff
hi cssCommonAttr             ctermfg=81                                 guifg=#66d9ef
