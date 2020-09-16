const fs = require('fs');
const csvParse = require('csv-parse/lib/sync');

const keyValueInputs =
    [
        {name: 'manufacturers', path: __dirname + '/../isoExport/Manufacturer IDs.csv', idColumn: 0, labelColumn: 1},
        {name: 'industryGroups', path: __dirname + '/../isoExport/Industry Groups.csv', idColumn: 0, labelColumn: 1},
        {name: 'independentFunctions', path: __dirname + '/../isoExport/Global NAME Functions.csv', idColumn: 0, labelColumn: 1}
    ];

const isobusFunctionsInputPath = __dirname + '/../isoExport/IG Specific NAME Function.csv';

let resultObject = {};

// parse simple key value data from csv files
for(const input of keyValueInputs) {
    const raw = fs.readFileSync(input.path).toString();
    const csvObject = csvParse(raw, {delimiter: ','});

    resultObject[input.name] = {};

    for(let i = 1; i < csvObject.length; i++) {
        const row = csvObject[i];

        resultObject[input.name][row[input.idColumn]] = {label: row[input.labelColumn]};
    }
}


const rawIsobusFunctions = fs.readFileSync(isobusFunctionsInputPath).toString();
const isobusFunctionsCsvObject = csvParse(rawIsobusFunctions, {delimiter: ','});

// the following CSV contains hierarchical data
for(let i = 1; i < isobusFunctionsCsvObject.length; i++) {
    const row = isobusFunctionsCsvObject[i];
    const industryGroupId = row[0];
    const vehicleSystemId = row[1];
    const vehicleSystemDescription = row[2];
    const functionId = row[3];
    const functionDescription = row[4];

    // each industry group has multiple vehicleSystems which have multiple functions
    if(resultObject.industryGroups.hasOwnProperty(industryGroupId)) {
        if(resultObject.industryGroups[industryGroupId].hasOwnProperty('vehicleSystems')) {
            if(resultObject.industryGroups[industryGroupId].vehicleSystems.hasOwnProperty(vehicleSystemId)) {
                if(resultObject.industryGroups[industryGroupId].vehicleSystems[vehicleSystemId].functions.hasOwnProperty(functionId)) {
                    throw new Error('duplicate function');
                } else {
                    resultObject.industryGroups[industryGroupId].vehicleSystems[vehicleSystemId].functions[functionId] = {label: functionDescription};
                }
            } else  {
                resultObject.industryGroups[industryGroupId].vehicleSystems[vehicleSystemId] = {label: vehicleSystemDescription, functions: {}};
            }
        } else {
            resultObject.industryGroups[industryGroupId].vehicleSystems = {};
        }

    } else {
        throw new Error('unknown industry Group '+industryGroupId);
    }
}


fs.writeFileSync(__dirname + '/../src/isoData.json', JSON.stringify(resultObject, null, 2));
