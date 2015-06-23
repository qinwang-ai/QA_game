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
    >>> # 正确答案例子
    >>> params = {'token': '1', 'type': 1, 'q_id': 1, 'o_id': 3}
    >>> res = isRightHandler(params)
    >>> print res
    >>> # 错误答案
    >>> params = {'token': '2', 'type': 1, 'q_id': 1, 'o_id': 1}
    >>> res = isRightHandler(params)
    >>> print res
    """
    # 解析参数
    token = kwargs.get('token', None) 
    conn = mysql_conn
    type = kwargs.get('type', None)
    q_id = kwargs.get('q_id', None)
    o_id = kwargs.get('o_id', None)
    res = {}

    # 验证token
    if not check_token(conn, token, None, res):
        return res
    # 验证是否超时
    elif not check_timeout(token, res):
        return res
    else:
        # 验证答案
        if is_right(conn, q_id, o_id):
            res['is_right'] = 1
            # 更新分数
            sql = 'select `type` from question where  q_id=%s'
            q_type = conn.get(sql, q_id).get('type')
            update_user_score_in_redis(token, q_type)  
        else:
            res['is_right'] = 0
        # 获取下一道题
        q = fetch_one(conn, token, type)
        if not q: return res
        #添加题目到response
        res['data'] = q
        # 题id加到内存缓存列表中
        add_question_to_redis(token, q['question']['q_id'])
        # 设置成功状态码
        set_ok(res)
        return res
            
