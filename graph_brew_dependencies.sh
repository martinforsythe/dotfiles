# see https://github.com/martido/brew-graph
wget https://github.com/martido/brew-graph/blob/master/brew-graph.rb
brew install graphviz
./brew-graph.rb --installed | dot -Tpng -ograph.png
open graph.png
