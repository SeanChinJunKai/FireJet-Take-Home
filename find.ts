import * as fs from 'fs';
import * as t from "@babel/types";
import * as babel_parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as prettier from "prettier";


const filePath = "./sample.ts";

//  reads the file located at filePath and returns its contents as a string
const fileContent = fs.readFileSync(filePath, 'utf8');

// parses the string from filecontent into an Abstract Syntax Tree (AST)
const ast = babel_parser.parse(fileContent, {
    sourceType: 'module',
    plugins: ['typescript']
});

async function lint(code: string) {
    return prettier.format(code, {"parser" : "babel"});

}
async function updateAST(oldAST: t.Program): Promise<t.Program> {
    traverse(oldAST, {
        enter: async (path) => {
            const node = path.node;
            if (t.isTemplateLiteral(node)) {
                if (node.leadingComments) {
                    const tsxComments = node.leadingComments.filter(comment => comment.value === "tsx");
                    if (tsxComments.length > 0) {
                        const updatedLiteral = await lint(node.quasis[0].value.raw)
                        node.quasis[0].value.raw = updatedLiteral
                    }
                }
            }
        }
    })
    return oldAST
}


updateAST(ast.program).then(result => console.log(result))