export default{
 data:[
  'alert',
  'bind',  
  'case',
  'catch',
  'char',
  'charAt',  
  'concat',  
  'continue',
  'console.assert',
  'console.clear', 
  'console.info',  
  'console.log',
  'console.warn',
  'default',
  'double',
  'else',
  'eval',
  'for',
  'filter',  
  'function',
  'if',
  'in',
  'indexOf',
  'let',
  'new',
  'return',
  'slice',
  'splice',
  'String',
  'this',
  'throw',
  'toString',
  'trim',
  'try',
  'typeOf',
  'var',
  'while'
 ],

 showHelp:[
  'Features:',
  '1. Console like functionality',
  '2. To check history use ":history"',
  '3. To clear console use "console.clear()"',
  'Limitations as of now:',
  '1. Unable to use up/down arrow keys on the textarea to go back to the previous command.',
  '2. Autocomplete dropdown list is not exhaustive.'
]    
,

  genCharArray:function(charA, charZ) {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
  },
  hasWhiteSpace(s) {
    return s.indexOf(' ');
  }
}

