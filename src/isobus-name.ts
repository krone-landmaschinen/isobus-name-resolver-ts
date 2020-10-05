import {Buffer} from 'buffer/';
import * as isoData from './isoData.json';

export class IsobusName {
    private readonly nameString: string;
    private readonly dataBuffer: Buffer = Buffer.alloc(8);

    constructor(isobusname: string | Buffer) {

        if(Buffer.isBuffer(isobusname)) {
            isobusname = isobusname.toString('hex');
        } else if(typeof isobusname === 'object') {
            throw new TypeError('parameter "isobusname" is not a valid buffer, use https://github.com/feross/buffer');
        }
        this.nameString = isobusname;

        if (this.nameString.match(new RegExp(/^[A-Fa-f0-9]+$/i)) == null || this.nameString.length !== 16) {
            throw new RangeError('Invalid ISOBUS NAME given. It must be a 64 bit number.');
        }

        this.dataBuffer.writeUInt32LE(parseInt(this.nameString.substring(0, 8), 16), 4);
        this.dataBuffer.writeUInt32LE(parseInt(this.nameString.substring(8, 16), 16), 0);
    }

    public toString(): string {
        let str = 'ISOBUS Name String: ' + this.nameString + '\n';
        str += 'Device Class: ' + this.getDeviceClassLabel() + ' (' + this.getDeviceClass() + ')\n';
        str += 'Manufacturer Code: ' + this.getManufacturerCodeLabel() + ' ('+this.getManufacturerCode() + ')\n';
        str += 'Identity Number: ' + this.getIdentityNumber() + '\n';
        str += 'ECU Instance: ' + this.getEcuInstance() + '\n';
        str += 'Function Instance: ' + this.getFunctionInstance() + '\n';
        str += 'Function: ' + this.getFunctionLabel() + ' (' + this.getFunction() + ')\n';
        str += 'Device Class Instance: ' + this.getDeviceClassInstance() + '\n';
        str += 'Industry Group: ' + this.getIndustryGroupLabel() + ' (' + this.getIndustryGroup() + ')\n';
        str += 'Self Configurable Address: ' + this.getSelfConfigurableAddressLabel() + '\n';
        return str;
    }

    public getDeviceClass(): number {
        let byte7 = this.getByte(6);

        return byte7 >> 1;
    }

    public getDeviceClassLabel(): string {
        return isoData.industryGroups?.[this.getIndustryGroup()]?.vehicleSystems?.[this.getDeviceClass()]?.label;
    }

    public getManufacturerCode(): number {
        let byte3 = this.getByte(2);
        let byte4 = this.getByte(3);

        return (byte4 << 3) | 0b111 & (byte3 >> 5);
    }

    public getManufacturerCodeLabel(): string {
        return isoData.manufacturers?.[this.getManufacturerCode()]?.label;
    }

    public getIdentityNumber(): number {
        let byte1 = this.getByte(0);
        let byte2 = this.getByte(1);
        let byte3 = this.getByte(2);

        return byte1 | byte2 << 8 | (0b11111 & byte3) << 16;
    }

    public getEcuInstance(): number {
        let byte5 = this.getByte(4);

        return byte5 & 0b111;
    }

    public getFunctionInstance(): number {
        let byte5 = this.getByte(4);

        return (byte5 >> 3) & 0b11111;
    }

    public getFunction(): number {
        return this.getByte(5);
    }

    public getFunctionLabel(): string {
        if(isoData.independentFunctions.hasOwnProperty(this.getFunction())) {
            return isoData.independentFunctions[this.getFunction()]?.label;
        } else {
            return isoData.industryGroups?.[this.getIndustryGroup()]
                ?.vehicleSystems?.[this.getDeviceClass()]
                ?.functions?.[this.getFunction()]?.label;
        }
    }

    public getDeviceClassInstance(): number {
        let byte8 = this.getByte(7);

        return byte8 & 0b1111;
    }

    public getIndustryGroup(): number {
        let byte8 = this.getByte(7);

        return (byte8 >> 4) & 0b111;
    }

    public getIndustryGroupLabel(): string {
        return isoData.industryGroups?.[this.getIndustryGroup()]?.label;
    }

    public getSelfConfigurableAddress(): number {
        let byte8 = this.getByte(7);

        return (byte8 >> 7) & 0b1;
    }

    public getSelfConfigurableAddressLabel(): string {
        return (this.getSelfConfigurableAddress() === 1 ? 'true' : 'false');
    }

    public getIsoNameString(): string {
        return this.nameString;
    }

    private getByte(bytenum: number): number {
        return this.dataBuffer.readUInt8(bytenum);
    }
}
