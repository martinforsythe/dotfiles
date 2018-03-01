# Install Inconsolata font which is used by iterm and Terminal configurations
installed_fonts=$(ls /Library/Fonts/)
if not_contains "$installed_fonts" "Inconsolata"; then
    echo "Installing Inconsolata font"
    curl https://github.com/google/fonts/blob/master/ofl/inconsolata/Inconsolata-Regular.ttf --output /Library/Fonts/Inconsolata-Regular.ttf
    curl https://github.com/google/fonts/blob/master/ofl/inconsolata/Inconsolata-Bold.ttf --output /Library/Fonts/Inconsolata-Bold.ttf
fi