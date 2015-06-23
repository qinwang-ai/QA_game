#!/usr/bin/env python
# coding=utf-8

import torndb
from common.functions  import *
from config.base import *

def login_handler(kwargs):
    """
    登陆验证处理,返回的一个字典，包括:
    status表示处理状态，用于前端错误处理
    info　错误状态码对应的错误信息描述
    data 内容主体,包括第一道题和token
    >>> # 没有token
    >>> params = {  'netid': '1', 'pwd': '1', 'phone_num': '13824413780', 'token': '' }
    >>> res = login_handler(params)
    >>> print res
    >>> 
    >>> # 错误token
    >>> params = {  'netid': '1', 'pwd': '1', 'phone_num': '13824413780', 'token': '1' }
    >>> res = login_handler(params)
    >>> print res
    >>>
    >>> # 正确token + login_name
    >>> params = {  'netid': '1', 'pwd': '1', 'phone_num': '13824413780', 'token': '2' }
    >>> res = login_handler(params)
    >>> print res
    """
    # 获取各个参数
    login_name = kwargs.get('netid', None)
    login_pwd = kwargs.get('pwd', None)
    phone_num = kwargs.get('phone_num', None)
    token = kwargs.get('token', None) 
    res = {}
    # 验证输入完整性
    if not check_input(login_name, login_pwd, phone_num, res):
        return  res
    else:
        conn = mysql_conn
        # 首次登陆验证,利用netid验证
        if not token:
            token = verify_netid(login_name, login_pwd, res)
            if not token: 
                return res 
            else:
                # 保存token（根据netid pwd判断如果为新用户，则插入，否则则更新）
                save_user(conn, login_name, login_pwd, phone_num, token)
        #　利用学号和token验证
        else:
            if not check_token(conn, token, login_name, res): 
                return res 
        # 验证成功后验证答题次数
        if not check_times_out(conn, token, res):
            return res
        # 用户答题答题次数加一
        add_onetime(conn, token)
        # 初始化验证成功的用户
        init_user_in_redis(token)
        # 随机获取一道题
        q = fetch_one(conn, token)
        # 设置data部分
        res['token'] = token
        res['data'] = q
        # 题id加到内存缓存列表中
        add_question_to_redis(token, q['question']['q_id'])
        # 设置成功状态码
        set_ok(res)
        return res

