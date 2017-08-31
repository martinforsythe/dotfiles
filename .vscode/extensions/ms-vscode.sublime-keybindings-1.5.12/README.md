# Sublime Text Keymap for VS Code

This extension ports the most popular Sublime Text keyboard shortcuts to Visual Studio Code. After installing the extension and restarting VS Code your favorite keyboard shortcuts from Sublime Text are now available. 

## What keyboard shortcuts are included?

You can see all the keyboard shortcuts in the extension's contribution list. 

![extension contributions](https://raw.githubusercontent.com/Microsoft/vscode-sublime-keybindings/master/contributions_list.png)

## Why doesn't join lines or other Sublime Text commands work? 

This is because VS Code has not implemented this feature. Head on over to this [GitHub issue](https://github.com/Microsoft/vscode/issues/3776) and let the VS Code team know what you'd like to see. 

You can install an extension for many of these features:

* [Join Lines](https://marketplace.visualstudio.com/items?itemName=wmaurer.join-lines)
* [Paste and Indent](https://marketplace.visualstudio.com/items?itemName=Rubymaniac.vscode-paste-and-indent)
* [FontSize Shortcuts](https://marketplace.visualstudio.com/items?itemName=peterjuras.fontsize-shortcuts)
* [Bracket Selection](https://marketplace.visualstudio.com/items?itemName=guosong.bracketselection)
* [change case](https://marketplace.visualstudio.com/items?itemName=wmaurer.change-case)
* [expand-region](https://marketplace.visualstudio.com/items?itemName=letrieu.expand-region)
* [transpose](https://marketplace.visualstudio.com/items?itemName=v4run.transpose)
* [Close HTML/XML tag](https://marketplace.visualstudio.com/items?itemName=Compulim.compulim-vscode-closetag)

## How do I contribute a keyboard shortcut?

We may have missed a keyboard shortcut. If we did please help us out! It is very easy to make a PR. 

1. Head over to our [GitHub repository](https://github.com/Microsoft/vscode-sublime-keybindings). 
2. Open the [`package.json` file](https://github.com/Microsoft/vscode-sublime-keybindings/blob/master/package.json). 
3. Add a JSON object to [`contributions.keybindings`](https://github.com/Microsoft/vscode-sublime-keybindings/blob/master/package.json#L25) as seen below. 
4. Open a pull request. 

```json
{
    "mac": "<keyboard shortcut for mac>",
    "linux": "<keyboard shortcut for linux",
    "win": "<keyboard shortcut for windows",
    "key": "<default keyboard shortcut>",
    "command": "<name of the command in VS Code"
}
```

You can read more about how to contribute keybindings in extensions in the [official documentation](http://code.visualstudio.com/docs/extensionAPI/extension-points#_contributeskeybindings). 



## License
[MIT](https://github.com/Microsoft/vscode-sublime-keybindings/blob/master/license.txt)
