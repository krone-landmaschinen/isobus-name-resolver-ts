# isobus-name-resolver-ts

![Build Node.js package](https://github.com/krone-landmaschinen/isobus-name-resolver-ts/workflows/Build%20Node.js%20package/badge.svg)

**The ISOBUS** ([ISO 11783](https://en.wikipedia.org/wiki/ISO_11783)) standard specifies a serial data network
for control and communications on forestry and agricultural machines. Every control function in an ISOBUS network
has a unique NAME (defined in ISO 11783-5) that contains information on that function, such as a manufacturer code and 
a device class

**isobus-name-resolver-ts** is a typescript library for parsing such a ISOBUS NAME and providing its seperate fields as
raw values, as well as corresponding labels if available


## Usage

### Installation

The package can be installed via [npm](https://www.npmjs.com/package/isobus-name-resolver-ts):
```
npm install isobus-name-resolver-ts
```

### Example

In order to parse an ISOBUS NAME, simply instantiate an object of the class `IsobusName` with the NAME in hexadecimal
notation or as a buffer as the only parameter
```typescript
import {IsobusName} from 'isobus-name-resolver-ts';

const hexInput = 'A01284000DE0C3FF';
const isobusName = new IsobusName(hexInput);

console.log(isobusName.toString());
/* OUTPUT:
 * -------------
 * ISOBUS Name String: A01284000DE0C3FF
 * Device Class: Forage (9)
 * Manufacturer Code: Bernard Krone Holding SE & Co. KG (formerly Maschinenfabrik Bernard Krone GmbH) (111)
 * Identity Number: 50175
 * ECU Instance: 0
 * Function Instance: 0
 * Function: Forage Machine Control (132)
 * Device Class Instance: 0
 * Industry Group: Agricultural and Forestry Equipment (2)
 * Self Configurable Address: true
*/
```
**Attention:** this package uses the browser compatible [`buffer`](https://github.com/feross/buffer) instead of the node.js
buffer. In order to instantiate an `IsobusName` by a `Buffer` object, this package has to be used, e.g.:
```typescript
// tell node js to use external package 'buffer' by adding trailing slash
import {Buffer} from 'buffer/';
let buf = Buffer.from("A01284000DE0C3FF", "hex");
let isoName = new IsobusName(buf);
```

### API

#### Class `IsobusName`:

|   Method                              | return value |        description                                                                                 |
|---------------------------------------|----------|--------------------------------------------------------------------------------------------------------|
|`toString()`                           | `string` | returns a human readable string representation of all parts of the ISOBUS NAME                         |
|`getDeviceClass()`                     | `number` | returns the raw device class value (sometimes called vehicle system)                                   |
|`getDeviceClassLabel()`                | `string` | returns the device class description of the device class in the given industry group                   |
|`getDeviceClassInstance()`             | `number` | returns the device class instance                                                                      |
|`getManufacturerCode()`                | `number` | returns the raw manufacturer code value (sometimes called manufacturer id)                             |
|`getManufacturerCodeLabel()`           | `string` | returns the manufacturer name of the manufacturer                                                      |
|`getIdentityNumber()`                  | `number` | returns the identity number assigned by the manufacturer                                               |
|`getEcuInstance()`                     | `number` | returns the ecu instance                                                                               |
|`getFunction()`                        | `number` | returns the raw function value                                                                         |
|`getFunctionLabel()`                   | `string` | returns the function description of the function in the given device class in the given industry group |
|`getFunctionInstance()`                | `number` | returns the function instance                                                                          |
|`getIndustryGroup()`                   | `number` | returns the raw industry group value                                                                   |
|`getIndustryGroupLabel()`              | `string` | returns the industry group description                                                                 |
|`getSelfConfigurableAddress()`         | `number` | returns the raw self-configurable address value (either 1 or 0)                                        |
|`getSelfConfigurableAddressLabel()`    | `string` | returns either `'true'` or `'false'` (string) wether the the CF is self-configurable or not            |
|`getIsoNameString()`                   | `string` | returns the raw ISOBUS NAME string used to instantiate the object                                      | 


----

## Development

### Local Development

At first the dependencies should be installed using:
```
npm install
```

For all functions returning a label, the isobus-name-resolver relies on the external data from [isobus.net](https://www.isobus.net/isobus/),
so before being able to build the package locally, the ISOBUS Parameters have to be exported from this page ([direct download link](https://www.isobus.net/isobus/attachments/isoExport_csv.zip)).
The downloaded zip file has to be extracted into the `/isoExport` folder of this project. The resulting CSV files
can be transformed into the needed JSON file (`/src/isoData.json`) by executing:
```
npm run translate-iso-export
```

Afterwards, the package can be built (transpiled) using:
```
npm run tsc
```
This will create the source files of the npm package in `/dist`.

The last two commands can be combined by:
```
npm run build
```

### Automated build

The package is automatically built, versioned and published using github actions on the following occasions:
* A Push on master, e.g when a pull request is merged -> minor version increase
* Scheduled every week only if the exported ISOBUS parameters changed -> patch version increase

The needed isobus.net export is downloaded automatically as well
