import mitt, { Emitter } from 'mitt';

type Events = {
  routeLogin?: {
    redirect: string
  }
  foo: string;
  bar?: number;
};

const emitter: Emitter<Events> = mitt<Events>();

export default emitter;