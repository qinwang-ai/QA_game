#!/usr/bin/env python
# -*- coding: utf8 -*-

import tornado.ioloop
import tornado.web
from tornado.options import define, options
from json import dumps
import config.base as  base
from api import *

define("port", default=8000, help="run on the given port", type=int)

class MainHandler(tornado.web.RequestHandler):
    def get(self): 
        method = self.get_argument('r', None)
        if  method not in base.METHOD_LIST:
            res  = {'400': 'bad request'}
        else:
            # get all params
            args = dict()
            for key in self.request.arguments:
                if key == method: continue
                args[key] = self.get_argument()
            args = self.get_arguments() 
            # eval the request
            res = eval(method)(args) 
        self.write(dumps(res))

if __name__ == "__main__":
    application = tornado.web.Application([(r"/", MainHandler),], debug=True)
    options.parse_command_line()
    application.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


