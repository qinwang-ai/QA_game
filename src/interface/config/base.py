#!/usr/bin/env python
# coding=utf-8

DEVELOP_MODE = True

METHOD_LIST = ['login', 'isRight','getFinalScore']
TIMEOUT = 60
MAX_TIMES = 5000
if DEVELOP_MODE:
    TIMEOUT = 10000000
    MAX_TIMES = 1000
FILE_DOMAIN = 'http://test.static.zetast.com'

