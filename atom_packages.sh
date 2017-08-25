# To backup atom packages
apm list --installed --bare > atom_packages.list

# To backup atom settings:
# need only the .json, .cson, .coffee and .less files in ~/.atom

# To reinstall atom packages
#apm install `cat atom_packages.list`
