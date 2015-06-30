#!/usr/bin/env python
# coding=utf-8

import xlrd
import sys, os
reload(sys)
sys.setdefaultencoding('utf-8')
sys.path.append('..')
from config.enum import *
from config.database import *
from config.base import *
def delete(conn, type):
    sql = 'delete from question where `type`=%s'
    return conn.execute(sql, type)

def connect_to_db():
    import torndb
    """
    建立mysql连接
    """
    conn = torndb.Connection(HOSTNAME, DATABASE,
        USERNAME, PASSWORD)
    return conn 

conn = connect_to_db()

def insert(conn, options, note):
    conn.execute('start transaction')
    type = QType.PINTU
    sql = 'insert into question values(NULL, %s, %s, NULL, NULL)'
    conn.execute(sql, str(note), type)
    sql = 'select max(q_id) as q_id from question'
    q_id = conn.get(sql).get('q_id')
    for opt in options:
        sql = 'insert into options values(NULL, %s, %s, 0)'
        conn.execute(sql, opt, q_id)   
    conn.execute('commit')

dirname = 'QA_games_images'
sub_dirs = os.listdir(dirname)
delete(conn, type=QType.PINTU)
for key, dir in enumerate(sub_dirs):
    files = os.listdir(dirname + os.sep + dir)
    opts = map(lambda file: FILE_DOMAIN+os.sep+dirname+os.sep+dir+os.sep+file, files)
    print opts  
    insert(conn, opts, key+1)

