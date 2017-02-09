#!/usr/bin/env python3

from paws import run_server
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
    -a=<addr>       Address for the server [default: 127.0.0.1]
"""

async def root(req, res):
    res.body = 'hello world!'
    return res

async def resource(req, res):
    asset = req.wildcards['asset']

    try:
        with open(config.PUBLIC_DIR+asset) as f:
            data = f.read()

        res.headers['Content-Type'] = process_mime_headers(asset)
        res.body = data
    except:
        res.status = '404'
        data = ""

    res.body = data

    return res

async def public(req, res):
    asset = req.wildcards['asset']

    try:
        with open(config.PUBLIC_DIR+asset) as f:
            data = f.read()

        res.headers['Content-Type'] = process_mime_headers(asset)
        res.body = data
    except:
        res.status = '404'
        data = ""


    return res


def process_mime_headers(filename):
    if '.css' in filename:
        return 'text/css'
    elif '.js' in filename:
        return 'text/javascript'
    else:
        return 'text/html'

def routes(app):
    app.add_route('/', root)
    app.add_route('/{asset}',resource)
    app.add_route('/public/{asset}', public)

def main(args):
    run_server(routing_cb=routes, host='127.0.0.1', port=8080, processes=2,
    use_uvloop=False, debug=True)

if __name__ == '__main__':
    args = docopt(opts)
    main(args)
