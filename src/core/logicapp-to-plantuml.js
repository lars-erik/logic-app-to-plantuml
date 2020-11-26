const colors = {
    turqouise: '#d9eced',
    blue: '#c4e2ff',
    lightPurple: '#edeafe',
    purple: '#eadef8',
    grey: '#d9dadb',
    red: '#fedcdb'
};

const typeColors = {
    'Http': colors.turqouise,
    'InitializeVariable': colors.purple,
    'SetVariable': colors.purple,
    'Switch': colors.grey,
    'If': colors.grey,
    'ForEach': colors.blue,
    'Compose': colors.lightPurple,
    'ApiConnection': colors.blue,
    'Default': colors.grey,
    'Terminate': colors.red
};

function niceName(container) {
    return container.key.replace(/_/gi, ' ').trim();
}

function activityUml(container) {
    return `${typeColors[container.type] || ''}:<i>${container.type}</i>\n${niceName(container)};\n`;
}

function actionsToArray(actions) {
    return Object
        .keys(actions)
        .map(key => Object.assign({}, actions[key], { key: key }));
}

function chainSequence(next, actionsArray) {
    let output = [];
    if (next.length > 1) {
        for (let i = 0; i < next.length; i++) {
            output.push(`fork${i>0?'again':''}\n`);
            output.push(chainUml(next[i], actionsArray));
        }
        output.push('endfork\n');
    } else if (next.length > 0) {
        output.push(chainUml(next[0], actionsArray));
    }

    return output.join('');
}

function chainUml(action, actionsArray) {
    let output = [],
        next = actionsArray.filter(x => Object.keys(x.runAfter).indexOf(action.key) > -1);
    output.push(generateUml(action));
    output.push(chainSequence(next, actionsArray));
    return output.join('');
}

function sequenceUml(container) {
    let asArray = actionsToArray(container.actions),
        next = asArray.filter(x => Object.keys(x.runAfter).length === 0);
    return chainSequence(next, asArray);
}

function switchUml(container) {
    return [
        Object
        .keys(container.cases)
        .map((key, index) =>
            (index > 0 ? "elseif" : "if") +
            ` (${niceName(container)}) then (${key})\n  ` +
            sequenceUml(container.cases[key])
        )
        .join(''),
        container.default ?
        "else (default)\n  " +
        sequenceUml(container.default) :
        "",
        "endif\n"
    ].join('');
}

function terminateUml(container) {
    return activityUml(container) + "stop\n";
}

function foreachUml(container) {
    return [
        `while (${niceName(container)})\n`,
        sequenceUml(container),
        `endwhile\n`
    ].join('');
}

function ifUml(container) {
    return `if (${niceName(container)}) then
            ${sequenceUml(container)}
        ${container.else ? 'else' : ''}
            ${sequenceUml(container.else || { actions: {} })}
        endif
        `;
}

function triggerUml(container) {
    return [
        Object.keys(container.triggers)
        .map((triggerKey, index) => [
            'fork',
            index > 0 ? 'again' : '',
            '\n',
            `${typeColors[container.triggers[triggerKey].kind] || ''}`,
            `:${container.triggers[triggerKey].kind} ${container.triggers[triggerKey].type};\n`
        ].join(''))
        .join(''),
        'endfork\n'
    ].join('');
}

function rootUml(container) {
    return [
        triggerUml(container),
        sequenceUml(container)
    ].join('');
}

function generateUml(container) {
    switch (container.type || "Root") {
        case 'Root':
            return rootUml(container);
        case 'Switch':
            return switchUml(container);
        case 'Terminate':
            return terminateUml(container);
        case 'Foreach':
            return foreachUml(container);
        case 'If':
            return ifUml(container);
        default:
            return activityUml(container);
    }
}

function convert(data) {
    let app = JSON.parse(data);
    //let model = buildTree(app.definition.actions);
    //console.log(util.inspect(model, true, null, true));
    let output = [
        '@startuml\n',
        `!$defaultBg = '#d9dadb'
!$borderColor = '#999a9b'
!$darkColor = '#494a4b'
skinparam ActivityDiamondBackgroundColor $defaultBg
skinparam ActivityDiamondBorderColor $borderColor
skinparam ActivityBorderColor $borderColor
skinparam ArrowColor $darkColor
skinparam ActivityBarColor $darkColor
skinparam ActivityStartColor $darkColor
skinparam ActivityEndColor $darkColor
`,
        'start\n',
        generateUml(app.definition),
        'stop\n',
        '@enduml'
    ].join('');
    return output;
}

module.exports = {
    convert
}