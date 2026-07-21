// package: christiangeorgelucas.avro_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class AvroError extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getPath(): string;
  setPath(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AvroError.AsObject;
  static toObject(includeInstance: boolean, msg: AvroError): AvroError.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AvroError, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AvroError;
  static deserializeBinaryFromReader(message: AvroError, reader: jspb.BinaryReader): AvroError;
}

export namespace AvroError {
  export type AsObject = {
    message: string,
    path: string,
  }
}

export class AvroSchemaInput extends jspb.Message {
  getSchema(): string;
  setSchema(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AvroSchemaInput.AsObject;
  static toObject(includeInstance: boolean, msg: AvroSchemaInput): AvroSchemaInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AvroSchemaInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AvroSchemaInput;
  static deserializeBinaryFromReader(message: AvroSchemaInput, reader: jspb.BinaryReader): AvroSchemaInput;
}

export namespace AvroSchemaInput {
  export type AsObject = {
    schema: string,
  }
}

export class ParseSchemaResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  getSchemaType(): string;
  setSchemaType(value: string): void;

  getName(): string;
  setName(value: string): void;

  getNamespace(): string;
  setNamespace(value: string): void;

  getFullName(): string;
  setFullName(value: string): void;

  getDoc(): string;
  setDoc(value: string): void;

  clearAliasesList(): void;
  getAliasesList(): Array<string>;
  setAliasesList(value: Array<string>): void;
  addAliases(value: string, index?: number): string;

  getNormalizedJson(): string;
  setNormalizedJson(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseSchemaResult.AsObject;
  static toObject(includeInstance: boolean, msg: ParseSchemaResult): ParseSchemaResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseSchemaResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseSchemaResult;
  static deserializeBinaryFromReader(message: ParseSchemaResult, reader: jspb.BinaryReader): ParseSchemaResult;
}

export namespace ParseSchemaResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    schemaType: string,
    name: string,
    namespace: string,
    fullName: string,
    doc: string,
    aliasesList: Array<string>,
    normalizedJson: string,
  }
}

export class ValidateSchemaResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateSchemaResult.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateSchemaResult): ValidateSchemaResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidateSchemaResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateSchemaResult;
  static deserializeBinaryFromReader(message: ValidateSchemaResult, reader: jspb.BinaryReader): ValidateSchemaResult;
}

export namespace ValidateSchemaResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
  }
}

export class SchemaTypeResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  getSchemaType(): string;
  setSchemaType(value: string): void;

  getIsNamed(): boolean;
  setIsNamed(value: boolean): void;

  getIsPrimitive(): boolean;
  setIsPrimitive(value: boolean): void;

  getIsUnion(): boolean;
  setIsUnion(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaTypeResult.AsObject;
  static toObject(includeInstance: boolean, msg: SchemaTypeResult): SchemaTypeResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SchemaTypeResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SchemaTypeResult;
  static deserializeBinaryFromReader(message: SchemaTypeResult, reader: jspb.BinaryReader): SchemaTypeResult;
}

export namespace SchemaTypeResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    schemaType: string,
    isNamed: boolean,
    isPrimitive: boolean,
    isUnion: boolean,
  }
}

export class AvroField extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getTypeJson(): string;
  setTypeJson(value: string): void;

  getHasDefault(): boolean;
  setHasDefault(value: boolean): void;

  getDefaultJson(): string;
  setDefaultJson(value: string): void;

  getDoc(): string;
  setDoc(value: string): void;

  clearAliasesList(): void;
  getAliasesList(): Array<string>;
  setAliasesList(value: Array<string>): void;
  addAliases(value: string, index?: number): string;

  getOrder(): string;
  setOrder(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AvroField.AsObject;
  static toObject(includeInstance: boolean, msg: AvroField): AvroField.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AvroField, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AvroField;
  static deserializeBinaryFromReader(message: AvroField, reader: jspb.BinaryReader): AvroField;
}

export namespace AvroField {
  export type AsObject = {
    name: string,
    typeJson: string,
    hasDefault: boolean,
    defaultJson: string,
    doc: string,
    aliasesList: Array<string>,
    order: string,
  }
}

export class ListFieldsResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  clearFieldsList(): void;
  getFieldsList(): Array<AvroField>;
  setFieldsList(value: Array<AvroField>): void;
  addFields(value?: AvroField, index?: number): AvroField;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListFieldsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListFieldsResult): ListFieldsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListFieldsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListFieldsResult;
  static deserializeBinaryFromReader(message: ListFieldsResult, reader: jspb.BinaryReader): ListFieldsResult;
}

export namespace ListFieldsResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    fieldsList: Array<AvroField.AsObject>,
  }
}

export class SchemaNameResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  getIsNamed(): boolean;
  setIsNamed(value: boolean): void;

  getName(): string;
  setName(value: string): void;

  getNamespace(): string;
  setNamespace(value: string): void;

  getFullName(): string;
  setFullName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaNameResult.AsObject;
  static toObject(includeInstance: boolean, msg: SchemaNameResult): SchemaNameResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SchemaNameResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SchemaNameResult;
  static deserializeBinaryFromReader(message: SchemaNameResult, reader: jspb.BinaryReader): SchemaNameResult;
}

export namespace SchemaNameResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    isNamed: boolean,
    name: string,
    namespace: string,
    fullName: string,
  }
}

export class NamedType extends jspb.Message {
  getFullName(): string;
  setFullName(value: string): void;

  getType(): string;
  setType(value: string): void;

  getNamespace(): string;
  setNamespace(value: string): void;

  getDoc(): string;
  setDoc(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NamedType.AsObject;
  static toObject(includeInstance: boolean, msg: NamedType): NamedType.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NamedType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NamedType;
  static deserializeBinaryFromReader(message: NamedType, reader: jspb.BinaryReader): NamedType;
}

export namespace NamedType {
  export type AsObject = {
    fullName: string,
    type: string,
    namespace: string,
    doc: string,
  }
}

export class ListNamedTypesResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  clearTypesList(): void;
  getTypesList(): Array<NamedType>;
  setTypesList(value: Array<NamedType>): void;
  addTypes(value?: NamedType, index?: number): NamedType;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListNamedTypesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListNamedTypesResult): ListNamedTypesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListNamedTypesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListNamedTypesResult;
  static deserializeBinaryFromReader(message: ListNamedTypesResult, reader: jspb.BinaryReader): ListNamedTypesResult;
}

export namespace ListNamedTypesResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    typesList: Array<NamedType.AsObject>,
  }
}

export class EnumSymbolsResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  clearSymbolsList(): void;
  getSymbolsList(): Array<string>;
  setSymbolsList(value: Array<string>): void;
  addSymbols(value: string, index?: number): string;

  getHasDefault(): boolean;
  setHasDefault(value: boolean): void;

  getDefaultSymbol(): string;
  setDefaultSymbol(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnumSymbolsResult.AsObject;
  static toObject(includeInstance: boolean, msg: EnumSymbolsResult): EnumSymbolsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnumSymbolsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnumSymbolsResult;
  static deserializeBinaryFromReader(message: EnumSymbolsResult, reader: jspb.BinaryReader): EnumSymbolsResult;
}

export namespace EnumSymbolsResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    symbolsList: Array<string>,
    hasDefault: boolean,
    defaultSymbol: string,
  }
}

export class UnionBranch extends jspb.Message {
  getTypeJson(): string;
  setTypeJson(value: string): void;

  getBranchType(): string;
  setBranchType(value: string): void;

  getFullName(): string;
  setFullName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnionBranch.AsObject;
  static toObject(includeInstance: boolean, msg: UnionBranch): UnionBranch.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnionBranch, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnionBranch;
  static deserializeBinaryFromReader(message: UnionBranch, reader: jspb.BinaryReader): UnionBranch;
}

export namespace UnionBranch {
  export type AsObject = {
    typeJson: string,
    branchType: string,
    fullName: string,
  }
}

export class UnionBranchesResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  clearBranchesList(): void;
  getBranchesList(): Array<UnionBranch>;
  setBranchesList(value: Array<UnionBranch>): void;
  addBranches(value?: UnionBranch, index?: number): UnionBranch;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnionBranchesResult.AsObject;
  static toObject(includeInstance: boolean, msg: UnionBranchesResult): UnionBranchesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnionBranchesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnionBranchesResult;
  static deserializeBinaryFromReader(message: UnionBranchesResult, reader: jspb.BinaryReader): UnionBranchesResult;
}

export namespace UnionBranchesResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    branchesList: Array<UnionBranch.AsObject>,
  }
}

export class CanonicalFormResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  getCanonicalForm(): string;
  setCanonicalForm(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CanonicalFormResult.AsObject;
  static toObject(includeInstance: boolean, msg: CanonicalFormResult): CanonicalFormResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CanonicalFormResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CanonicalFormResult;
  static deserializeBinaryFromReader(message: CanonicalFormResult, reader: jspb.BinaryReader): CanonicalFormResult;
}

export namespace CanonicalFormResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    canonicalForm: string,
  }
}

export class FingerprintInput extends jspb.Message {
  getSchema(): string;
  setSchema(value: string): void;

  getAlgorithm(): string;
  setAlgorithm(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FingerprintInput.AsObject;
  static toObject(includeInstance: boolean, msg: FingerprintInput): FingerprintInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FingerprintInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FingerprintInput;
  static deserializeBinaryFromReader(message: FingerprintInput, reader: jspb.BinaryReader): FingerprintInput;
}

export namespace FingerprintInput {
  export type AsObject = {
    schema: string,
    algorithm: string,
  }
}

export class FingerprintResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  getAlgorithm(): string;
  setAlgorithm(value: string): void;

  getFingerprintHex(): string;
  setFingerprintHex(value: string): void;

  getCanonicalForm(): string;
  setCanonicalForm(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FingerprintResult.AsObject;
  static toObject(includeInstance: boolean, msg: FingerprintResult): FingerprintResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FingerprintResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FingerprintResult;
  static deserializeBinaryFromReader(message: FingerprintResult, reader: jspb.BinaryReader): FingerprintResult;
}

export namespace FingerprintResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    algorithm: string,
    fingerprintHex: string,
    canonicalForm: string,
  }
}

export class CompatibilityInput extends jspb.Message {
  getWriterSchema(): string;
  setWriterSchema(value: string): void;

  getReaderSchema(): string;
  setReaderSchema(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompatibilityInput.AsObject;
  static toObject(includeInstance: boolean, msg: CompatibilityInput): CompatibilityInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CompatibilityInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompatibilityInput;
  static deserializeBinaryFromReader(message: CompatibilityInput, reader: jspb.BinaryReader): CompatibilityInput;
}

export namespace CompatibilityInput {
  export type AsObject = {
    writerSchema: string,
    readerSchema: string,
  }
}

export class CompatibilityResult extends jspb.Message {
  getCompatible(): boolean;
  setCompatible(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompatibilityResult.AsObject;
  static toObject(includeInstance: boolean, msg: CompatibilityResult): CompatibilityResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CompatibilityResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompatibilityResult;
  static deserializeBinaryFromReader(message: CompatibilityResult, reader: jspb.BinaryReader): CompatibilityResult;
}

export namespace CompatibilityResult {
  export type AsObject = {
    compatible: boolean,
    errorsList: Array<AvroError.AsObject>,
  }
}

export class DocEntry extends jspb.Message {
  getPath(): string;
  setPath(value: string): void;

  getDoc(): string;
  setDoc(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocEntry.AsObject;
  static toObject(includeInstance: boolean, msg: DocEntry): DocEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DocEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocEntry;
  static deserializeBinaryFromReader(message: DocEntry, reader: jspb.BinaryReader): DocEntry;
}

export namespace DocEntry {
  export type AsObject = {
    path: string,
    doc: string,
  }
}

export class ExtractDocsResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  clearDocsList(): void;
  getDocsList(): Array<DocEntry>;
  setDocsList(value: Array<DocEntry>): void;
  addDocs(value?: DocEntry, index?: number): DocEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractDocsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractDocsResult): ExtractDocsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractDocsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractDocsResult;
  static deserializeBinaryFromReader(message: ExtractDocsResult, reader: jspb.BinaryReader): ExtractDocsResult;
}

export namespace ExtractDocsResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    docsList: Array<DocEntry.AsObject>,
  }
}

export class AliasEntry extends jspb.Message {
  getPath(): string;
  setPath(value: string): void;

  clearAliasesList(): void;
  getAliasesList(): Array<string>;
  setAliasesList(value: Array<string>): void;
  addAliases(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AliasEntry.AsObject;
  static toObject(includeInstance: boolean, msg: AliasEntry): AliasEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AliasEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AliasEntry;
  static deserializeBinaryFromReader(message: AliasEntry, reader: jspb.BinaryReader): AliasEntry;
}

export namespace AliasEntry {
  export type AsObject = {
    path: string,
    aliasesList: Array<string>,
  }
}

export class ListAliasesResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  clearEntriesList(): void;
  getEntriesList(): Array<AliasEntry>;
  setEntriesList(value: Array<AliasEntry>): void;
  addEntries(value?: AliasEntry, index?: number): AliasEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAliasesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListAliasesResult): ListAliasesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListAliasesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAliasesResult;
  static deserializeBinaryFromReader(message: ListAliasesResult, reader: jspb.BinaryReader): ListAliasesResult;
}

export namespace ListAliasesResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    entriesList: Array<AliasEntry.AsObject>,
  }
}

export class LogicalTypeEntry extends jspb.Message {
  getPath(): string;
  setPath(value: string): void;

  getLogicalType(): string;
  setLogicalType(value: string): void;

  getUnderlyingType(): string;
  setUnderlyingType(value: string): void;

  getPrecision(): number;
  setPrecision(value: number): void;

  getScale(): number;
  setScale(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogicalTypeEntry.AsObject;
  static toObject(includeInstance: boolean, msg: LogicalTypeEntry): LogicalTypeEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LogicalTypeEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogicalTypeEntry;
  static deserializeBinaryFromReader(message: LogicalTypeEntry, reader: jspb.BinaryReader): LogicalTypeEntry;
}

export namespace LogicalTypeEntry {
  export type AsObject = {
    path: string,
    logicalType: string,
    underlyingType: string,
    precision: number,
    scale: number,
  }
}

export class LogicalTypesResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  clearLogicalTypesList(): void;
  getLogicalTypesList(): Array<LogicalTypeEntry>;
  setLogicalTypesList(value: Array<LogicalTypeEntry>): void;
  addLogicalTypes(value?: LogicalTypeEntry, index?: number): LogicalTypeEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogicalTypesResult.AsObject;
  static toObject(includeInstance: boolean, msg: LogicalTypesResult): LogicalTypesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LogicalTypesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogicalTypesResult;
  static deserializeBinaryFromReader(message: LogicalTypesResult, reader: jspb.BinaryReader): LogicalTypesResult;
}

export namespace LogicalTypesResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    logicalTypesList: Array<LogicalTypeEntry.AsObject>,
  }
}

export class EncodeInput extends jspb.Message {
  getSchema(): string;
  setSchema(value: string): void;

  getDatumJson(): string;
  setDatumJson(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EncodeInput.AsObject;
  static toObject(includeInstance: boolean, msg: EncodeInput): EncodeInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EncodeInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EncodeInput;
  static deserializeBinaryFromReader(message: EncodeInput, reader: jspb.BinaryReader): EncodeInput;
}

export namespace EncodeInput {
  export type AsObject = {
    schema: string,
    datumJson: string,
  }
}

export class EncodeResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  getBinary(): Uint8Array | string;
  getBinary_asU8(): Uint8Array;
  getBinary_asB64(): string;
  setBinary(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EncodeResult.AsObject;
  static toObject(includeInstance: boolean, msg: EncodeResult): EncodeResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EncodeResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EncodeResult;
  static deserializeBinaryFromReader(message: EncodeResult, reader: jspb.BinaryReader): EncodeResult;
}

export namespace EncodeResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    binary: Uint8Array | string,
  }
}

export class DecodeInput extends jspb.Message {
  getSchema(): string;
  setSchema(value: string): void;

  getBinary(): Uint8Array | string;
  getBinary_asU8(): Uint8Array;
  getBinary_asB64(): string;
  setBinary(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DecodeInput.AsObject;
  static toObject(includeInstance: boolean, msg: DecodeInput): DecodeInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DecodeInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DecodeInput;
  static deserializeBinaryFromReader(message: DecodeInput, reader: jspb.BinaryReader): DecodeInput;
}

export namespace DecodeInput {
  export type AsObject = {
    schema: string,
    binary: Uint8Array | string,
  }
}

export class DecodeResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearErrorsList(): void;
  getErrorsList(): Array<AvroError>;
  setErrorsList(value: Array<AvroError>): void;
  addErrors(value?: AvroError, index?: number): AvroError;

  getDatumJson(): string;
  setDatumJson(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DecodeResult.AsObject;
  static toObject(includeInstance: boolean, msg: DecodeResult): DecodeResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DecodeResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DecodeResult;
  static deserializeBinaryFromReader(message: DecodeResult, reader: jspb.BinaryReader): DecodeResult;
}

export namespace DecodeResult {
  export type AsObject = {
    valid: boolean,
    errorsList: Array<AvroError.AsObject>,
    datumJson: string,
  }
}

