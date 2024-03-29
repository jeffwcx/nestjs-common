"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
const core_1 = require("../decorators/core");
const index_1 = require("../index");
const load_package_util_1 = require("../utils/load-package.util");
const shared_utils_1 = require("../utils/shared.utils");
const validation_constants_1 = require("./validation.constants");
let classValidator = {};
let classTransformer = {};
let ValidationPipe = class ValidationPipe {
    constructor(options) {
        options = options || {};
        const { transform, disableErrorMessages, transformOptions, validateCustomDecorators } = options, validatorOptions = __rest(options, ["transform", "disableErrorMessages", "transformOptions", "validateCustomDecorators"]);
        this.isTransformEnabled = !!transform;
        this.validatorOptions = validatorOptions;
        this.transformOptions = transformOptions;
        this.isDetailedOutputDisabled = disableErrorMessages;
        this.validateCustomDecorators = validateCustomDecorators || false;
        this.exceptionFactory =
            options.exceptionFactory ||
                (errors => new index_1.BadRequestException(this.isDetailedOutputDisabled ? undefined : errors));
        classValidator = load_package_util_1.loadPackage('class-validator', 'ValidationPipe', () => require('class-validator'));
        classTransformer = load_package_util_1.loadPackage('class-transformer', 'ValidationPipe', () => require('class-transformer'));
    }
    async transform(value, metadata) {
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metadata)) {
            return value;
        }
        value = this.toEmptyIfNil(value);
        this.stripProtoKeys(value);
        const entity = classTransformer.plainToClass(metatype, value, this.transformOptions);
        const dymanicOptions = Reflect.getMetadata(validation_constants_1.REWRITE_OPTIONS, metadata.metatype);
        const validatorOptions = dymanicOptions
            ? Object.assign({}, this.validatorOptions, dymanicOptions)
            : this.validatorOptions;
        const errors = await classValidator.validate(entity, validatorOptions);
        if (errors.length > 0) {
            throw this.exceptionFactory(errors);
        }
        return this.isTransformEnabled
            ? entity
            : Object.keys(validatorOptions).length > 0
                ? classTransformer.classToPlain(entity, this.transformOptions)
                : value;
    }
    toValidate(metadata) {
        const { metatype, type } = metadata;
        if (type === 'custom' && !this.validateCustomDecorators) {
            return false;
        }
        const types = [String, Boolean, Number, Array, Object];
        return !types.some(t => metatype === t) && !shared_utils_1.isNil(metatype);
    }
    toEmptyIfNil(value) {
        return shared_utils_1.isNil(value) ? {} : value;
    }
    stripProtoKeys(value) {
        delete value.__proto__;
        const keys = Object.keys(value);
        keys
            .filter(key => typeof value[key] === 'object' && value[key])
            .forEach(key => this.stripProtoKeys(value[key]));
    }
};
ValidationPipe = __decorate([
    core_1.Injectable(),
    __param(0, decorators_1.Optional()),
    __metadata("design:paramtypes", [Object])
], ValidationPipe);
exports.ValidationPipe = ValidationPipe;
