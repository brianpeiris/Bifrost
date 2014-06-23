from gevent import monkey; monkey.patch_all()
from ws4py.websocket import WebSocket
from ws4py.server.geventserver import WSGIServer
from ws4py.server.wsgiutils import WebSocketWSGIApplication
import time
import serial


class TreadmillServer(WebSocket):
    def __init__(self, *args, **kwargs):
        super(TreadmillServer, self).__init__(*args, **kwargs)

    def opened(self):
        treadmill_port = serial.Serial('/dev/ttyUSB0', 9600, timeout=0)
        while True:
            data = treadmill_port.read()
            if len(data):
                self.send(str(ord(data)))

server = WSGIServer(
    ('localhost', 1982),
    WebSocketWSGIApplication(handler_cls=TreadmillServer))
server.serve_forever()
