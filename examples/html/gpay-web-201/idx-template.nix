{ pkgs, ... }: {
  bootstrap = ''
    # Copy the folder containing the `idx-template` files to the final
    # project folder for the new workspace. ${./.} inserts the directory
    # of the checked-out Git folder containing this template.
    cp -rf ${./.} "$out"

    # Copy IDX config
    mkdir "$out"/.idx
    cp ${./dev.nix} "$out"/.idx/dev.nix

    # Set some permissions
    chmod -R u+w "$out"
    
    # Remove the template files themselves and any connection to the template's
    # Git repository
    rm -rf "$out/.git" "$out/idx-template".{nix,json} "$out/dev.nix"
  ''; 
}