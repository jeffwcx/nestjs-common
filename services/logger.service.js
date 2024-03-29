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
var Logger_1;
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
const clc = require("cli-color");
const injectable_decorator_1 = require("../decorators/core/injectable.decorator");
const optional_decorator_1 = require("../decorators/core/optional.decorator");
const shared_utils_1 = require("../utils/shared.utils");
const yellow = clc.xterm(3);
let Logger = Logger_1 = class Logger {
    constructor(context, isTimestampEnabled = false) {
        this.context = context;
        this.isTimestampEnabled = isTimestampEnabled;
    }
    error(message, trace = '', context) {
        const instance = this.getInstance();
        instance &&
            instance.error.call(instance, message, trace, context || this.context);
    }
    log(message, context) {
        this.callFunction('log', message, context);
    }
    warn(message, context) {
        this.callFunction('warn', message, context);
    }
    debug(message, context) {
        this.callFunction('debug', message, context);
    }
    verbose(message, context) {
        this.callFunction('verbose', message, context);
    }
    static overrideLogger(logger) {
        this.instance = shared_utils_1.isObject(logger) ? logger : undefined;
    }
    static log(message, context = '', isTimeDiffEnabled = true) {
        this.printMessage(message, clc.green, context, isTimeDiffEnabled);
    }
    static error(message, trace = '', context = '', isTimeDiffEnabled = true) {
        this.printMessage(message, clc.red, context, isTimeDiffEnabled);
        this.printStackTrace(trace);
    }
    static warn(message, context = '', isTimeDiffEnabled = true) {
        this.printMessage(message, clc.yellow, context, isTimeDiffEnabled);
    }
    static debug(message, context = '', isTimeDiffEnabled = true) {
        this.printMessage(message, clc.magentaBright, context, isTimeDiffEnabled);
    }
    static verbose(message, context = '', isTimeDiffEnabled = true) {
        this.printMessage(message, clc.cyanBright, context, isTimeDiffEnabled);
    }
    callFunction(name, message, context) {
        const instance = this.getInstance();
        const func = instance && instance[name];
        func &&
            func.call(instance, message, context || this.context, this.isTimestampEnabled);
    }
    getInstance() {
        const { instance } = Logger_1;
        return instance === this ? Logger_1 : instance;
    }
    static printMessage(message, color, context = '', isTimeDiffEnabled) {
        const output = shared_utils_1.isObject(message)
            ? `${color('Object:')}\n${JSON.stringify(message, null, 2)}\n`
            : color(message);
        const localeStringOptions = {
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            day: '2-digit',
            month: '2-digit',
        };
        const timestamp = new Date(Date.now()).toLocaleString(undefined, localeStringOptions);
        process.stdout.write(color(`[Nest] ${process.pid}   - `));
        process.stdout.write(`${timestamp}   `);
        context && process.stdout.write(yellow(`[${context}] `));
        process.stdout.write(output);
        this.printTimestamp(isTimeDiffEnabled);
        process.stdout.write(`\n`);
    }
    static printTimestamp(isTimeDiffEnabled) {
        const includeTimestamp = Logger_1.lastTimestamp && isTimeDiffEnabled;
        if (includeTimestamp) {
            process.stdout.write(yellow(` +${Date.now() - Logger_1.lastTimestamp}ms`));
        }
        Logger_1.lastTimestamp = Date.now();
    }
    static printStackTrace(trace) {
        if (!trace) {
            return;
        }
        process.stdout.write(trace);
        process.stdout.write(`\n`);
    }
};
Logger.instance = Logger_1;
Logger = Logger_1 = __decorate([
    injectable_decorator_1.Injectable(),
    __param(0, optional_decorator_1.Optional()),
    __param(1, optional_decorator_1.Optional()),
    __metadata("design:paramtypes", [String, Object])
], Logger);
exports.Logger = Logger;
