"use strict";
var returned = false;
var fileType = "bacola"
var cargs = process.argv.slice(2);
var autoname = false
var scriptFile = `${cargs[0] == undefined ? `${autoname ? "index" : undefined}` : cargs[0]}${autoname ? `.${fileType}` : ""}`;
var variables = require(__dirname + "/variables.json");
var module_paths = {};
var constructorBackup = [];
var li = 0;
var ignore = false;
var functions = {};
var broken = false;
var skip = false;
var fs = require("fs");
var path = require("path");
var filePath = path.resolve(scriptFile);
var importedModules = [];
const pattern = [
	'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
	'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
].join('|');

const regex = new RegExp(pattern, false ? undefined : 'g');

function stripAnsi(string) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
	}
	return string.replace(regex, '');
}

var term = 13;
function create(config) {

  config = config || {};
  var sigint = config.sigint;
  var eot = config.eot;
  var autocomplete = config.autocomplete =
    config.autocomplete || function(){return []};
  var history = config.history;
  prompt.history = history || {save: function(){}};
  prompt.hide = function (ask) { return prompt(ask, {echo: ''}) };

  return prompt;
  function prompt(ask, value, opts) {
    var insert = 0, savedinsert = 0, res, i, savedstr;
    opts = opts || {};

    if (Object(ask) === ask) {
      opts = ask;
      ask = opts.ask;
    } else if (Object(value) === value) {
      opts = value;
      value = opts.value;
    }
    ask = ask || '';
    var echo = opts.echo;
    var masked = 'echo' in opts;
    autocomplete = opts.autocomplete || autocomplete;

    var fd = (process.platform === 'win32') ?
      process.stdin.fd :
      fs.openSync('/dev/tty', 'rs');

    var wasRaw = process.stdin.isRaw;
    if (!wasRaw) { process.stdin.setRawMode && process.stdin.setRawMode(true); }

    var buf = Buffer.alloc(3);
    var str = '', character, read;

    savedstr = '';

    if (ask) {
      process.stdout.write(ask);
    }

    var cycle = 0;
    var prevComplete;

    while (true) {
      read = fs.readSync(fd, buf, 0, 3);
      if (read > 1) {
        switch(buf.toString()) {
          case '\u001b[A':
            if (masked) break;
            if (!history) break;
            if (history.atStart()) break;

            if (history.atEnd()) {
              savedstr = str;
              savedinsert = insert;
            }
            str = history.prev();
            insert = str.length;
            process.stdout.write('\u001b[2K\u001b[0G' + ask + str);
            break;
          case '\u001b[B':
            if (masked) break;
            if (!history) break;
            if (history.pastEnd()) break;

            if (history.atPenultimate()) {
              str = savedstr;
              insert = savedinsert;
              history.next();
            } else {
              str = history.next();
              insert = str.length;
            }
            process.stdout.write('\u001b[2K\u001b[0G'+ ask + str + '\u001b['+(insert+ask.length+1)+'G');
            break;
          case '\u001b[D':
            if (masked) break;
            var before = insert;
            insert = (--insert < 0) ? 0 : insert;
            if (before - insert)
              process.stdout.write('\u001b[1D');
            break;
          case '\u001b[C':
            if (masked) break;
            insert = (++insert > str.length) ? str.length : insert;
            process.stdout.write('\u001b[' + (insert+ask.length+1) + 'G');
            break;
          default:
            if (buf.toString()) {
              str = str + buf.toString();
              str = str.replace(/\0/g, '');
              insert = str.length;
              promptPrint(masked, ask, echo, str, insert);
              process.stdout.write('\u001b[' + (insert+ask.length+1) + 'G');
              buf = Buffer.alloc(3);
            }
        }
        continue;
      }
      character = buf[read-1];
      if (character == 3){
        process.stdout.write('^C\n');
        fs.closeSync(fd);

        if (sigint) process.exit(130);

        process.stdin.setRawMode && process.stdin.setRawMode(wasRaw);

        return null;
      }
      if (character == 4) {
        if (str.length == 0 && eot) {
          process.stdout.write('exit\n');
          process.exit(0);
        }
      }
      if (character == term) {
        fs.closeSync(fd);
        if (!history) break;
        if (!masked && str.length) history.push(str);
        history.reset();
        break;
      }
      if (character == 9) {
        res = autocomplete(str);

        if (str == res[0]) {
          res = autocomplete('');
        } else {
          prevComplete = res.length;
        }

        if (res.length == 0) {
          process.stdout.write('\t');
          continue;
        }

        var item = res[cycle++] || res[cycle = 0, cycle++];

        if (item) {
          process.stdout.write('\r\u001b[K' + ask + item);
          str = item;
          insert = item.length;
        }
      }

      if (character == 127 || (process.platform == 'win32' && character == 8)) {
        if (!insert) continue;
        str = str.slice(0, insert-1) + str.slice(insert);
        insert--;
        process.stdout.write('\u001b[2D');
      } else {
        if ((character < 32 ) || (character > 126))
            continue;
        str = str.slice(0, insert) + String.fromCharCode(character) + str.slice(insert);
        insert++;
      };

      promptPrint(masked, ask, echo, str, insert);

    }

    process.stdout.write('\n')

    process.stdin.setRawMode && process.stdin.setRawMode(wasRaw);

    return str || value || '';
  };


  function promptPrint(masked, ask, echo, str, insert) {
    if (masked) {
        process.stdout.write('\u001b[2K\u001b[0G' + ask + Array(str.length+1).join(echo));
    } else {
      process.stdout.write('\u001b[s');
      if (insert == str.length) {
          process.stdout.write('\u001b[2K\u001b[0G'+ ask + str);
      } else {
        if (ask) {
          process.stdout.write('\u001b[2K\u001b[0G'+ ask + str);
        } else {
          process.stdout.write('\u001b[2K\u001b[0G'+ str + '\u001b[' + (str.length - insert) + 'D');
        }
      }
      var askLength = stripAnsi(ask).length;
      process.stdout.write(`\u001b[${askLength+1+(echo==''? 0:insert)}G`);
    }
  }
};
var prompt = create();
function appendVariables(list){
  Object.assign(variables, list)
  return null
}
let syntaxoptions = {
  paren: [{
    open: '(',
    close: ')'
  },
  {
    open: '[',
    close: ']'
  },
  {
    open: '{',
    close: '}'
  }],
  quoteSets: ['"',"'",'`'],
  whitespace: [' ','  ','	'],
  lineend: "\n",
  indents: '  '
};
let syntax = {
  paren: [{
    open: '(',
    close: ')'
  },
  {
    open: '[',
    close: ']'
  },
  {
    open: '{',
    close: '}'
  }],
  quoteSets: ['"',"'",'`'],
  whitespace: [' ','  ','	','	'],
  lineend: "\n",
  indents: '  '
};
appendVariables(
  /*{
    version: {
      value: null,
      locked: true
    },
    stopOnError: {
      value: true,
      locked: true
    },
    showVarCreation: {
      value: false,
      locked: true
    },
    keepLanguageDefiningCommands: {
      value: false,
      locked: true
    },
    clearConsoleAtStart: {
      value: false,
      locked: true
    }
  }*/
)
let constructors = [];
let m_constructors = [];
function newConstructor(fn,c) {
  constructors.push([fn, c]);
}

// Normal Print Function
newConstructor('none',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '\n',
    map: [],
    evalParams: []
});
newConstructor('native',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'native function $1 {$2}',
    map: [['1','name'],['2','code']],
    evalParams: []
});

newConstructor('name',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'name $1 {$2}',
    map: [['1','n'],['2','fns']],
    evalParams: []
});

newConstructor('is_imported',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'is_imported $1',
    map: [['1','name']],
    evalParams: []
});

newConstructor('unload',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'unload $1',
    map: [['1','name']],
    evalParams: []
});

newConstructor('and',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 and $2',
    map: [['1','a'],['2','b']],
    evalParams: ['a', 'b']
});

newConstructor('or',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 or $2',
    map: [['1','a'],['2','b']],
    evalParams: ['a', 'b']
});

newConstructor('xor',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 xor $2',
    map: [['1','a'],['2','b']],
    evalParams: ['a', 'b']
});

newConstructor('not',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'not $1',
    map: [['1','a'],['2','b']],
    evalParams: ['a']
});

newConstructor('constructor',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'constructor $1 ({$2},{$3},{$4})',
    map: [['1','name'],['2','constructor'],['3','map'],['4','evalParams']],
    evalParams: []
});

newConstructor('setlockedvar',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'setlockedvar $1 = $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["name", "value"]
});

newConstructor('setlockedvar2',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'setlockedvar $1 ||= $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["name", "value"]
});

newConstructor('getvar',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'getvar $1',
    map: [['1','name']],
    evalParams: []
});

newConstructor('setvar',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'setvar $1 = $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["value"]
});

newConstructor('constant',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'const $1 = $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["value"]
});

newConstructor('setvar',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 = $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["value"]
});

newConstructor('setvar',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'module_path',
    map: [],
    evalParams: []
});

newConstructor('setvar2',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 ||= $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["value"]
});

newConstructor('setvar2',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'setvar $1 ||= $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["value"]
});

newConstructor('error',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'error = $1.',
    map: [['1', 'txt']],
    evalParams: ['txt']
});
newConstructor('warn',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'warn = $1.',
    map: [['1', 'txt']],
    evalParams: ['txt']
});

newConstructor('EvalJS',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'EvalJS {$1}',
    map: [['1','txt']],
    evalParams: []
});

newConstructor('EvalJS2',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'EvalJS2 = $1',
    map: [['1','txt']],
    evalParams: ["txt"]
});

newConstructor('EvalFn',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'EvalFn = $1',
    map: [['1','txt']],
    evalParams: ["txt"]
});

newConstructor('import',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'import $1',
    map: [['1','n']],
    evalParams: ["n"]
});

newConstructor('executeFile',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'exec $1.',
    map: [['1','fn']],
    evalParams: ["fn"]
});

newConstructor('wait',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'wait $1.',
    map: [["1", "ms"]],
    evalParams: ["ms"]
});

newConstructor('input',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'input = $1.',
    map: [["1", "prompt"]],
    evalParams: ["prompt"]
});

newConstructor('if',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 ? $2 : $3',
    map: [['1', 'bool'],['2', 'then'],['3','else']],
    evalParams: ['bool', 'then', 'else']
});

newConstructor('if',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'if $1 then {$2} else $3',
    map: [['1', 'bool'],['2', 'then'],['3','else']],
    evalParams: ['bool']
});

newConstructor('ifne',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'if $1 then {$2}',
    map: [['1', 'bool'],['2', 'then']],
    evalParams: ['bool']
});

newConstructor('add',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 + $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('subtract',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 - $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('multiply',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 * $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('divide',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 / $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('add',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'Math add $1 $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('subtract',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'Math subtract $1 $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('multiply',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'Math multiply $1 $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('divide',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'Math divide $1 $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('greaterthan',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 > $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('lessthan',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 < $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('equalto',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 == $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('greaterthanequalto',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 >= $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('lessthanequalto',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 <= $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('joinStr',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '> $1 & $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('remainder',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 % $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('power',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 ** $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('savedefvars',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'savedefvars.',
    map: [[]],
    evalParams: []
});

/*newConstructor('joinStr',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'join = $1 $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});*/


newConstructor('joinStr',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '>($1, $2)<',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('importJS',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'importJS $1',
    map: [['1', 'source']],
    evalParams: ['1']
});

let fns = {
  native: (ARGS) => {
    //console.log(ARGS.code.trim('\n').trim())
    //fns[ARGS.name] = Function("return "+ARGS.code.trim('\n').trim())();
    fns[ARGS.name] = eval("()=>{return "+ARGS.code.trim('\n').trim() + "}")();
  },
  and: (ARGS) => {
    return ARGS.a && ARGS.b;
  },
  or: (ARGS) => {
    return ARGS.a || ARGS.b;
  },
  not: (ARGS) => {
    return !ARGS.a;
  },
  xor: (ARGS) => {
    return (ARGS.a && !ARGS.b) || (!ARGS.a && ARGS.b);
  },
  constructor: (ARGS) => {
    newConstructor(ARGS.name,{
    paren: syntax.paren,
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: ARGS.constructor,
    map: JSON.parse(ARGS.map),
    evalParams: JSON.parse(ARGS.evalParams)
    });
  },
  name: (ARGS) => {
    var name = ARGS.n;
    importedModules.push([ARGS.n, (ARGS.fns.trim().replaceAll(" ", "")).split("\n")]);
    m_constructors[name] = [];
    function newConstructor(fn,c) {
      m_constructors[name].push([fn,c])
    }
    fns["constructor"] = (ARGS) => {
      newConstructor(ARGS.name,{
      paren: syntax.paren,
      quoteSets: ['"',"'",'`'],
      whitespace: [' ','  ','	','	'],
      c: ARGS.constructor,
      map: JSON.parse(ARGS.map),
      evalParams: JSON.parse(ARGS.evalParams)
      });
    };
  },
  is_imported: (ARGS) => {
    return importedModules.find(e => e[0] === ARGS.name) ? true : false;
  },
  unload: (ARGS) => {
    var moduleIndex = importedModules.findIndex(e => e[0] === ARGS.name);

    if (moduleIndex !== -1) {
      var module = importedModules[moduleIndex];
      for (const e of module[1]) {
        delete fns[e];
      }
      importedModules.splice(moduleIndex, 1);
      delete m_constructors[module];
      delete module_paths[module];
    }
  },
  printDBL: (ARGS) => {
    console.log(ARGS.label+": "+ARGS.content);
  },
  setlockedvar: (ARGS) => {
    if ((ARGS.name) in variables){
        variables[ARGS.name].value = ARGS.value;
        if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
        }
    }else{
      variables[ARGS.name] = {
        value: ARGS.value,
        locked: true,
        constant: false
      };
      if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
        }
      if (variables.showVarCreation.value){
        console.log(`Created varable: ${ARGS.name}`);
      }
    }
  },
  setlockedvar2: (ARGS) => {
    if ((ARGS.name) in variables && fns[ARGS.name]()){
        return fns[ARGS.name]();
    }else{
      variables[ARGS.name] = {
        value: ARGS.value,
        locked: true,
        constant: false
      };
      if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
        }
      if (variables.showVarCreation.value){
        console.log(`Created varable: ${ARGS.name}`);
      }
    }
  },
  getvar: (ARGS) => {
    if ((ARGS.name) in variables){
      return variables[ARGS.name].value
    }else{
      if (!ignore){
        console.log("\x1b[31m%s\x1b[0m",`ExecutionError: Unknown variable`);
        if (variables.stopOnError.value){
          process.exit();
        }
      }
    }
  },
  setvar: (ARGS) => {
    if (((ARGS.name) in variables)){
      if (!variables[ARGS.name].locked && !variables[ARGS.name].constant){
        variables[ARGS.name].value = ARGS.value;
        if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
        }
      }else if (variables[ARGS.name].locked){
        if (!ignore) {
          console.log("\x1b[31m%s\x1b[0m",`ExecutionError: Cannot write to a locked variable`);
          if (variables.stopOnError.value){
          process.exit();
          }
        }
      }else if (variables[ARGS.name].constant){
        if (!ignore) {
          console.log("\x1b[31m%s\x1b[0m",`ExecutionError: Cannot write to a constant.`);
          if (variables.stopOnError.value){
          process.exit();
          }
        }
      }
    }else{
     variables[ARGS.name] = {
        value: ARGS.value,
        locked: false,
        constant: false
      };
      if (!ARGS.name in fns){
        constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
      }
      if (variables.showVarCreation.value){
        console.log(`Created varable: ${ARGS.name}`);
      }
    }
  },
  constant: (ARGS) => {
    if (((ARGS.name) in variables)){
      if (!variables[ARGS.name].locked){
        variables[ARGS.name].value = ARGS.value;
        if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
        }
      }else{
        if (!ignore) {
          console.log("\x1b[31m%s\x1b[0m",`ExecutionError: Cannot write to a locked variable`);
          if (variables.stopOnError.value){
          process.exit();
          }
        }
      }
    }else{
     variables[ARGS.name] = {
        value: ARGS.value,
        locked: false,
        constant: true
      };
      if (!ARGS.name in fns){
        constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
      }
      if (variables.showVarCreation.value){
        console.log(`Created varable: ${ARGS.name}`);
      }
    }
  },
  setvar2: (ARGS) => {
    if (((ARGS.name) in variables) && fns[ARGS.name]()){
      return fns[ARGS.name]();
    }else{
     if (((ARGS.name) in variables)){
      if (!variables[ARGS.name].locked && !variables[ARGS.name].constant){
        variables[ARGS.name].value = ARGS.value;
        if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
          fns[ARGS.name] = () => ARGS.value
          }
        }else if (variables[ARGS.name].locked){
          if (!ignore) {
            console.log("\x1b[31m%s\x1b[0m",`ExecutionError: Cannot write to a locked variable`);
            if (variables.stopOnError.value){
            process.exit();
            }
          }
        }else if (variables[ARGS.name].constant){
          if (!ignore) {
            console.log("\x1b[31m%s\x1b[0m",`ExecutionError: Cannot write to a constant.`);
            if (variables.stopOnError.value){
            process.exit();
            }
          }
        }
      }else{
      variables[ARGS.name] = {
          value: ARGS.value,
          locked: false,
          constant: false
        };
        if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
          fns[ARGS.name] = () => ARGS.value
        }
        if (variables.showVarCreation.value){
          console.log(`Created varable: ${ARGS.name}`);
        }
      }
    }
  },
  error: (ARGS) => {
    if (!ignore) {
      console.log("\x1b[31m%s\x1b[0m",`ExecutionError: ${ARGS.txt}`);
      if (variables.stopOnError.value){
        process.exit();
      }
    }
  },
  warn: (ARGS) => {
    if (!ignore){
      console.log("\x1b[33;1m%s\x1b[0m",`ExecutionWarn: ${ARGS.txt}`);
      if (variables.stopOnWarn.value){
        process.exit();
      }
    }
  },
  EvalJS: (ARGS) => {
    try{
      return eval(ARGS.txt.trim("\n").trim())
    }catch(err){
      if (!ignore) {
        console.log("\x1b[31m%s\x1b[0m",`ExecutionError: ${err}`);
        if (variables.stopOnError.value){
          process.exit();
        }
      }
    }
  },
  EvalJS2: (ARGS) => {
    try{
      return eval(ARGS.txt)
    }catch(err){
      if (!ignore) {
        console.log("\x1b[31m%s\x1b[0m",`ExecutionError: ${err}`);
        if (variables.stopOnError.value){
          process.exit();
        }
      }
    }
  },
  EvalFn: (ARGS) => {
    return readFunction(ARGS.txt)
  },
  import: async (ARGS) => {
    let name = ARGS.n;
    var data = (ARGS.n.split("%MFOLDER%").join(__dirname + "/modules")).replaceAll("\\", "/").split("/"); 
    var m_n = (ARGS.n.split("%MFOLDER%").join(__dirname + "/modules")).replaceAll("\\", "/").split("/").splice(-1, 1)[0];
    module_paths[m_n] = (ARGS.n.split("%MFOLDER%").join(__dirname + "/modules")).replaceAll("\\", "/").split("/"); ;
    module_paths[m_n].pop();
    module_paths[m_n] = module_paths[m_n].join("/");
    var fs = require("fs");
    
    let program = fs.readFileSync(`${ARGS.n.split("%MFOLDER%").join(__dirname + "/modules")}${/*autoname*/false ? ".bclm" : ""}`).toString();
    let _l = compileLines(program,syntaxoptions);
    for(let [i, line] of _l.entries()) {
      await readFunction(line, 1, i)
    }
    //evalModule(program)
    /*constructors.pop()
    constructors.pop()
    constructors.pop()*/
    function newConstructor(fn,c) {
      constructors.push([fn, c]);
    }
    fns["constructor"] = (ARGS) => {
      newConstructor(ARGS.name,{
      paren: syntax.paren,
      quoteSets: ['"',"'",'`'],
      whitespace: [' ','  ','	','	'],
      c: ARGS.constructor,
      map: JSON.parse(ARGS.map),
      evalParams: JSON.parse(ARGS.evalParams)
      });
    };
  },
  executeFile: (ARGS) => {
    let program = fs.readFileSync(`${ARGS.fn}${autoname ? `.${fileType}` : ""}`).toString();
    filePath = path.resolve(`${ARGS.fn}${autoname ? `.${fileType}` : ""}`);
    let _l = compileLines(program,syntaxoptions);
    _l = compileLines(program,syntax);
    for(let [i, line] of _l.entries()) {
      readFunction(line, false, i);
    }
    filePath = path.resolve(scriptFile);
  },
  if: (ARGS) => {
    if (ARGS.bool) {
      let program = ARGS.then;
      let _l = compileLines(program,syntaxoptions);
      _l = compileLines(program,syntax);
      for(let [i, line] of _l.entries()) {
        readFunction(line, false, i);
      }
    } else {
      let program = ARGS.else;
      let _l = compileLines(program,syntaxoptions);
      _l = compileLines(program,syntax);
      for(let [i, line] of _l.entries()) {
        readFunction(line, false, i);
      }
    }
  },
  ifne: (ARGS) => {
    if (ARGS.bool) {
      let program = ARGS.then;
      let _l = compileLines(program,syntaxoptions);
      _l = compileLines(program,syntax);
      for(let [i, line] of _l.entries()) {
        readFunction(line, false, i);
      }
    }
  },
  wait: (ARGS) => {
    return new Promise(resolve => setTimeout(resolve, ARGS.ms));
  },
  add: (ARGS) => {
    if (typeof(ARGS.x) == "number" && typeof(ARGS.y) == "number"){
      return Number(ARGS.x) + Number(ARGS.y);
    } else {
      return String(ARGS.x) + String(ARGS.y)
    }
  },
  subtract: (ARGS) => {
    return Number(ARGS.x) - Number(ARGS.y);
  },
  multiply: (ARGS) => {
    return Number(ARGS.x) * Number(ARGS.y);
  },
  power: (ARGS) => {
    return Number(ARGS.x) ** Number(ARGS.y);
  },
  divide: (ARGS) => {
    return Number(ARGS.x) / Number(ARGS.y);
  },
  greaterthan: (ARGS) => {
    return Number(ARGS.x) > Number(ARGS.y)
  },
  lessthan: (ARGS) => {
    return Number(ARGS.x) < Number(ARGS.y)
  },
  equalto: (ARGS) => {
    return ARGS.x === ARGS.y
  },
  greaterthanequalto: (ARGS) => {
    return Number(ARGS.x) >= Number(ARGS.y)
  },
  lessthanequalto: (ARGS) => {
    return Number(ARGS.x) <= Number(ARGS.y)
  },
  joinStr: (ARGS) => {
    return (String(ARGS.x) + String(ARGS.y))
  },
  remainder: (ARGS) => {
    return Number(ARGS.x) % Number(ARGS.y)
  },
  savevars: (ARGS) => {
    var fs = require("fs");
    var obj = JSON.stringify(variables, null, "\t");
    obj = JSON.parse(obj);
    delete obj["return"];
    delete obj["args"];
    delete obj["write"];
    delete obj["append"];
    obj = JSON.stringify(obj, null, "\t");
    fs.writeFileSync(__dirname + "/variables.json", obj);
  },
  savedefvars: (ARGS) => {
    var fs = require("fs");
    var obj = JSON.stringify(variables, null, "\t");
    obj = JSON.parse(obj);
    delete obj["return"];
    delete obj["args"];
    delete obj["write"];
    delete obj["append"];
    obj = JSON.stringify(obj, null, "\t");
    fs.writeFileSync(__dirname + "/variablesdefault.json", obj);
  }
}
// Back to Actual Engine

variables.return = {
  locked: true,
  value: null
}
variables.args = {
  locked: true,
  value: {}
}

function allZero(arr) {
  for(let i in arr) {
    if(arr[i]!=0) {
      return false;
    }
  }
  return true;
}
//console.log(decodeParams('<@param1="a" @param2="b">', "param2", "param1"))
function decodeParams(paramstr, ...args) {
  //<@param1="a" @param2="b">
  var params_raw;
  if (paramstr.startsWith("<") && paramstr.endsWith(">")) {
    params_raw = paramstr.substring(1, paramstr.length-1);
  } else {
    throw "Invalid parameter syntax!"
  }
  var params = params_raw.split(" ");
  var params_return = [];
  for (var i = 0; i < params.length; i++){
    params[i] = params[i].split("=");
  }
  for (var j = 0; j < args.length; j++){
    for (var k = 0; k < params.length; k++){
      if (("@" + args[j]) == params[k][0]) {
        var str = params[k][1].match(/(['"])((\\\1|.)*?)\1/gm).join("");
        params_return[params_return.length] = str.substring(1, str.length-1)
      }
    }
  }
  return params_return;
}
//console.log(encodeParams({param1: "a", param2: "b"}))
function encodeParams(paramObject) {
  /*
    {
      param1: "a",
      param2: "b"
    }
  */
  var params_raw = "";
  for (const [key, value] of Object.entries(paramObject)) {
    params_raw += " @" + key + "=\"" + value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"") + "\"";
  }
  return "<" + params_raw.slice(1) + ">";
}
                
function splitFromConstructor(txt,c) {
  let p = [];
  for(let i in c.paren) {
    p.push(0);
  }
  let q = [];
  for(let i in c.quoteSets) {
    q.push(0);
  }
  let params = {};
  let j = 0;
  //if(!txt) {
    //console.log(txt);
    //throw Error(txt);
  //}
  for(let i=0; i<txt.length; i++) {
    if(txt[i] == c.c[j]) {
      j++;
    } else {
      if(c.c[j]=="$") {
        //i++;
        j+=2;
        params[c.c[j-1]] = ""
        while(!((txt[i]==c.c[j]||(i>txt.length-1))&&allZero(p)&&allZero(q))) {
          params[c.c[j-1]] += txt[i];
          if(allZero(q)) {
            for(let k in c.paren) {
              if(txt[i] == c.paren[k].open) {
                p[k] = p[k] + 1;
              }
              if(txt[i] == c.paren[k].close) {
                p[k] = p[k] - 1;
              }
            }
          }
          for(let k in c.quoteSets) {
            if(txt[i] == c.quoteSets[k]) {
              q[k] = 1 - q[k];
            }
          }
          if(i > txt.length+1) {
            //console.log(allZero(q),allZero(p));
            //throw Error("Past proper range; check that quotes and parentheses match.")
            if (!ignore) {
              console.log("\x1b[31m%s\x1b[0m",`ExecutionError: Past proper range; check that quotes and parentheses match.`);
              if (variables.stopOnError.value){
                process.exit();
              }
            }
          }
          i++;
        }
        i--;
      } else {
        throw ("Incorrect constructor")
      }
    }
  } 
  return params;
}

function mapParam(map,param) {
  for(let jkl=0; jkl<map.length; jkl++) {
    if(map[jkl][0]==param) {
      return map[jkl][1];
    }
  }
  return '[UN-NAMED PARAMS]';
}

function readFunction(txt, lvl, ln) {
  var constructors_joined = constructors;
  for (var i = 0; i < importedModules.length; i++) {
    var arr = m_constructors[importedModules[i][0]];
    for (var j = 0; j < arr.length; j++) {
      constructors_joined.push(arr[j]);
    }
  }
  if (txt === "") {
    return "";
  }

  let curr = {};
  let fn = '';
  let map = [];
  let evalParams = false;

  for (let l = 0; l < constructors_joined.length; l++) {
    try {
      curr = splitFromConstructor(txt, constructors_joined[l][1]);
      fn = constructors_joined[l][0];
      if ((lvl === 0 && (fn === "name" || fn === "native" || fn === "constructor" || fn === "setlockedvar" || fn === "setlockedvar2" || fn === "savedefvars." || fn === "savedefvars")) || (lvl === 1 && (fn === "setlockedvar" || fn === "setlockedvar2" || fn === "savedefvars." || fn === "savedefvars")) || (lvl === 2 && (false))) {
        if (!ignore) {
          console.log("\x1b[31m%s\x1b[0m", `ExecutionError: Function does not exist (L${ln}): \n\n${txt}\n`);
          if (variables.stopOnError.value) {
            process.exit();
          }
        }
      }
      evalParams = constructors_joined[l][1].evalParams;
      map = constructors_joined[l][1].map;
    } catch(err) {
      if (err === 'Incorrect constructor') {
        continue;
      } else if (constructors_joined[l] === null || constructors[l] === undefined) {
        if (!ignore) {
          console.log("\x1b[31m%s\x1b[0m", `ExecutionError: Function does not exist (L${ln}): \n\n${txt}\n`);
          if (variables.stopOnError.value) {
            process.exit();
          }
        }
      } else {
        if (!ignore) {
          console.log("\x1b[31m%s\x1b[0m", `ExecutionError: ${err} (L${ln}): \n\n${txt}\n`);
          if (variables.stopOnError.value) {
            process.exit();
          }
        }
      }
    }
  }

  let ncurr = {};

  for (let l in curr) {
    ncurr[mapParam(map, l)] = curr[l];
  }

  if (evalParams) {
    for (let l of evalParams) {
      ncurr[l] = readFunction(ncurr[l]);
    }
  }

  if (fn !== '' && fn !== "input") {
    try {
      var data = fns[fn](ncurr);
      return data;
    } catch(err) {
      if (!ignore) {
        console.log("\x1b[31m%s\x1b[0m", `ExecutionError: Function does not exist (L${ln}): \n\n${txt}\n`);
        if (variables.stopOnError.value) {
          process.exit();
        }
      }
    }
  } else if (fn === "input") {
    return prompt(ncurr.prompt);
  } else {
    if (!ignore) {
      console.log("\x1b[31m%s\x1b[0m", `ExecutionError: Function does not exist (CODE-BLOCK_ID::${ln}): \n\n\x1b[1m\x1b[31m${txt}\n`);
      if (variables.stopOnError.value) {
        process.exit();
      }
    }
  }
}


function compileLines(txt,c) {
  let code;
  if(c.indents) {
  let stuff = txt.split('\n');
  let indentLevel = 0;
  for(let jkl in stuff) {
    for(let counter = 0; counter<indentLevel; counter++) {
      if(stuff[jkl].search(c.indents)==-1) {
        indentLevel = counter;
        //stuff[jkl] = "}" + stuff[jkl];
        stuff[jkl-1] += "\n}"
      } else {
        stuff[jkl] = stuff[jkl].replace(c.indents,'');
      }
    }
    if(stuff[jkl].search(c.indents)!=-1) {
      indentLevel++;
      stuff[jkl] = stuff[jkl].replace(c.indents,"");
      stuff[jkl-1] += " {"
    }
  }
  code = stuff.join('\n');
  //console.log(code);
  } else {
  code = txt;
  }

  let lines = [''];
  let p = [];
  for(let i in c.paren) {
    p.push(0);
  }
  let q = [];
  for(let i in c.quoteSets) {
    q.push(0);
  }
  for(let j=0; j<code.length; j++) {
    lines[lines.length-1] += code[j];
  if(allZero(q)) {
    for(let k in c.paren) {
      if(code[j] == c.paren[k].open) {
        p[k] = p[k] + 1;
      }
      if(code[j] == c.paren[k].close) {
        p[k] = p[k] - 1;
      }
    }
  }
  for(let k in c.quoteSets) {
    if(code[j] == c.quoteSets[k]) {
      q[k] = 1 - q[k];
    }
  }
  if(allZero(q)&&allZero(p)&&code[j]==c.lineend) {
    //console.log(q,p);
    lines.push('');
  }
  
  }
  lines = lines.map(n=>{
    let z = n;
    for(let xyz in c.whitespace) {
    while(z.search(c.whitespace[xyz])==0) {
      z = z.trim(c.whitespace[xyz]);
    }
    }
    z = z.trim("\n");
    return z;
  });
  return lines;


}

//let fs = require('fs');
/* Read language program */
var read = async () => {
  try {
    let program = fs.readFileSync(__dirname + '/language').toString();
    let _l = compileLines(program, syntaxoptions);
    for (let [i, line] of _l.entries()) {
      await readFunction(line, 2, i + 1);
    }
    console.log('\x1b[47m\x1b[30m%s\x1b[0m', `BaCoLa ${variables.version.value}`);
    /* Read program */
    program = fs.readFileSync(scriptFile).toString();
    _l = compileLines(program, syntax);

    for (let [i, line] of _l.entries()) {
      await readFunction(line, variables.executionLevel.value, i + 1);
    }
  } catch (err) {
    if (!ignore) {
      console.log("\x1b[31m%s\x1b[0m", `ExecutionError: ${err}`);
      if (variables.stopOnError.value) {
        process.exit();
      }
    }
  }
};

read();