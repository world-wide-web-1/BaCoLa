# Arrays Documentation

- [Creating an Array](#creating)
- [Retrieving From an Array](#retrieving)
- [Modifying an Array](#modifying)
  - Setting an Index
  - Inserting at the end
  - Inserting at the Beginning
  - Removing an Index

# <p id="creating"></p>Creating an Array
> To create an array, its just a list enclosed in square brackets.
> ```
> [<elements>]
> ```
# <p id="retrieving"></p>Retrieving From an Array
> To retrieve from an array, you can use the `getIndex` function.
> ```
> getIndex <array>[<index: number>]
> ```
# <p id="modifying"></p>Modifying an Array
> ### Setting an Index
> > using the `setIndex` function, you can modify an index.
> > ```
> > setIndex <array>[<index: number>] = <value>.
> > ```
> ### Inserting at the end
> > To add an element to the end of an array, use the `insertLast` function.
> > ```
> > insertLast <array> = <value>.
> > ```
> ### Inserting at the Beginning
> > To add an element to the beginning of an array, use the `insertFirst` function.
> > ```
> > insertFirst <array> = <value>.
> > ```
> ### Removing an Index
> > To remove an index from an array, use the `remove` function.
> > ```
> > remove <array>[<index: number>].
> > ```