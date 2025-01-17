// The ZAFClient is injected in the index.html file when built / served.
// See docs for help regarding the ZAFClient: https://developer.zendesk.com/apps/docs/developer-guide/getting_started

interface IMetadata<T> {
  appId: number;
  installationId: number;
  name: string;
  plan: {
    name: string;
  };
	settings?: T
}

interface IClient {
  invoke:  <U>(cmd: string, ...args: any) => Promise<U>;
  get: (getter: string) => any;
  metadata: <U>() => IMetadata<U>;
  request: <U>(data: Object) => Promise<U>;
  on: (eventName: string, listener: (...args: any) => any) => void;
  off: (eventName: string, listener: (...args: any) => any) => void;
  has: (eventName: string, listener: (...args: any) => any) => boolean;
  context: () => Promise<IContext>
}

declare global {
	interface Window {
		ZAFClient: {
			init: () => IClient
		}
	}
}

let zafClient: IClient;
if (typeof window.ZAFClient === "undefined") {
  // eslint-disable-line no-undef
  throw new Error("ZAFClient cannot run outside Zendesk");
} else {
  zafClient = window.ZAFClient.init(); // eslint-disable-line no-undef
}

export default zafClient;

interface IContext {
  instanceGuid: string;
  product: string;
  account: { subdomain: string },
  location: string;
  ticketId: number
}
