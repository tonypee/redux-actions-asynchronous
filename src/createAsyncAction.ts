import { createAction, ActionFunctionAny, Action } from "redux-actions";

interface AsyncActionCreator {
  startAction: ActionFunctionAny<Action<any>>;
  action: ActionFunctionAny<Action<any>>;
  sync: ActionFunctionAny<Action<any>>;
  postAction: ActionFunctionAny<Action<any>>;
  failAction: ActionFunctionAny<Action<any>>;
  (...args): any;
}

export function createAsyncAction(type: string, handler, postHandler?, metaCreator?): AsyncActionCreator {
  const factory: any = function(...args) {
    return async dispatch => {
      const startTime = Date.now();
      const action1 = startAction(args);
      if (metaCreator) (action1 as any).meta = metaCreator({ args });
      await dispatch(action1);
      try {
        const action2 = mainAction.apply(null, args);
        if (metaCreator) (action2 as any).meta = metaCreator({ args });
        await dispatch(action2);
        if (postHandler) {
          await dispatch(postAction({ time: Date.now() - startTime, result: action2.payload, args }));
        }
        return action2.payload;
      } catch (e) {
        const action3 = failAction({ message: e.message || e, error: e });
        if (metaCreator) (action3 as any).meta = metaCreator({ args });
        await dispatch(action3);
        throw e;
      }
    };
  };

  const startAction = (factory.startAction = createAction(`${type}_START`));
  const mainAction = (factory.action = createAction(`${type}`, handler));
  const postAction = (factory.postAction = createAction(`${type}_POST`, postHandler)) as any;
  const failAction = (factory.failAction = createAction(`${type}_FAIL`));
  const sync = (factory.sync = createAction(`${type}`));

  factory.toString = mainAction.toString;

  return factory;
}
