import { net, protocol } from 'electron';

export const protocolName = 'perso';

function handleProtocol() {
  protocol.handle(protocolName, async (request) => {
    const filePath = decodeURIComponent(
      request.url.replace(`${protocolName}://`, '')
    );
    return net.fetch(`file://${filePath}`);
  });
}

export default handleProtocol;
