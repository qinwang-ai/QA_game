#!/usr/bin/env python
# coding=utf-8

from common.functions import *
from config.base import QType

def _fetch_one(type, conn, filters=[]):
    # sql = 'select q_id, note from question limit 1 where `type`=%s and q_id not in %s'
    # qu = conn.get(sql, type, tuple(filters)) 
    sql = 'select q_id, note from question where `type`=%s limit 1'
    qu = conn.get(sql, type) 
    if qu is None:
        print  '选不到合适的题....'
        return {}
    else:
        # 随机选择一道没答过的题目, 还没添filters
        sql = 'select o_id, note from options where q_id=%s'
        opts = conn.query(sql, qu.q_id)
        # 筛选题目对应的答案
        for index, value in enumerate(opts):
           opts[index] = dict(value)
        # 如果是拼图题,需要打乱答案的顺序
        if type == QType.PINTU:
            pass 
        info = {
            'question': dict(qu),
            'options': opts,
        }
        return info

def getOldQuestionList(token):
    filters = []
    return filters

def fetchOneQuestion(kwargs):
    """
    select a question accordding the type randomly
    """
    type = kwargs.get('type', None)
    token = kwargs.get('token', None)
    conn = connect_to_db()
    filters = []
    # 验证输入
    if not type or type not in range(1, 5):
        res = { 'status': '400', 'info': 'type无效'}
        return res
    # 验证token
    elif not token or not check_token(conn, token):
        res = { 'status': '400', 'info': 'token无效'}
        return res
    # 验证时间
    elif not check_time(conn, token):
        res = { 'status': '400', 'info': '超出答题时间'}
        return res
    # 成功
    else:
        res = {
            'status': '200',
            'data': _fetch_one(type, conn, filters)
        }
        return res

def test_api():
    params = {
        'type': 1,
        'token': '2',
    }
    print fetchOneQuestion(params)
    
