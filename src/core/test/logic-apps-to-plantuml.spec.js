require('approvals').mocha();
const fs = require('fs');
const logic2puml = require('../logicapp-to-plantuml');

describe("converting logic apps to plantuml", function() {

    it("generates full activity diagram", function() {

        const input = fs.readFileSync('./test/logicapp.json');
        const puml = logic2puml.convert(input);

        this.verify(puml);

    });
});