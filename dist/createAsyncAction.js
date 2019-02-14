"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redux_actions_1 = require("redux-actions");
function createAsyncAction(type, handler, postHandler, metaCreator) {
    const factory = function (...args) {
        return (dispatch) => __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            const action1 = startAction(args);
            if (metaCreator)
                action1.meta = metaCreator({ args });
            yield dispatch(action1);
            try {
                const action2 = mainAction.apply(null, args);
                if (metaCreator)
                    action2.meta = metaCreator({ args });
                yield dispatch(action2);
                if (postHandler) {
                    yield dispatch(postAction({ time: Date.now() - startTime, result: action2.payload, args }));
                }
                return action2.payload;
            }
            catch (e) {
                const action3 = failAction({ message: e.message || e, error: e });
                if (metaCreator)
                    action3.meta = metaCreator({ args });
                yield dispatch(action3);
                throw e;
            }
        });
    };
    const startAction = (factory.startAction = redux_actions_1.createAction(`${type}_START`));
    const mainAction = (factory.action = redux_actions_1.createAction(`${type}`, handler));
    const postAction = (factory.postAction = redux_actions_1.createAction(`${type}_POST`, postHandler));
    const failAction = (factory.failAction = redux_actions_1.createAction(`${type}_FAIL`));
    const sync = (factory.sync = redux_actions_1.createAction(`${type}`));
    factory.toString = mainAction.toString;
    return factory;
}
exports.createAsyncAction = createAsyncAction;
