import * as fs from 'fs';
import * as babel_parser from '@babel/parser';
import * as t from "@babel/types";
import traverse from '@babel/traverse';
import * as prettier from "prettier"

const filePath = "./sample.ts";


//  reads the file located at filePath and returns its contents as a string
const fileContent = fs.readFileSync(filePath, 'utf8');

// parses the string from filecontent into an Abstract Syntax Tree
const ast = babel_parser.parse(fileContent, {
    sourceType: 'module',
    plugins: ['typescript']
});

 function lint(code: string) {
    return prettier.format(code, {"parser" : "babel"});
}


traverse(ast, {
    enter(path) {
        const node = path.node;
        if (t.isTemplateLiteral(node)) {
            if (node.leadingComments) {
                const tsxComments = node.leadingComments.filter(comment => comment.value === "tsx");
                if (tsxComments.length > 0) {
                    const linted = lint(node.quasis[0].value.raw)
                    console.log(linted)
                }
            }
        }
    }
});

