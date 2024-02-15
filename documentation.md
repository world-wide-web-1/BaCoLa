# Documentation

- Comments
- Console Commands
  - Printing to the Console
  - Clearing the Console
- Variables
  - Defining Variables
  - Reading Variables
- Basic Math
  - Adding
  - Subtracting
  - Multiplying
  - Dividing
  - Exponents
  - Remainders
- Functions
  - Defining a Function
  - Calling a Function


# Comments
> For a single-line comment, you do the following:\
> ```// <text>```
> For a multi-line comment, you can do:
> ```
> //{
>   <text>
> }//
> ```

# Console Commands
> ### Printing to the Console
> > To print a string to the console, use the `printf` function.\
> > ```printf = <string>.```
> > \
> > To print a string to the console with a new line, use the `print` function.\
> > ```print = <string>.```
> ### Clearing the Console
> > To clear the console, use the `clear` function.\
> > ```clear.```
# Variables
> ### Defining Variables
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
> ### Reading Variables
> > To read a variable, you can just type the name of it, or you can use the `getvar` function.
> > ```
> > getvar <name>
> > <name>
> > ```
# Basic Math
> ### Adding
> > Adding is `<number> + <number>`
> ### Subtracting
> > Subtracting is `<number> - <number>`
> ### Multiplying
> > Multiplying is `<number> * <number>`
> ### Dividing
> > Dividing is `<number> / <number>`
> ### Exponents
> > Exponents are `<number> ** <number>`
# Functions
> ### Defining a Function
> > To define a function, you need to use the `gfunction` constructor.
> > ```
> > gfunction <name>[<args>] {
> >   <code>
> > }
> > ```
> > Please note, the return command does not stop the function's execution.
> ### Calling a Function
> > To call a function, you use the `call` function.
> > ```
> > call <name>[<args>]
> > call <name>[<args>].
> > ```