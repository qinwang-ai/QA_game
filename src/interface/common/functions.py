#!/usr/bin/env python
# coding=utf-8

import torndb
import time
from config.database import *
from config.base import *
from config.enum import *
from config.ans import *
from common.memory import *

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

def log_decorator(func):
    """
    装饰器函数,打印出每个被装饰的函数的doc
    """
    def func_with_log(*args, **kwargs):
        print  func.__doc__
        return func(*args, **kwargs)
    return func_with_log

@log_decorator
def connect_to_db():
    """
    建立mysql连接
    """
    conn = torndb.Connection(HOSTNAME, DATABASE,
        USERNAME, PASSWORD)
    return conn 

mysql_conn = connect_to_db()

@log_decorator
def update_user_score_in_mysql(conn, token, score):
    """
    更新用用最高分数
    并返回最高的分数
    """
    conn.execute('update user set best_score=%s where token=%s and best_score<%s', score, token, score)
    return conn.get('select best_score from user where token=%s', token).best_score

def check_token(conn, token, login_name, res):
    """
    检查token是否与数据库token相符
    >>> conn = connect_to_db()
    >>> token = '1' # 错误token
    >>> login_name = 'houyf'
    >>> res = {}
    >>> check_token(conn, token, login_name, res)
    >>> print  res.get('info', None)
    >>> token = '2' # 正确token
    >>> login_name = 'houyf'
    >>> res = {}
    >>> check_token(conn, token, login_name, res)
    >>> print  res.get('info', None)
    """
    # 如果login_name 设置为None, 则说明是在非登陆验证场景下的token验证（只需要token验证）
    if not login_name:
        msg = conn.get('select 1 from user where token=%s', token) if token else None
    # 登陆验证场景下需要netid + token一起验证
    else:
        msg = conn.get('select 1 from user where token = %s and login_name=%s', token, login_name)
    if msg is None:
        res['status'] = StatusCode.INVALID_TOKEN
        res['info']  = ErrorMsg[res['status']]
        return False
    else:
        return True

def check_qtype(type, res):
    """
    >>> res = {}
    >>> check_qtype(QType.JUDGE, res)
    >>> print  res.get('info', None)
    >>> check_qtype(5, res)
    >>> print  res.get('info', None)
    """
    if type not in range(1, 5):
        res['status'] = StatusCode.INVALID_TYPE
        res['info']  = ErrorMsg[res['status']]
        return False
    return True

def check_input(login_name, login_pwd, phone_num, res): 
    """
    >>> res  = {}
    >>> check_input('houyf', '', '13824413780', res)
    >>> print  res.get('info', None)
    >>> check_input('', 'Beyond', '13824413780', res)
    >>> print  res.get('info', None)
    >>> check_input('houyf', 'Beyond', '', res)
    >>> print  res.get('info', None)
    """
    if not (login_name and login_pwd):
        res['status'] = StatusCode.INVALID_USERNAME
        res['info']  = ErrorMsg[res['status']]
        return False 
    elif not phone_num:
        res['status'] = StatusCode.INVALID_PHONE
        res['info']  = ErrorMsg[res['status']]
        return False
    else:
        return True

def fetch_one(conn, type=QType.SELECT, filters=[]):  
    """
    >>> conn = connect_to_db()
    >>> type = QType.SELECT
    >>> filters = []
    >>> q = fetch_one(conn, type, filters)
    >>> print q
    """
    # 随机选择一道没答过的题目
    if isinstance(filters, list):
        filters = map(lambda e: str(e), filters)
        filters = '('+', '.join(filters)+ ')'
        sql = 'select q_id, note from question where `type`=%s and q_id not in %s limit 1'%(type, filters)
        qu = conn.get(sql) 
    else:
        sql = 'select q_id, note from question where `type`=%s limit 1'%type
        qu = conn.get(sql) 
    if qu is None:
        print  '选不到合适的题....'
        return {}
    else:
        sql = 'select o_id, note from options where q_id=%s'
        opts = conn.query(sql, qu.q_id)
        # 筛选题目对应的答案
        for index, value in enumerate(opts):
            opts[index] = dict(value)
        # 如果是拼图题,需要打乱顺序
        if type == QType.PINTU:
            import random
            random.shuffle(opts)
        info = {
            'question': dict(qu),
            'options': opts,
        }
        return info

@log_decorator
def set_msg(res):
    """
    根据状态吗设置信息
    """
    res.setdefault('status', StatusCode.OK)
    res['info']  = ErrorMsg[res['status']]

@log_decorator
def verify_netid(login_name, login_pwd, res):
    """
    通过教务系统验证netid
    """
    # res['status'] = StatusCode.INVALID_USERNAME
    # res['info']  = ErrorMsg[res['status']]
    import uuid
    return uuid.uuid1().hex

@log_decorator
def _user_exists(conn, login_name, login_pwd):
    """
    判断用户是否存在
    """
    sql = 'select 1 from user where login_name=%s and login_pwd=%s' 
    msg = conn.get(sql, login_name, login_pwd)
    return msg is not None
    
@log_decorator
def save_user(conn, login_name, login_pwd, phone_num, token):
    """
    如果是新用户则插入
    如果是已有用户，则更新token
    """
    if  _user_exists(conn, login_name, login_pwd):
        sql = 'update user set token = %s where login_name=%s and login_pwd=%s'
        conn.execute(sql, token, login_name, login_pwd)
    else:
        sql = 'insert into user values(NULL, %s, %s, %s, 0, 0, %s,  %s)'
        conn.execute(sql, login_name, login_pwd, phone_num, CampusArea.EAST ,token) 

@log_decorator
def check_times_out(conn, token, res):
    """
    检查是否超过一定的答题次数限制
    """
    sql = 'select times from user where token=%s'
    msg = conn.get(sql, token)
    if not msg.times < MAX_TIMES:
        res['status'] = StatusCode.TIMES_OUT
        res['info']  = ErrorMsg[res['status']] 
        return False
    return True

@log_decorator
def add_onetime(conn, token):
    """
    用户答题次数加一
    """
    sql = 'update user set times=times+1 where token=%s'
    conn.execute(sql,token)

@log_decorator
def is_right(conn, q_id, o_id):
    """
    根据类型和题目和选项判断答案是否正确
    """
    # 如果是拼图题
    sql = 'select `type` from question where q_id=%s'
    type = conn.get(sql, q_id).get('type')
    if type == QType.PINTU:
        return o_id in PINTU_ANS
    else: 
        msg = conn.get('select 1 from question where q_id=%s', q_id)
        if not msg: return False
        sql = 'select 1 from options where q_id=%s and o_id=%s and is_ans=%s'
        msg = conn.get(sql, q_id, o_id, True)
        return True if msg else False 

if __name__ == '__main__':
    import doctest
    doctest.testmod()

