import parseStack from './parse-stack.js';
import { inspectorContext } from '../built-in/built-ins/Inspector';

let stopped = false;

export default function inspect(watchPoint) {
  if (stopped) return;

  const { ref, inspectorList } = inspectorContext;

  const inspector = {};

  const watchPointType = typeof watchPoint;
  if (watchPointType !== 'object') {
    stopped = true;
    inspector.inspectorStopped = `Expect object to be inspected, but got ${watchPointType} from:\n${watchPoint}`;
  }

  const MAX_NUMBER_OF_INSPECT_OBJS = 16;
  if (inspectorList.length >= MAX_NUMBER_OF_INSPECT_OBJS) {
    stopped = true;
    inspector.inspectorStopped = `The maximum number (${MAX_NUMBER_OF_INSPECT_OBJS}) of inspecting objects has been reached, stop inspecting`;
  }

  if (!stopped) {
    const keys = Object.keys(watchPoint);
    keys.forEach((key) => {
      inspector[key] = watchPoint[key];
    });
  }

  const { stack } = new Error();
  const callStack = parseStack(stack);
  callStack.shift();
  inspector.callStack = callStack;
  inspectorList.push(inspector);

  const { current } = ref;
  if (current) {
    current.update();
  }
}
