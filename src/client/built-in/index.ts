import Code from './built-ins/Code';
import TextArea from './built-ins/TextArea';
import Split from './built-ins/Split';
import Appear from './built-ins/Appear';
import Clock from './built-ins/Clock';
import Timer from './built-ins/Timer';
import PlayGround from './built-ins/PlayGround';
import Inspector from './built-ins/Inspector';

function getBuiltInComponent(name) {
  const builtIns = [Code, TextArea, Split, Appear, Clock, Timer, PlayGround, Inspector];

  Object.defineProperty(Code, 'name', { value: 'Code' });
  Object.defineProperty(TextArea, 'name', { value: 'TextArea' });
  Object.defineProperty(Split, 'name', { value: 'Split' });
  Object.defineProperty(Appear, 'name', { value: 'Appear' });
  Object.defineProperty(Clock, 'name', { value: 'Clock' });
  Object.defineProperty(Timer, 'name', { value: 'Timer' });
  Object.defineProperty(PlayGround, 'name', { value: 'PlayGround' });
  Object.defineProperty(Inspector, 'name', { value: 'Inspector' });

  for (let i = 0, { length } = builtIns; i < length; i += 1) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const builtIn = builtIns[i];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if (name.toLowerCase() === builtIn.name.toLowerCase()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return builtIn;
    }
  }

  return null;
}

export default getBuiltInComponent;
