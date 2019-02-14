export const reduxActionsMiddleware = store => next => action => {
  var isfun = obj => {
    return typeof obj === "function";
  };
  return next(
    isfun(action.payload)
      ? async () => {
          action.payload = await next(action.payload);
          await next(action);
        }
      : action
  );
};
