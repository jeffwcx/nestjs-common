"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
const axios_1 = require("axios");
const module_decorator_1 = require("../decorators/modules/module.decorator");
const random_string_generator_util_1 = require("../utils/random-string-generator.util");
const http_constants_1 = require("./http.constants");
const http_service_1 = require("./http.service");
let HttpModule = HttpModule_1 = class HttpModule {
    static register(config) {
        return {
            module: HttpModule_1,
            providers: [
                {
                    provide: http_constants_1.AXIOS_INSTANCE_TOKEN,
                    useValue: axios_1.default.create(config),
                },
                {
                    provide: http_constants_1.HTTP_MODULE_ID,
                    useValue: random_string_generator_util_1.randomStringGenerator(),
                },
            ],
        };
    }
    static registerAsync(options) {
        return {
            module: HttpModule_1,
            imports: options.imports,
            providers: [
                ...this.createAsyncProviders(options),
                {
                    provide: http_constants_1.AXIOS_INSTANCE_TOKEN,
                    useFactory: (config) => axios_1.default.create(config),
                    inject: [http_constants_1.HTTP_MODULE_OPTIONS],
                },
                {
                    provide: http_constants_1.HTTP_MODULE_ID,
                    useValue: random_string_generator_util_1.randomStringGenerator(),
                },
                ...(options.extraProviders || []),
            ],
        };
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: http_constants_1.HTTP_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: http_constants_1.HTTP_MODULE_OPTIONS,
            useFactory: async (optionsFactory) => optionsFactory.createHttpOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
};
HttpModule = HttpModule_1 = __decorate([
    module_decorator_1.Module({
        providers: [
            http_service_1.HttpService,
            {
                provide: http_constants_1.AXIOS_INSTANCE_TOKEN,
                useValue: axios_1.default,
            },
        ],
        exports: [http_service_1.HttpService],
    })
], HttpModule);
exports.HttpModule = HttpModule;
