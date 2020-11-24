const logic2uml = require('logic-app-to-plantuml');

function main() {

    const fs = require('fs');

    let data = fs.readFileSync(process.argv[2]);
    let output = logic2uml.convert(data);

    console.log(output);

    fs.writeFileSync(process.argv[3], output);

}

main();