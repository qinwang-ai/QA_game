#!/usr/bin/env python
# coding=utf-8

from common.functions import *

def getFanalSocre(kwargs):
    """
    >>> params = {'token': '2'}
    >>> print getFanalSocre(params)
    """
    token = kwargs.get('token', None)
    conn = connect_to_db() 
    res = {}
    # 验证token
    if not check_token(conn, token, None, res):
        return res
    else:
        score = get_user_score_in_redis(token)
        clear_user_in_redis(token)
        best_score = update_user_score_in_mysql(conn, token, score)
        res['score'] = score
        res['best_score'] = best_score
        set_ok(res)
        return res


