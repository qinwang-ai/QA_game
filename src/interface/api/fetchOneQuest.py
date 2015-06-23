#!/usr/bin/env python
# coding=utf-8

from common.functions import *

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
            'data': _fetch_one(conn, type, filters)
        }
        return res

def test_api():
    params = {
        'type': 1,
        'token': '2',
    }
    print fetchOneQuestion(params)
    
