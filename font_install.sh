# Install Inconsolata font which is used by iterm and Terminal configurations
installed_fonts=$(ls /Library/Fonts/)
# Check if Inconsolata is already installed
if [[ ${installed_fonts[*]} =~ Inconsolata ]]; then
    echo "Installing Inconsolata font"
    curl https://github.com/google/fonts/blob/master/ofl/inconsolata/Inconsolata-Regular.ttf --output /Library/Fonts/Inconsolata-Regular.ttf
    curl https://github.com/google/fonts/blob/master/ofl/inconsolata/Inconsolata-Bold.ttf --output /Library/Fonts/Inconsolata-Bold.ttf
    #curl https://github.com/ryanoasis/nerd-fonts/blob/master/patched-fonts/Inconsolata/complete/Inconsolata%20Nerd%20Font%20Complete.otf --output /Library/Fonts/Inconsolata-Nerd-Font-Complete.otf
    #curl https://github.com/ryanoasis/nerd-fonts/blob/master/patched-fonts/Inconsolata/complete/Inconsolata%20Nerd%20Font%20Complete%20Mono.otf --output /Library/Fonts/Inconsolata-Nerd-Font-Complete-Mono.otf
    curl https://github.com/ryanoasis/nerd-fonts/releases/download/v1.2.0/Inconsolata.zip --output ~/Downloads
fi
