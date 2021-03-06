require('approvals').mocha();
const fs = require('fs');
const logic2puml = require('../logicapp-to-plantuml');

describe("converting logic apps to plantuml", function() {

    it("generates full activity diagram", function() {

        const input = fs.readFileSync('./test/logicapp.json');
        let puml = logic2puml.convert(input);

        puml = puml.replace(/\n/gi, '\r\n');
        this.verify(puml, "puml");

    });

    it("sorts complex steps by run after", function() {

        const input = fs.readFileSync('./test/complex-sort.json');
        let puml = logic2puml.convert(input);

        puml = puml.replace(/\n/gi, '\r\n');
        this.verify(puml, "puml");

    });

    it("forks parallel branches", function() {

        const input = fs.readFileSync('./test/parallel.json');
        let puml = logic2puml.convert(input);

        puml = puml.replace(/\n/gi, '\r\n');
        this.verify(puml, "puml");

    });
});