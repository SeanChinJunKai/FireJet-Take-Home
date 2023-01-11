"use strict";
exports.__esModule = true;
var fs = require("fs");
var babel_parser = require("@babel/parser");
var t = require("@babel/types");
var traverse_1 = require("@babel/traverse");
var prettier = require("prettier");
var filePath = "./sample.ts";
//  reads the file located at filePath and returns its contents as a string
var fileContent = fs.readFileSync(filePath, 'utf8');
// parses the string from filecontent into an Abstract Syntax Tree
var ast = babel_parser.parse(fileContent, {
    sourceType: 'module',
    plugins: ['typescript']
});
function lint(code) {
    return prettier.format(code, { "parser": "babel" });
}
(0, traverse_1["default"])(ast, {
    enter: function (path) {
        var node = path.node;
        if (t.isTemplateLiteral(node)) {
            if (node.leadingComments) {
                var tsxComments = node.leadingComments.filter(function (comment) { return comment.value === "tsx"; });
                if (tsxComments.length > 0) {
                    var linted = lint(node.quasis[0].value.raw);
                    console.log(linted);
                }
            }
        }
    }
});
