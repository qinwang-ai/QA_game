#!/usr/bin/env python
# coding=utf-8

from common.functions import *

def isRightHandler(kwargs):
    """
    request: token, type, q_id, o_id
    response: {
        status （状态码）
        info  (错误信息)
        is_right(上一道题是否正确)
        data（下一道题的信息）
    >>> params = {'token': '1', 'type': 1, 'q_id': 1, 'o_id': 3}
    >>> res = isRightHandler(params)
    >>> print res
    """
    # 解析参数
    token = kwargs.get('token', None) 
    conn = connect_to_db();
    type = kwargs.get('type', None)
    q_id = kwargs.get('q_id', None)
    o_id = kwargs.get('o_id', None)
    res = {}

    # 验证token
    if not check_token(conn, token, None, res):
        return res
    else:
        # 验证答案
        if is_right(conn, type, q_id, o_id, res):
            # 更新分数
            update_user_score_in_redis(token, q_id) 
        # 获取下一道题
        res['data'] = fetch_one(conn, token, type)
        # 标记请求处理成功
        set_ok(res) 
        return res
            
