#!/usr/bin/env node

var ClosureCompiler = require('google-closure-compiler').compiler

//console.log(ClosureCompiler.COMPILER_PATH) // absolute path the compiler jar
//console.log(ClosureCompiler.CONTRIB_PATH) // absolute path the contrib folder which contains

var infile = process.argv.slice(2).pop()
var closureCompiler = new ClosureCompiler({
  js: infile,
  env: 'BROWSER',
  externs: 'externs.js',
  language_in: 'ECMASCRIPT_2016',
  language_out: 'ECMASCRIPT5',
  js_output_file: infile.replace(/\.js$/, '-opt.js'),
  compilation_level: 'ADVANCED',
  new_type_inf: true,
  assume_function_wrapper: true
})

var compilerProcess = closureCompiler.run(function(exitCode, stdOut, stdErr) {
  if (exitCode === 0) console.log(stdOut)
  console.log('---------------')
  console.log(stdErr)
})
