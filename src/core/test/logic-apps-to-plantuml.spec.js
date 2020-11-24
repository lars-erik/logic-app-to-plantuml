const { verify } = require('crypto');

require('approvals').mocha();
const fs = require('fs');

describe("converting logic apps to plantuml", function() {

    it("generates full activity diagram", function() {

        const input = fs.readFileSync('./test/logicapp.json');
        const obj = JSON.parse(input);
        console.log(obj);

        this.verify(obj);

    });

});