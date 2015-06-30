#!/usr/bin/env python
# coding=utf-8

import xlrd
import sys 
reload(sys)
sys.setdefaultencoding('utf-8')
from config.enum import *
from config.database import *

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

def insert(conn, question, s_id,  ans):
    conn.execute('start transaction')
    type = QType.JUDGE
    sql = 'insert into question values(NULL, %s, %s, %s, NULL)'
    conn.execute(sql, question, type, s_id)
    sql = 'select max(q_id) as q_id from question'
    q_id = conn.get(sql).get('q_id')
    if ans:
        sql = 'insert into options values(NULL, "对", %s, 1)'
        conn.execute(sql, q_id)
        sql = 'insert into options values(NULL, "错", %s, 0)'
        conn.execute(sql, q_id)   
    else:
        sql = 'insert into options values(NULL, "对", %s, 0)'
        conn.execute(sql, q_id)
        sql = 'insert into options values(NULL, "错", %s, 1)'
        conn.execute(sql, q_id)   
    conn.execute('commit')
    
filename = 'doc/2.xlsx'
data = xlrd.open_workbook(filename)
sheets = data.sheets()
delete(conn, type=QType.JUDGE)
for sheet in sheets:
    s_id = Campus[sheet.name.encode('utf-8')]
    for i in xrange(1, sheet.nrows):
        row = sheet.row(i)
        question = row[0].value.encode('utf-8')
        ans = int(row[1].value) 
        ans -= 1
        print s_id
        print '问题: ', question
        print '答案: ', ans  
        insert(conn, question, s_id, ans)
    print '----------------------------------------------------------------'
    
