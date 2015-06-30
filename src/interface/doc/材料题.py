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

def delete(conn, type):
    sql = 'delete from question where `type`=%s'
    return conn.execute(sql, type)

def insert(conn, meterial, question, s_id, options, ans):
    conn.execute('start transaction')
    type = QType.MEMORY
    sql = 'insert into question values(NULL, %s, %s, %s, %s)'
    conn.execute(sql, question, type, s_id, meterial)
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

filename = 'doc/1.xlsx'
data = xlrd.open_workbook(filename)
sheets = data.sheets()
delete(conn, type=QType.MEMORY)

for sheet in sheets:
    s_id = Campus[sheet.name.encode('utf-8')]
    for i in xrange(1, sheet.nrows):
        row = sheet.row(i)
        meterial = row[0].value.encode('utf-8')
        question = row[1].value.encode('utf-8')
        if not (meterial.strip() or question.strip()):
            continue
        options = map(lambda opt: str(opt.value).encode('utf-8'), row[2:6])
        try:
            ans = int(row[6].value) 
        except:
            ans = row[6].value
        print '材料: ', meterial
        print '问题: ', question
        print '选项: ', ', '.join(options)
        print '答案: ', ans  
        insert(conn, meterial, question, s_id, options, ans)
    print '----------------------------------------------------------------'
    


