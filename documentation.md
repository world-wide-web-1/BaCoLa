# Documentation

- [Introduction](#introduction)
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
- [Loops](#loops)
  - [Creating a Loop](#creating_a_loop)
  - [Break](#break)
  - [Continue](#continue)
- [Conditions](#conditions)
  - [If...Then...Else...](#if_then_else)
  - [True and False](#true_and_false)
  - [Logic Gates](#logic_gates)
- [Constructors](#constructors)
  - [Native Constructor](#native_constructor)
  - [Constructor Definition](#constructor_definition)
- [Modules](#modules)
  - [Importing Modules](#importing_modules)
  - [Creating Modules](#creating_modules)
- [Built-in Modules](#built-in_modules)
  - [WebServer](#webserver)
  - [exampleModule](#examplemodule)
  - [fs](#fs)
  - [math](#math)
  - [safeMode](#safemode)
  - [arrays](#arrays)



# <p id="introduction"></p>Introduction
> This programming language was made on my free time.\
> I strongly advise putting values in parentheses, for things like this:
> ```
> print = ("Hello" + ", " + "World!").
> ```
> I made this from an idea, and it became a whole project for me.\
> I had an idea of making a simple programming language, and I had dedicated more than thought I would.
# <p id="comments"></p>Comments
> For a single-line comment, you do the following:
> ```
> // <text>
> ```
> For a multi-line comment, you can do:
> ```
> //{
>   <text>
> }//
> ```

# <p id="console_commands"></p>Console Commands
> ### <p id="printing_to_the_console"></p>Printing to the Console
> > To print a string to the console, use the `printf` function.
> > ```
> > printf = <data>.
> > ```
> > \
> > To print a string to the console with a new line, use the `print` function.
> > ```
> > print = <data>.
> > ```
> ### <p id="clearing_the_console"></p>Clearing the Console
> > To clear the console, use the `clear` function.
> > ```
> > clear.
> > ```
# <p id="variables"></p>Variables
> ### <p id="defining_variables"></p>Defining Variables
> > To define a vaariable, use the `setvar` function.
> > ```
> > setvar <name> = <value>.
> > ```
> > \
> > Alternatively, you could do the same thing without the `setvar` function as follows:
> > ```
> > <name> = <value>.
> > ```
> > \
> > If don't want a variable to overwritten if it already exists, use `||=` instead of `=`.\
> > \
> > If you want a constant, use `const` instead of `setvar`. This will make the variable unchangeable. (unless overwritten using the constant function)
> > ```
> > const <name> = <value>.
> > ```
> > \
> >**This function is reserved for level 2!**\
> > To write to or make a locked variable, use the function `setvarunlocked`.\
> > ```setlockedvar <name> = <value>.```
> ### <p id="reading_variables"></p>Reading Variables
> > To read a variable, you can just type the name of it, or you can use the `getvar` function.
> > ```
> > getvar <name>
> > <name>
> > ```
> ### <p id="saving_variables"></p>Saving Variables
> > To save a variable to variables.json, you use the `savevars` function.
> > ```
> > savevars.
> > ```
> ### <p id="resetting_saved_variables"></p>Resetting Saved Variables
> > If you reset variables, you are loading from defaultvariables.json and it will copy to variables.json to restore the default variables.
> > ```
> > resetvars.
> > ```
# <p id="basic_math"></p>Basic Math
> Numbers are defined in a unique way, they are enclosed in hashtags. `#<datp>#`
> ### <p id="adding"></p>Adding
> > Adding is `<number> + <number>`
> ### <p id="subtracting"></p>Subtracting
> > Subtracting is `<number> - <number>`
> ### <p id="multplying"></p>Multiplying
> > Multiplying is `<number> * <number>`
> ### <p id="dividing"></p>Dividing
> > Dividing is `<number> / <number>`
> ### <p id="exponents"></p>Exponents
> > Exponents are `<number> ** <number>`
> ### <p id="remainders"></p>Remainders
> > Remainders are `<number> % <number>`
# <p id="function"></p>Functions
> ### <p id="defining_a_function"></p>Defining a Function
> > To define a function, you need to use the `gfunction` constructor.
> > ```
> > gfunction <name>[<prgument(s)>] {
> >   <code>
> > }
> > ```
> > Please note, the return command does not stop the function's execution.
> ### <p id="calling_a_function"></p>Calling a Function
> > To call a function, you use the `call` function.
> > ```
> > call <name>[<prgument(s)>]
> > call <name>[<prgument(s)>].
> > ```
# <p id="loops"></p>Loops
> ### <p id="creating_a_loop"></p>Creating a Loop
> > If you want to create a loop, you use the `loop` function.
> > ```
> > loop <number> {
> >   <code>
> > }
> > ```
> ### <p id="break"></p>Break
> > Just like in most other programming languages, you can break out of a loop using the `break` function.
> > ```
> > break.
> > ```
> ### <p id="continue"></p>Continue
> > In the same case, you can also continue to the next iteration using the `continue` function.
> > ```
> > continue.
> > ```
# <p id="conditions"></p>Conditions
> ### <p id="if_then_else"></p>If...Then...Else...
> > Conditions are a very important thing.
> > ```
> > if <condition> then {
> >   <code>
> > } else if <condition> then {
> >   <code>
> > } else {
> >   <code>
> > }
> > ```
> ### <p id="true_and_false"></p>True and False
> > True and False, 1 and 0.\
> > If you want to check if something is equal to another thing, you do `<data> == <data>`.\
> > If you want to check if something is not equal to another, you use `<data> != <data>`.
> ### <p id="logic_gates"></p>Logic Gates
> > Logic gates are pretty self-explanatory.\
> > AND gate: `<boolean> and <boolean>`\
> > OR gate: `<boolean> or <boolean>`\
> > XOR gate: `<boolean> xor <boolean>`\
> > NOT gate: `not <boolean>`
# <p id="constructors"></p>Constructors
> These following things are for execution level 1+
> ### <p id="native_constructor"></p>Native Constructor
> > The native constructor is used to define functions.
> > ```
> > native function <name>
> >   (ARGS) => {
> >     <JavaScript Code>
> >   }
> > ```
> > Example:
> > ```
> > native function demo
> >   (ARGS) => {
> >     return String(ARGS.x) + ARGS.y
> >   }
> > ```
> ### <p id="constructor_definition"></p>Constructor Definition
> > Once you make the function you need to make it known to the language.
> > ```
> > constructor <name> ({<syntax>},{<parameters>},{<eval parameters>})
> > ```
> > The paramaters are defined as so:\
> > [id, name]\
> > and you use the id in the syntax part. (`$<id>`)\
> > The eval paramaters say if it should be evaluated.
> > Example:
> > ```
> > constructor demo ({demo = $1 ($2)},{[['1','x'],['2','y']]},{['x']})
> > ```
# <p id="modules"></p>Modules
> ### <p id="importing_modules"></p>Importing Modules
> > To import modules, you use the `import` function.\
> > Modules are ran at level 1. The Module Folder has the shortcut of `%MFOLDER%`.\
> > ```
> > import <path: string>
> > ```
> ### <p id="creating_modules"></p>Creating Modules
> > To create a module, the first thing you do is use the `name` function.
> > ```
> > name <module name> {
> >   <functions>
> > }
> > ```
> > The functions are referred by the name, not the syntax.\
> > Also, please use the native constructor and the constructor definitions.\
> > An example of a module would be:
> > ```
> > name demo {
> > fn1
> > fn2
> > }
> > 
> > native function fn1
> >   (ARGS) => {
> >     console.log(String(ARGS.x) + "1");
> >   }
> > 
> > constructor fn1 ({1 = $1},{[["1","x"]]},{["x"]})
> >
> > 
> > native function fn2
> >   (ARGS) => {
> >     console.log(String(ARGS.x) + "2");
> >   }
> > 
> > constructor fn2 ({2 = $1},{[["1","x"]]},{["x"]})
> > ```
# <p id="built-in_modules"></p>Built-in Modules
> ### <p id="webserver"></p>WebServer
> > Import location: `%MFOLDER%/HTTP/WebServer.bclm`\
> > Documentation: [WebServer_documentation.md](modules/WebServer_documentation.md)
> ### <p id="examplemodule"></p>exampleModule
> > Import location: `%MFOLDER%/exampleModule.bclm`
> ### <p id="fs"></p>fs
> > Import location: `%MFOLDER%/fs.bclm`\
> > Documentation: [fs_documentation.md](modules/fs_documentation.md)
> ### <p id="math"></p>math
> > Import location: `%MFOLDER%/math.bclm`\
> > Documentation: [math_documentation.md](modules/math_documentation.md)
> ### <p id="safemode"></p>safeMode
> > Import location: `%MFOLDER%/safeMode.bclm`
> ### <p id="arrays"></p>arrays
> > Import location: `%MFOLDER%/arrays.bclm`\
> > Documentation: [arrays_documentation.md](modules/arrays_documentation.md)