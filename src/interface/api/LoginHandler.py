#!/usr/bin/env python
# coding=utf-8

import torndb
from common.functions  import *
from config.base import *

def _verify_netid(name, pwd):
    return '2'

def login_handler(kwargs):
    login_name = kwargs.get('netid', None)
    login_pwd = kwargs.get('pwd', None)
    phone_num = kwargs.get('phone_num', None)
    token = kwargs.get('token', None) 

    if not login_name or not login_pwd:
        res = { 'status': '400', 'info': '用户名或者密码不正确'}
        return res 
    elif not phone_num:
        res = { 'status': '400', 'info': '请填写手机号'}
        return res 
    else:
        conn = connect_to_db()
        # 首次登陆验证,利用netid验证
        if not token:
            token = _verify_netid(login_name, login_pwd)
            if not token:
                res = { 'status': '400', 'info': '用户名或者密码不正确'}
                return res 
            else:
                sql = 'insert into user values(NULL, %s, %s, %s, 0, 0, %s,  %s)'
                conn.execute(sql, login_name, login_pwd, phone_num, CampusArea.EAST ,token)  
                res = {'200': '验证成功'}
                return res
                
        #　利用学号和token验证
        else:
            msg = conn.get('select 1 from user where login_name=%s and token=%s', login_name, token)
            # token 不匹配，重新拿netid去验证
            if msg is None:
                token = _verify_netid(login_name, login_pwd)
                if not token:
                    res = { 'status': '400', 'info': '用户名或者密码不正确'}
                    return res 
                else:
                    sql = 'update user set token = %s where login_name=%s' 
                    conn.execute(sql, token, login_name)
                    res = {'200': '验证成功'}
                    return res 
            else:
                res = {'200': '验证成功'}
                return res

def test_login():
    params = {
        'netid': 'houyf3',
        'pwd': '7briB?ce',
        'phone_num': '13824413780',
        'token': '3',
    }
    res = login_handler(params)
    print res





