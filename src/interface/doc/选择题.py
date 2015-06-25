#!/usr/bin/env python
# coding=utf-8

import xlrd
import sys 
reload(sys)
sys.setdefaultencoding('utf-8')
from config.enum import *
from config.database import *

def connect_to_db():
    import torndb
    """
    建立mysql连接
    """
    conn = torndb.Connection(HOSTNAME, DATABASE,
        USERNAME, PASSWORD)
    return conn 

conn = connect_to_db()

def insert(conn, question, s_id, options, ans):
    conn.execute('start transaction')
    type = QType.MEMORY
    sql = 'insert into question values(NULL, %s, %s, %s, NULL)'
    conn.execute(sql, question, type, s_id)
    sql = 'select max(q_id) as q_id from question'
    q_id = conn.get(sql).get('q_id')
    ans -= 1
    for index, opt in enumerate(options):
        if ans == index:
            sql = 'insert into options values(NULL, %s, %s, 1)'
            conn.execute(sql, opt, q_id)
        else:
            sql = 'insert into options values(NULL, %s, %s, 0)'
            conn.execute(sql, opt, q_id)   
    conn.execute('commit')

filename = 'doc/3.xlsx'
data = xlrd.open_workbook(filename)
sheets = data.sheets()

for sheet in sheets:
    s_id = Campus[sheet.name.encode('utf-8')]
    for i in xrange(1, sheet.nrows):
        row = sheet.row(i)
        question = row[0].value.encode('utf-8')
        if not question.strip():
            continue
        options = map(lambda opt: str(opt.value).encode('utf-8'), row[1:5])
        try:
            ans = int(row[5].value) 
        except:
            ans = row[5].value
        print '问题: ', question
        print '选项: ', ', '.join(options)
        print '答案: ', ans  
        insert(conn, question, s_id, options, ans)
    print '----------------------------------------------------------------'
    


