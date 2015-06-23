#!/usr/bin/env python
# coding=utf-8

import torndb
import config.database as db
import config.base as base
import time
from config.base import QType
from config.base import StatusCode
from config.base import ErrorMsg
from config.base import CampusArea
from config.base import TypeScore

def log_decorator(func):
    """
    装饰器函数,打印出每个被装饰的函数的doc
    """
    def func_with_log(*args, **kwargs):
        print  func.__doc__
        return func(*args, **kwargs)
    return func_with_log

@log_decorator
def connect_to_redis():
    """
    建立redis连接
    """
    global redis_conn
    import redis
    redis_conn = redis.Redis()
    return redis_conn 

@log_decorator
def connect_to_db():
    """
    建立mysql连接
    """
    conn = torndb.Connection(db.HOSTNAME, db.DATABASE,
        db.USERNAME, db.PASSWORD)
    return conn 

# redis 是线程安全的,所以可以用作全局变量
redis_conn = connect_to_redis() 
mysql_conn = connect_to_db()

@log_decorator
def add_question_to_redis(token, q_id):
    """
    添加一道题到用户已答题目的缓存中
    """
    global redis_conn
    return redis_conn.sadd('%s:q_list'%token, q_id)

@log_decorator
def init_user_in_redis(token):
    """
    在内存缓存中初始化开始答题的用户数据结构
    """
    global redis_conn
    conn = redis_conn
    if conn.get(token):
        clear_user_in_redis(token)
    conn.set(token, True)    
    conn.set('%s:start_time'%token, time.time())
    conn.set('%s:score'%token, 0)

@log_decorator
def clear_user_in_redis(token):
    """
    清理用户的内存缓存
    """
    global redis_conn
    conn = redis_conn
    conn.delete(token)
    conn.delete('%s:start_time'%token)
    conn.delete('%s:score'%token)
    conn.delete('%s:q_list'%token)
    return 

@log_decorator
def _get_starttime(token):
    """"
    从内存缓存中根据用户token获取该用户的开始答题时间
    """
    global redis_conn
    return float(redis_conn.get('%s:start_time'%token))

@log_decorator
def get_user_score_in_redis(token):
    """
    从内存缓存中根据token获取用户的总得分
    """ 
    global redis_conn
    return int(redis_conn.get('%s:score'%token))

@log_decorator
def update_user_score_in_redis(token, type):
    """
    更新用户临时分数
    """
    global redis_conn
    redis_conn.incrby('%s:score'%token, TypeScore[type])

@log_decorator
def update_user_score_in_mysql(conn, token, score):
    """
    更新用用最高分数
    并返回最高的分数
    """
    conn.execute('update user set best_score=%s where token=%s and best_score<%s', score, token, score)
    return conn.get('select best_score from user where token=%s', token).best_score

@log_decorator
def _set_starttime(token):
    """
    设置用户开始答题的时间戳
    """
    pass

@log_decorator
def  _get_filters_list(token):
    """
    从内存缓存中获取已经答的题q_id列表
    """
    global redis_conn
    return list(redis_conn.smembers('%s:q_list'%token))


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

@log_decorator
def check_timeout(token, res):
    """
    验证用户答题时间限制, 60s
    """ 
    if time.time() - _get_starttime(token) >= base.TIMEOUT :
        res['status'] = StatusCode.TIMEOUT
        res['info']  = ErrorMsg[res['status']]
        return False
    return True

def check_qtype(type, res):
    """
    >>> res = {}
    >>> check_input(QType.JUDGE, res)
    >>> print  res.get('info', None)
    >>> check_input(5, res)
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

def fetch_one(conn, token, type=QType.SELECT):  
    """
    >>> conn = connect_to_db()
    >>> type = QType.SELECT
    >>> token = 2
    >>> q = fetch_one(conn, token, type)
    >>> print q
    """
    filters = _get_filters_list(token)
    return _fetch_one(conn, type, filters)

def _fetch_one(conn, type, filters=[]):
    """
    >>> conn = connect_to_db()
    >>> type = QType.SELECT
    >>> filters = []
    >>> q = _fetch_one(conn, type, filters)
    >>> print q
    """
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
@log_decorator
def set_ok(res):
    """
    设置状态码为处理成功
    """
    res['status'] = StatusCode.OK
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
    if not msg.times < base.MAX_TIMES:
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
    msg = conn.get('select 1 from question where q_id=%s', q_id)
    if not msg: return False
    sql = 'select 1 from options where q_id=%s and o_id=%s and is_ans=%s'
    msg = conn.get(sql, q_id, o_id, True)
    return True if msg else False 
