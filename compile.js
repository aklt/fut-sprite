#!/usr/bin/env node

var ClosureCompiler = require('google-closure-compiler').compiler

var args = process.argv.slice(2)

if (args.length !== 2) {
  console.warn('Usage: compile.js <infile> <outfile>')
  process.exit(0)
}

var infile = args[0]
var outfile = args[1]

var closureCompiler = new ClosureCompiler({
  js: infile,
  env: 'BROWSER',
  externs: 'externs.js',
  language_in: 'ECMASCRIPT_2016',
  language_out: 'ECMASCRIPT5',
  js_output_file: outfile,
  compilation_level: 'ADVANCED',
  new_type_inf: true,
  assume_function_wrapper: true
})

var compilerProcess = closureCompiler.run(function(exitCode, stdOut, stdErr) {
  if (exitCode === 0) console.log(stdOut)
  console.log('---------------')
  console.log(stdErr)
})
