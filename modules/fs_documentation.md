# FS Documentation

- [Opening Files](#opening)
- [Reading Files](#reading)
- [Checking Paths](#checking)
- [Modifying Files](#modifying)
  - [Writing to the File](#writing)
  - [Appending Data](#appending)
  - [Creating Directories](#creating)
- [Getting Directory Paths](#getting_paths)

# <p id="opening"></p>Opening Files
> To open a file, use the `open` function (`open <path: string>`)
# <p id="reading"></p>Reading Files
> To read a file, use the `read` function (`read <file>`)
# <p id="checking"></p>Checking Paths
> If you want to check if a path exists, check it with the `pathExists` function (`pathExists <file>`)\
> This is a good practice for checking if you opened a valid file.
# <p id="modifying"></p>Modifying Files
> ### <p id="writing"></p>Writing to the File
> > There are many ways to write to the file.
> > Using the `write` function, this function overwrites the file. (`write <file> = <data>`)
> > ### <p id="appending"></p>Appending Data
> > 1. Using the `writeNewLine` function, this function appends data to the file on a new line (`writeNewLine <file> = <data>`)
> > 2. using the `append` function, this function just puts the data at the end of the file (`append <file> = <data>`)
> ### <p id="creating"></p>Creating Directories
> > If you want to create a directory, you should use the `mkdir` functon (`mkdir <path>`)\
> > This supports recursive directories.
# <p id="getting_paths"></p>Getting Directory Paths
> The `getDirPath` function allows you to get the directory path of a file (`getDirPath <file>`)