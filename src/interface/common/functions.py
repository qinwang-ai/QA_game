#!/usr/bin/env python
# coding=utf-8

import torndb
import config.database as db
import config.base as base
import time

def connect_to_db():
    conn = torndb.Connection(db.HOSTNAME, db.DATABASE,
        db.USERNAME, db.PASSWORD)
    return conn 

def check_token(conn, token):
    msg = conn.get('select 1 from user where token = %s', token)
    return msg is not None

def check_timeout(token, conn):
    # timestamp 字段的更新是在请求第一道题时
    sql = 'select `timestamp` from user where token=%s'
    msg = conn.get(sql, token) 
    if msg is None:
        return None
    else: 
        return time.time() - msg.timestamp <= base.TIMEOUT 

