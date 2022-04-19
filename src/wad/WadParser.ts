/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// From https://raw.githubusercontent.com/PROPHESSOR/Boom2UDMF/master/src/Boom2UDMF/WadParser.js

import ByteTools from './ByteTools';
import { FilePermission, FileStat, FileType } from "vscode";

const setImmediate = (): Promise<void> => new Promise((res) => setTimeout(() => res(), 0));

export class WadLump {
  constructor(
    private readonly wadBuffer: ByteTools,
    public readonly pos: number,
    public readonly size: number,
    public readonly name: string,
    public readonly index: number
  ) { }

  read() {
    return new ByteTools(this.wadBuffer.buffer.slice(this.pos, this.pos + this.size));
  }
}

export class WadParser {
  private type: 'IWAD' | 'PWAD' | null = null;
  private lumps: WadLump[] | null = null;

  constructor(private readonly buffer: ByteTools) { }

  async parse() {
    const type = this.buffer.readString(4);

    if (!['IWAD', 'PWAD'].includes(type)) throw new Error('Not a WAD file!');

    this.type = (type as 'IWAD' | 'PWAD');

    const numLumps = this.buffer.readUInt32LE();

    console.log(`Wad contains ${numLumps} lumps`);

    const dirTableOffset = this.buffer.readUInt32LE();

    console.log(`Wad table offset: ${dirTableOffset}`);

    this.buffer.seek(dirTableOffset, 'START');

    this.lumps = [];

    for (let i = 0; i < numLumps; i++) {
      const start = this.buffer.readUInt32LE();
      const size = this.buffer.readUInt32LE();
      const name = this.buffer.readString(8);

      this.lumps.push(new WadLump(this.buffer, start, size, name, i));
    }

    console.log(`Parsed ${this.lumps.length} lumps`);

    await setImmediate();
  }

  fileStat(url: string): FileStat {
    return {
      ctime: Date.now(),
      mtime: Date.now(),
      size: 100,
      type: FileType.File,
      permissions: FilePermission.Readonly
    }
  }

  /**
   *
   * @param {WadLump[]} lumps
   * @param {string} name
   */
  static getLumpsByName(lumps: WadLump[], name: string) {
    return lumps.filter((x) => x.name === name);
  }

  /**
   *
   * @param {string} name
   * @returns {WadLump[]}
   */
  getLumpsByName(name: string) {
    if (!this.lumps) throw new Error('Not initialized');

    return WadParser.getLumpsByName(this.lumps, name);
  }

  getMaps() {
    if (!this.lumps) throw new Error('Not initialized');

    const REGEXP_MAP = /^(MAP\d+)|(E\dM\d)$/;

    return this.lumps.filter((x) => REGEXP_MAP.test(x.name));
  }

  getMapLumps(index: number) {
    if (!this.lumps) throw new Error('Not initialized');

    const slice = this.lumps.slice(index);

    const [THINGS] = WadParser.getLumpsByName(slice, 'THINGS');
    const [LINEDEFS] = WadParser.getLumpsByName(slice, 'LINEDEFS');
    const [SIDEDEFS] = WadParser.getLumpsByName(slice, 'SIDEDEFS');
    const [VERTEXES] = WadParser.getLumpsByName(slice, 'VERTEXES');
    const [SECTORS] = WadParser.getLumpsByName(slice, 'SECTORS');

    return {
      THINGS,
      LINEDEFS,
      SIDEDEFS,
      VERTEXES,
      SECTORS,
    };
  }
}

export class WadGeneratorLump {
  public readonly name: string;
  public data: string;
  public readonly dataEnc: Uint8Array;
  public offset: number | null;

  constructor(name: string, data: string) {
    if (name.length > 8) throw new Error('Lump name must be <= 8 symbols');
    this.name = name.padEnd(8, '\x00');
    this.data = data;
    this.dataEnc = new TextEncoder().encode(data);
    this.offset = null;
  }

  /**
   *
   * @param {number} offset
   */
  setOffset(offset: number) {
    this.offset = offset;
  }
}

export class WadGenerator {
  public readonly type = 'PWAD';
  public readonly lumps: WadGeneratorLump[] = [];

  addLump(lump: WadGeneratorLump) {
    this.lumps.push(lump);
  }

  generate() {
    const encoder = new TextEncoder();

    const sizeHeader = 12;
    const sizeDir = this.lumps.length * 16;
    let sizeData = 0;

    let offset = sizeHeader + sizeDir;

    this.lumps.forEach((lump) => {
      sizeData += lump.dataEnc.length;
      lump.setOffset(offset);
      offset += lump.dataEnc.length;
    });

    const arrayBuffer = new ArrayBuffer(sizeHeader + sizeDir + sizeData);
    const buffer = new DataView(arrayBuffer);

    offset = 0;

    // Header
    const type = encoder.encode(this.type);

    type.forEach((byte) => {
      buffer.setUint8(offset, byte);
      offset += 1;
    });

    buffer.setUint32(offset, this.lumps.length, true);
    offset += 4;
    buffer.setUint32(offset, sizeHeader, true); // data position
    offset += 4;

    if (offset !== sizeHeader) throw new Error('Wad generation error');

    // Directory
    this.lumps.forEach((lump) => {
      const pos = lump.offset;
      const size = lump.dataEnc.length;
      const name = encoder.encode(lump.name);

      if (pos === null) throw new Error('Not initialized')

      buffer.setUint32(offset, pos, true);
      offset += 4;
      buffer.setUint32(offset, size, true);
      offset += 4;
      name.forEach((byte) => {
        buffer.setUint8(offset, byte);
        offset += 1;
      });
    });

    if (offset !== sizeHeader + sizeDir) throw new Error('Wad generation error');

    this.lumps.forEach((lump) => {
      lump.dataEnc.forEach((byte) => {
        buffer.setUint8(offset, byte);
        offset += 1;
      });
    });

    return buffer;
  }
}
