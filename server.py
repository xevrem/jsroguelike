#!/usr/bin/env python3

from flask import Flask, make_response
from docopt import docopt
import config


opts = """
Usage:
    server.py -h | --help
    server.py run [--debug -p <port> -a <addr>]

Options:
    -h --help       Display this message
    --debug         Debug the server [default: False]
    -p=<port>       Port for the server [default: 8080]
    -a=<addr>       Address for the server [default: 0.0.0.0]
"""

class Server:
    _app = None
    ADDR = None
    PORT = None

    def __init__(self, address=config.ADDR, port=config.PORT):
        self.ADDR = address
        self.PORT = port

        self._app = Flask(__name__, template_folder=config.TEMPLATE_DIR)

        self.setup_routes()

    def load_and_cache_content(self):
        pass

    def setup_routes(self):
        self._app.add_url_rule('/','root', self.root)
        self._app.add_url_rule('/<asset>','resource', self.resource)
        self._app.add_url_rule('/public/<asset>','public', self.public)

    def run(self,debug):
        print('running...')
        self._app.run(self.ADDR, self.PORT, debug=debug)

    def root(self):
        return "hi"

    def resource(self,asset):
        with open(config.PUBLIC_DIR+asset) as f:
            data = f.read()

        resp = make_response(data,200)

        return resp

    def public(self, asset):
        with open(config.PUBLIC_DIR+asset) as f:
            data = f.read()

        resp = make_response(data,200)

        resp.headers['Content-Type'] = process_mime_headers(asset)

        return resp

def process_mime_headers(filename):
    if '.css' in filename:
        return 'text/css'
    elif '.js' in filename:
        return 'application/javascript'
    else:
        return 'text/html'

def main(args):

    server = Server(port=int(args['-p']), address=args['-a'])

    if args['run']:
        server.run(args['--debug'])


if __name__ == '__main__':
    args = docopt(opts)
    print(args)
    main(args)
