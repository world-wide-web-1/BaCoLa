# Documentation

- [Comments](#comments)
- [Console Commands](#console_commands)
  - [Printing to the Console](#printing_to_the_console)
  - [Clearing the Console](#clearing_the_console)
- [Variables](#variables)
  - [Defining Variables](#defining_variables)
  - [Reading Variables](#reading_variables)
  - [Saving Variables](#saving-variables)
  - [Resetting Saved Variables](#resetting_saved_variables)
- [Basic Math](#basic_math)
  - [Adding](#adding)
  - [Subtracting](#subtracting)
  - [Multiplying](#multiplying)
  - [Dividing](#dividing)
  - [Exponents](#exponents)
  - [Remainders](#remainders)
- [Functions](functions)
  - [Defining a Function](#defining_a_function)
  - [Calling a Function](#calling_a_function)


# <p id="comments"></p>Comments
> For a single-line comment, you do the following:\
> ```// <text>```
> For a multi-line comment, you can do:
> ```
> //{
>   <text>
> }//
> ```

# <p id="console_commands"></p>Console Commands
> ### <p id="printing_to_the_console"></p>Printing to the Console
> > To print a string to the console, use the `printf` function.\
> > ```printf = <string>.```
> > \
> > To print a string to the console with a new line, use the `print` function.\
> > ```print = <string>.```
> ### <p id="clearing_the_console"></a>Clearing the Console
> > To clear the console, use the `clear` function.\
> > ```clear.```
# <p id="variables"></a>Variables
> ### <p id="defining_variables"></a>Defining Variables
> > To define a vaariable, use the `setvar` function.\
> > ```setvar <name> = <value>.```\
> > \
> > Alternatively, you could do the same thing without the `setvar` function as follows:\
> > ```<name> = <value>.```\
> > \
> > If don't want a variable to overwritten if it already exists, use `||=` instead of `=`.\
> > \
> > If you want a constant, use `const` instead of `setvar`. This will make the variable unchangeable. (unless overwritten using the constant function)\
> > ```const <name> = <value>.```\
> > \
> >**This function is reserved for level 1+!**\
> > To write to or make a locked variable, use the function `setvarunlocked`.\
> > ```setvarunlocked <name> = <value>.```
> ### <p id="reading_variables"></p>Reading Variables
> > To read a variable, you can just type the name of it, or you can use the `getvar` function.
> > ```
> > getvar <name>
> > <name>
> > ```
> ### <a id="saving_variables"></a>Saving Variables
> > To save a variable to variables.json, you use the `savevars` function.
> > ```
> > savevars.
> > ```
> ### <a id="resetting_saved_variables"></a>Resetting Saved Variables
> > If you reset variables, you are loading from defaultvariables.json and it will copy to variables.json to restore the default variables.
> > ```
> > resetvars.
> > ```
# <a id="basic_math"></a>Basic Math
> Numbers are defined in a unique way, they are enclosed in hashtags. `#<data>#`
> ### <a id="adding"></a>Adding
> > Adding is `<number> + <number>`
> ### <a id="subtracting"></a>Subtracting
> > Subtracting is `<number> - <number>`
> ### <a id="multplying"></a>Multiplying
> > Multiplying is `<number> * <number>`
> ### <a id="dividing"></a>Dividing
> > Dividing is `<number> / <number>`
> ### <a id="exponents"></a>Exponents
> > Exponents are `<number> ** <number>`
> ### <a id="remainders"></a>Remainders
> > Remainders are `<number> % <number>`
# <a id="function"></a>Functions
> ### <a id="defining_a_function"></a>Defining a Function
> > To define a function, you need to use the `gfunction` constructor.
> > ```
> > gfunction <name>[<prgument(s)>] {
> >   <code>
> > }
> > ```
> > Please note, the return command does not stop the function's execution.
> ### <a id="calling_a_function"></a>Calling a Function
> > To call a function, you use the `call` function.
> > ```
> > call <name>[<prgument(s)>]
> > call <name>[<prgument(s)>].
> > ```